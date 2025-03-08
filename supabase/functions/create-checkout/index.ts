
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { corsHeaders } from '../_shared/cors.ts'
import Stripe from 'https://esm.sh/stripe@13.9.0'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request body
    const { productIds } = await req.json()

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid productIds' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user session
    const { data: { session }, error: authError } = await supabaseClient.auth.getSession()

    if (authError || !session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Please log in' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const userId = session.user.id

    // Fetch product information
    const { data: products, error: productsError } = await supabaseClient
      .from('products')
      .select('id, name, price, sale_price')
      .in('id', productIds)

    if (productsError || !products || products.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch products' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Calculate total and prepare line items for Stripe
    const lineItems = products.map(product => {
      const price = product.sale_price !== null ? product.sale_price : product.price
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(price * 100), // Convert to cents
        },
        quantity: 1,
      }
    })

    const totalAmount = products.reduce((sum, product) => {
      const price = product.sale_price !== null ? product.sale_price : product.price
      return sum + price
    }, 0)

    // Create an order in our database
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: userId,
        products: productIds,
        total_amount: totalAmount,
        payment_status: 'pending',
        download_limit: 5,
        download_count: 0,
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      })
      .select()
      .single()

    if (orderError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    // Create Stripe checkout session
    const baseUrl = Deno.env.get('APP_URL') ?? 'http://localhost:5173'
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/dashboard?success=true&order_id=${order.id}`,
      cancel_url: `${baseUrl}/shop?canceled=true`,
      client_reference_id: order.id,
      metadata: {
        order_id: order.id,
        user_id: userId,
      },
    })

    // Update order with payment intent ID
    await supabaseClient
      .from('orders')
      .update({
        payment_intent_id: session.payment_intent,
      })
      .eq('id', order.id)

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Create checkout error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
