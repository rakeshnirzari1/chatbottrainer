import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  created_at: string;
  updated_at: string;
}
