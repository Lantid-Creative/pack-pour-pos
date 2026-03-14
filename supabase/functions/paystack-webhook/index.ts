import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_SECRET_KEY) {
      return new Response("Not configured", { status: 500 });
    }

    const body = await req.text();

    // Verify webhook signature
    const signature = req.headers.get("x-paystack-signature");
    const hash = createHmac("sha512", PAYSTACK_SECRET_KEY).update(body).digest("hex");

    if (signature !== hash) {
      console.error("Invalid Paystack webhook signature");
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(body);
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (event.event === "charge.success") {
      const data = event.data;
      const storeId = data.metadata?.store_id;
      const plan = data.metadata?.plan;
      const reference = data.reference;

      if (storeId && plan) {
        const billingCycle = data.metadata?.billing_cycle || 'monthly';
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (billingCycle === 'yearly' ? 365 : 30));

        await adminClient.from("subscriptions").update({
          status: "active",
          plan,
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        }).eq("paystack_reference", reference);

        console.log(`Subscription activated for store ${storeId}, plan: ${plan}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Server error", { status: 500 });
  }
});
