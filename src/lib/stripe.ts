import { supabase } from './supabase';

export interface CheckoutSessionData {
  sessionId: string;
  url: string;
}

export const createCheckoutSession = async (
  priceId: string,
  mode: 'payment' | 'subscription' = 'payment'
): Promise<CheckoutSessionData> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session?.access_token) {
    throw new Error('User not authenticated');
  }

  const baseUrl = window.location.origin;
  const successUrl = `${baseUrl}/success`;
  const cancelUrl = `${baseUrl}/pricing`;

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price_id: priceId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      mode,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create checkout session');
  }

  return await response.json();
};

export const getUserSubscription = async () => {
  const { data, error } = await supabase
    .from('stripe_user_subscriptions')
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getUserOrders = async () => {
  const { data, error } = await supabase
    .from('stripe_user_orders')
    .select('*')
    .order('order_date', { ascending: false });

  if (error) throw error;
  return data || [];
};