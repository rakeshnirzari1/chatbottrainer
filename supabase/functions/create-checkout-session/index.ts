import Stripe from 'npm:stripe@17.4.0';
import { createClient } from 'npm:@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface CheckoutRequest {
  websiteUrl: string;
  selectedUrls: string[];
  totalUrls: number;
  price: number;
  customerName: string;
  customerPhone: string;
}

function getPriceId(urlCount: number): string | null {
  if (urlCount <= 10) return Deno.env.get('STRIPE_PRICE_1_10_URLS');
  if (urlCount <= 50) return Deno.env.get('STRIPE_PRICE_11_50_URLS');
  if (urlCount <= 200) return Deno.env.get('STRIPE_PRICE_51_200_URLS');
  if (urlCount <= 500) return Deno.env.get('STRIPE_PRICE_201_500_URLS');
  if (urlCount <= 1000) return Deno.env.get('STRIPE_PRICE_501_1000_URLS');
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
    });

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const requestData: CheckoutRequest = await req.json();
    const { websiteUrl, selectedUrls, totalUrls, price, customerName, customerPhone } = requestData;

    const priceId = getPriceId(totalUrls);
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: 'Invalid URL count or price ID not configured' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        website_url: websiteUrl,
        selected_urls: selectedUrls,
        total_urls: totalUrls,
        final_price_cents: price,
        customer_name: customerName,
        customer_phone: customerPhone,
        status: 'pending_payment',
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    const origin = req.headers.get('origin') || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${origin}/checkout`,
      customer_email: user.email,
      metadata: {
        order_id: order.id,
        user_id: user.id,
        website_url: websiteUrl,
        total_urls: totalUrls.toString(),
      },
    });

    return new Response(
      JSON.stringify({ sessionUrl: session.url, orderId: order.id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
