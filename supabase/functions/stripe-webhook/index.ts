
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Initialize the Supabase client with the service role key to bypass RLS
const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the signature from the headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    // Get the raw body as text
    const body = await req.text();

    // Dynamically import Stripe to use it in the edge function
    const { Stripe } = await import("https://esm.sh/stripe@12.0.0");
    const stripe = new Stripe(STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });

    let event;
    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Store the event
    const { data: eventRecord, error: storeError } = await supabase
      .from("webhook_events")
      .insert({
        id: event.id,
        event_type: event.type,
        event_data: event,
      });

    if (storeError) {
      console.error(`Error storing webhook event: ${storeError.message}`);
      return new Response(JSON.stringify({ error: storeError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle specific event types
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // Process the order
      const { error: orderError } = await supabase
        .from("orders")
        .update({ 
          payment_status: "paid",
          payment_intent_id: session.payment_intent,
        })
        .eq("id", session.metadata.order_id)
        .select();

      if (orderError) {
        console.error(`Error updating order: ${orderError.message}`);
        return new Response(JSON.stringify({ error: orderError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Mark event as processed
      await supabase
        .from("webhook_events")
        .update({ processed_at: new Date().toISOString() })
        .eq("id", event.id);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
