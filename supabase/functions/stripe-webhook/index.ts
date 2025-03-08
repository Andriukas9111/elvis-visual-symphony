
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import Stripe from 'https://esm.sh/stripe@13.9.0'

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret')
      return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), { status: 400 })
    }

    // Get the request body as text
    const body = await req.text()
    
    // Create a Stripe instance
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })
    
    // Verify the webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), { status: 400 })
    }
    
    // Create Supabase admin client (no user auth)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Save event to webhook_events table
    await supabaseAdmin
      .from('webhook_events')
      .insert({
        id: event.id,
        event_type: event.type,
        event_data: event,
      })
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const orderId = session.metadata?.order_id
        
        if (!orderId) {
          console.error('Missing order_id in session metadata')
          return new Response(JSON.stringify({ error: 'Missing order reference' }), { status: 400 })
        }
        
        // Update order status to 'paid'
        const { error: updateError } = await supabaseAdmin
          .from('orders')
          .update({ payment_status: 'paid' })
          .eq('id', orderId)
        
        if (updateError) {
          console.error('Failed to update order:', updateError)
          return new Response(JSON.stringify({ error: 'Failed to update order' }), { status: 500 })
        }
        
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        const { error } = await supabaseAdmin
          .from('orders')
          .update({ payment_status: 'failed' })
          .eq('payment_intent_id', paymentIntent.id)
        
        if (error) {
          console.error('Failed to update order on payment failure:', error)
        }
        
        break
      }
      
      // Add other event types as needed
    }
    
    // Update the webhook event as processed
    await supabaseAdmin
      .from('webhook_events')
      .update({ processed_at: new Date().toISOString() })
      .eq('id', event.id)
    
    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: 'Webhook handler failed' }), { status: 500 })
  }
})
