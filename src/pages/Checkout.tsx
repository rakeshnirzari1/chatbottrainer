import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
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
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          website_url: state.websiteUrl,
          selected_urls: state.selectedUrls,
          total_urls: state.totalUrls,
          final_price_cents: state.price,
          customer_name: formData.name,
          customer_phone: formData.phone,
          status: 'demo_requested'
        })
        .select()
        .single();

      if (error) throw error;

      clearOnboardingState();

      setTimeout(() => {
        navigate('/dashboard');
      }, 2500);
    } catch (error) {
      console.error('Error creating demo request:', error);
      alert('Failed to submit demo request. Please try again.');
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
          <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mx-auto mb-4 animate-in zoom-in" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Demo Request Submitted!</h2>
          <p className="text-gray-600 text-sm md:text-base">
            We'll train an AI chatbot on your website and provide you with a demo to test.
            You'll be able to try it out in your dashboard before making any payment.
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
              <Sparkles size={16} />
              Free Demo Chatbot
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Get Your Demo Chatbot
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              We'll train a demo chatbot on your website so you can test it before purchasing
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

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">What happens next?</h3>
                <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                    <span>We'll train an AI chatbot on your selected pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                    <span>You'll get access to a demo chatbot in your dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                    <span>Test it thoroughly before deciding to purchase</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                    <span>No payment required until you're satisfied</span>
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Request Free Demo
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500">
                By requesting a demo, you agree to our terms of service
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
