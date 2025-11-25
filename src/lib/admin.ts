import { supabase } from './supabase';

export async function isAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('No user logged in');
    return false;
  }

  console.log('Checking admin status for user:', user.id);

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }

  console.log('Admin check result:', data);
  return !!data;
}

export interface Order {
  id: string;
  user_id: string;
  website_url: string;
  selected_urls: string[];
  total_urls: number;
  final_price_cents: number;
  stripe_payment_intent_id: string | null;
  status: 'pending' | 'payment_received' | 'training' | 'ready';
  embed_code: string | null;
  admin_instructions: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  return data || [];
}

export async function updateOrder(
  orderId: string,
  updates: {
    status?: Order['status'];
    embed_code?: string;
    admin_instructions?: string;
    admin_notes?: string;
  }
): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

export async function getUserEmail(userId: string): Promise<string> {
  const { data, error } = await supabase
    .from('orders')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    return 'Unknown';
  }

  return userId;
}
