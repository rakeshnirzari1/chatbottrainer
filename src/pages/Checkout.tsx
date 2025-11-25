import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bot, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../lib/pricing';
import { supabase } from '../lib/supabase';
import { clearOnboardingState } from '../lib/storage';

interface CheckoutState {
  websiteUrl: string;
  selectedUrls: string[];
  totalUrls: number;
  price: number;
}

export function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const state = location.state as CheckoutState;

  useEffect(() => {
    if (!user) {
      navigate('/onboarding');
      return;
    }

    if (!state || !state.websiteUrl) {
      navigate('/onboarding');
    }
  }, [user, state, navigate]);

  if (!state) return null;

  const handlePayment = async () => {
    if (!user) return;

    setLoading(true);
    setCreating(true);

    try {
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          website_url: state.websiteUrl,
          selected_urls: state.selectedUrls,
          total_urls: state.totalUrls,
          final_price_cents: state.price,
          status: 'payment_received'
        })
        .select()
        .single();

      if (error) throw error;

      clearOnboardingState();

      setCreating(false);

      setTimeout(() => {
        navigate('/dashboard?success=1');
      }, 1500);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
      setLoading(false);
      setCreating(false);
    }
  };

  if (creating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-in zoom-in" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="text-blue-600" size={32} />
          <span className="text-2xl font-bold text-gray-900">ChatbotTrainer</span>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
            Complete Your Order
          </h1>
          <p className="text-gray-600 mb-12 text-center">
            Review your order details and proceed to payment
          </p>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Website</span>
                <span className="font-semibold text-gray-900">{state.websiteUrl}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Number of URLs</span>
                <span className="font-semibold text-gray-900">{state.totalUrls}</span>
              </div>

              <div className="flex justify-between py-4 bg-blue-50 px-4 rounded-lg">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(state.price)}
                </span>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                  <span>Your order will be created immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                  <span>We'll train your chatbot on the selected pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                  <span>You'll receive an embed code when ready</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Complete Purchase {formatPrice(state.price)}
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              By proceeding, you agree to our terms of service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
