import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Verify the calling user is authenticated and is an owner
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY') || '', {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user: callingUser }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !callingUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { email, full_name, role, store_id } = await req.json();

    // Verify caller is owner of this store
    const { data: callerRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', callingUser.id)
      .eq('store_id', store_id)
      .single();

    if (!callerRole || callerRole.role !== 'owner') {
      return new Response(JSON.stringify({ error: 'Only store owners can create staff accounts' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if owner has lifetime access
    const { data: ownerProfile } = await supabaseAdmin
      .from('profiles')
      .select('lifetime_access')
      .eq('user_id', callingUser.id)
      .single();

    const hasLifetimeAccess = ownerProfile?.lifetime_access === true;

    // Check subscription plan — Starter plan cannot add staff (unless lifetime access)
    if (!hasLifetimeAccess) {
      const { data: activeSub } = await supabaseAdmin
        .from('subscriptions')
        .select('plan')
        .eq('store_id', store_id)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle();

      // If no active subscription or on starter plan, block staff creation
      if (!activeSub || activeSub.plan === 'starter') {
        return new Response(JSON.stringify({ error: 'Starter plan does not allow adding staff. Please upgrade to Business or Enterprise.' }), {
          status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Create the user account
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: 'TempPass123!', // Temporary password, user should change
      email_confirm: true,
      user_metadata: { full_name }
    });

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Upsert profile (trigger may or may not have created it)
    await supabaseAdmin
      .from('profiles')
      .upsert(
        { user_id: newUser.user.id, full_name, store_id },
        { onConflict: 'user_id' }
      );

    // Assign role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: newUser.user.id, store_id, role });

    if (roleError) {
      return new Response(JSON.stringify({ error: roleError.message }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user: { id: newUser.user.id, email, full_name, role },
      message: `Staff account created. Temporary password: TempPass123!`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
