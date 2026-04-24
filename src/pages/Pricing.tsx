import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, TrendingUp, Crown, Building2, MessageSquare, Globe, BarChart3, Headphones, RefreshCw, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { isAdmin } from '../lib/admin';
import { pricingTiers, formatPrice } from '../lib/pricing';

const tierIcons: Record<string, typeof Zap> = {
  starter: Zap,
  growth: TrendingUp,
  professional: Crown,
  enterprise: Building2,
};

const tierColors: Record<string, { bg: string; border: string; icon: string; badge: string; button: string; buttonHover: string }> = {
  starter: {
    bg: 'from-slate-50 to-white',
    border: 'border-gray-200',
    icon: 'bg-gray-700',
    badge: '',
    button: 'bg-gray-900 hover:bg-gray-800',
    buttonHover: '',
  },
  growth: {
    bg: 'from-blue-50 to-white',
    border: 'border-blue-300 ring-2 ring-blue-100',
    icon: 'bg-blue-600',
    badge: 'bg-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700',
    buttonHover: '',
  },
  professional: {
    bg: 'from-emerald-50 to-white',
    border: 'border-emerald-200',
    icon: 'bg-emerald-600',
    badge: '',
    button: 'bg-emerald-600 hover:bg-emerald-700',
    buttonHover: '',
  },
  enterprise: {
    bg: 'from-amber-50 to-white',
    border: 'border-amber-200',
    icon: 'bg-amber-600',
    badge: '',
    button: 'bg-amber-600 hover:bg-amber-700',
    buttonHover: '',
  },
};

const tierFeatures: Record<string, string[]> = {
  starter: [
    'Up to 10 trained pages',
    'Unlimited conversations',
    'Basic embed widget',
    'Email support',
    'Monthly content refresh',
  ],
  growth: [
    'Up to 100 trained pages',
    'Unlimited conversations',
    'Customizable widget',
    'Priority email support',
    'Weekly content refresh',
    'Analytics dashboard',
  ],
  professional: [
    'Up to 500 trained pages',
    'Unlimited conversations',
    'Fully branded widget',
    'Priority support',
    'Daily content refresh',
    'Advanced analytics',
    'Custom AI personality',
  ],
  enterprise: [
    'Unlimited pages',
    'Unlimited conversations',
    'White-label solution',
    'Dedicated account manager',
    'Real-time content sync',
    'Advanced analytics & API',
    'Custom AI personality',
    'SLA guarantee',
  ],
};

export function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    (async () => {
      const adminStatus = await isAdmin();
      setIsAdminUser(adminStatus);
    })();
  }, [user]);

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onGetStarted={handleGetStarted} isAdminUser={isAdminUser} />

      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-50 via-blue-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              Simple, Transparent Pricing
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Plans that scale with
              <span className="text-blue-600"> your business</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Start with a free demo, then choose the plan that fits your website.
              Cancel anytime, no lock-in contracts.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {pricingTiers.map((tier) => {
              const Icon = tierIcons[tier.id];
              const colors = tierColors[tier.id];
              return (
                <div
                  key={tier.id}
                  className={`relative bg-gradient-to-br ${colors.bg} rounded-2xl border ${colors.border} p-8 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                >
                  {tier.popular && (
                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 ${colors.badge} text-white text-xs font-bold rounded-full whitespace-nowrap shadow-lg`}>
                      MOST POPULAR
                    </div>
                  )}

                  <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center mb-5`}>
                    <Icon className="text-white" size={24} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">{tier.name}</h3>
                  <p className="text-sm text-gray-500 mb-6">{tier.urlRange}</p>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(tier.priceMonthly)}
                      </span>
                      <span className="text-gray-500 font-medium">/mo</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {tierFeatures[tier.id].map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleGetStarted}
                    className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 ${colors.button} shadow-sm hover:shadow-md`}
                  >
                    Get Started
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Every plan includes
              </h2>
              <p className="text-lg text-gray-600">
                Core features you get no matter which plan you choose
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: MessageSquare, title: 'Unlimited Chats', desc: 'No limits on conversations your chatbot can have with visitors' },
                { icon: Globe, title: 'Easy Integration', desc: 'Simple embed code works with any website platform' },
                { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level encryption protects your data and conversations' },
                { icon: BarChart3, title: 'Usage Analytics', desc: 'Track conversations, popular questions, and visitor engagement' },
                { icon: RefreshCw, title: 'Content Updates', desc: 'Keep your chatbot current with regular content refreshes' },
                { icon: Headphones, title: 'Email Support', desc: 'Our team is here to help you get the most from DashBot' },
              ].map(({ icon: FeatureIcon, title, desc }) => (
                <div key={title} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition">
                  <FeatureIcon className="text-blue-600 mb-3" size={24} />
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: 'Can I try DashBot before subscribing?',
                  a: 'Yes! You can request a free demo chatbot to see how it works with your website before committing to any plan.',
                },
                {
                  q: 'Can I change plans later?',
                  a: 'Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.',
                },
                {
                  q: 'What happens if I exceed my URL limit?',
                  a: 'Your chatbot will continue working with the pages already trained. To add more pages, simply upgrade to a higher plan.',
                },
                {
                  q: 'Is there a long-term contract?',
                  a: 'No. All plans are month-to-month with no lock-in. You can cancel anytime and your chatbot will remain active until the end of your billing period.',
                },
                {
                  q: 'How does content refresh work?',
                  a: 'We periodically re-crawl your selected pages to keep your chatbot up to date. The frequency depends on your plan -- from monthly on Starter to real-time on Enterprise.',
                },
              ].map(({ q, a }) => (
                <div key={q} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Create your free demo chatbot in under 5 minutes. No credit card required.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-10 py-5 bg-white text-blue-600 text-lg rounded-xl font-bold hover:bg-gray-100 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Start Your Free Demo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
