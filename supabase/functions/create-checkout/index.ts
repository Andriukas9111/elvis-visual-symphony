
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const APP_URL = Deno.env.get("APP_URL") || "http://localhost:5173";

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
    // Get the JWT token from the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Validate the JWT token using Supabase
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the request body
    const { productIds, successUrl, cancelUrl } = await req.json();

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid product IDs" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch product details from Supabase
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, sale_price, description, preview_image_url")
      .in("id", productIds);

    if (productsError || !products || products.length === 0) {
      console.error("Products error:", productsError);
      return new Response(JSON.stringify({ error: "Products not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate the total amount
    const totalAmount = products.reduce((sum, product) => {
      const price = product.sale_price !== null ? product.sale_price : product.price;
      return sum + price;
    }, 0);

    // Create an order in the database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        products: products.map(p => p.id),
        total_amount: totalAmount,
        payment_status: "pending",
        download_limit: 5,
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order error:", orderError);
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Dynamically import Stripe to use it in the edge function
    const { Stripe } = await import("https://esm.sh/stripe@12.0.0");
    const stripe = new Stripe(STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: products.map((product) => {
        const unitAmount = Math.round((product.sale_price || product.price) * 100);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description || undefined,
              images: product.preview_image_url ? [product.preview_image_url] : undefined,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        };
      }),
      mode: "payment",
      success_url: successUrl || `${APP_URL}/dashboard?success=true&order_id=${order.id}`,
      cancel_url: cancelUrl || `${APP_URL}/shop?canceled=true`,
      customer_email: user.email,
      metadata: {
        order_id: order.id,
        user_id: user.id,
      },
    });

    return new Response(JSON.stringify({ url: session.url, order_id: order.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error creating checkout session: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
