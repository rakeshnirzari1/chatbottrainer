import { supabase } from './supabase';

export interface CheckoutSessionData {
  websiteUrl: string;
  selectedUrls: string[];
  totalUrls: number;
  price: number;
  customerName: string;
  customerPhone: string;
  existingOrderId?: string;
}

export async function createCheckoutSession(data: CheckoutSessionData): Promise<{ sessionUrl: string; orderId: string }> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('You must be logged in to proceed with checkout');
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  return await response.json();
}

export async function updateOrderStatus(orderId: string, status: string, stripeSessionId?: string) {
  const updateData: any = { status };

  if (stripeSessionId) {
    updateData.stripe_session_id = stripeSessionId;
  }

  if (status === 'paid') {
    updateData.paid_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);

  if (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
}
