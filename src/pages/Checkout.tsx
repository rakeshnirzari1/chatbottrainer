import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Sparkles, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession } from '../lib/stripe';
import { clearOnboardingState } from '../lib/storage';
import { Logo } from '../components/Logo';

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
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: user?.email || ''
  });

  const state = location.state as CheckoutState;

  useEffect(() => {
    if (!user) {
      navigate('/onboarding');
      return;
    }

    if (!state || !state.websiteUrl) {
      navigate('/onboarding');
    }

    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user, state, navigate]);

  if (!state) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSubmitting(true);

    try {
      const { sessionUrl } = await createCheckoutSession({
        websiteUrl: state.websiteUrl,
        selectedUrls: state.selectedUrls,
        totalUrls: state.totalUrls,
        price: state.price,
        customerName: formData.name,
        customerPhone: formData.phone,
      });

      clearOnboardingState();

      window.location.href = sessionUrl;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Loader2 className="w-16 h-16 md:w-20 md:h-20 text-blue-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Redirecting to Payment...</h2>
          <p className="text-gray-600 text-sm md:text-base">
            Please wait while we securely redirect you to Stripe checkout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <nav className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between">
        <Logo />
      </nav>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              <ShoppingCart size={16} />
              Secure Checkout
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Complete Your Purchase
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Review your order details and proceed to secure payment
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 mb-6">
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Website Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between flex-wrap gap-2">
                  <span>Website:</span>
                  <span className="font-medium text-gray-900 break-all">{state.websiteUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span>URLs to train:</span>
                  <span className="font-medium text-gray-900">{state.totalUrls}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+61 XXX XXX XXX"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Secure Payment</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-2">
                  Your payment is processed securely through Stripe. We never store your credit card information.
                </p>
                <p className="text-xs md:text-sm text-gray-600">
                  After payment, we'll train your AI chatbot and you'll get instant access in your dashboard.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Proceed to Payment
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500">
                By proceeding, you agree to our terms of service
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
