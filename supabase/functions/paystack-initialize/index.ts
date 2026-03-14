import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PLAN_PRICES: Record<string, Record<string, number>> = {
  starter:    { monthly: 500000,   yearly: 4800000 },
  business:   { monthly: 1500000,  yearly: 14400000 },
  enterprise: { monthly: 5000000,  yearly: 48000000 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    const userEmail = claimsData.claims.email;

    const { plan, store_id, callback_url } = await req.json();

    if (!plan || !store_id || !callback_url) {
      return new Response(JSON.stringify({ error: "Missing required fields: plan, store_id, callback_url" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amount = PLAN_PRICES[plan];
    if (!amount) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Paystack not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reference = `bulkdrink_${store_id.slice(0, 8)}_${Date.now()}`;

    // Initialize Paystack transaction
    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        amount,
        reference,
        callback_url,
        metadata: {
          store_id,
          plan,
          user_id: userId,
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      throw new Error(`Paystack init failed [${paystackRes.status}]: ${JSON.stringify(paystackData)}`);
    }

    // Create pending subscription record
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await adminClient.from("subscriptions").upsert({
      store_id,
      plan,
      status: "pending",
      paystack_reference: reference,
      amount,
      currency: "NGN",
    }, { onConflict: "store_id" });

    return new Response(
      JSON.stringify({
        authorization_url: paystackData.data.authorization_url,
        reference,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error initializing payment:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
