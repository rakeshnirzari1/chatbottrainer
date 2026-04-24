import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Zap, Star, Building2, Rocket, MessageSquare, Code2, RefreshCw, Headphones, BarChart3, Globe, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { isAdmin } from '../lib/admin';
import { PRICING_TIERS } from '../lib/pricing';

const TIER_ICONS = [Zap, Star, Building2, Rocket];
const TIER_COLORS = [
  { bg: 'from-slate-50 to-white', border: 'border-gray-200', accent: 'bg-gray-900', badge: '' },
  { bg: 'from-blue-50 to-white', border: 'border-blue-400 ring-2 ring-blue-100', accent: 'bg-blue-600', badge: 'bg-blue-600' },
  { bg: 'from-slate-50 to-white', border: 'border-gray-200', accent: 'bg-gray-900', badge: '' },
  { bg: 'from-slate-50 to-white', border: 'border-gray-200', accent: 'bg-gray-900', badge: '' },
];

const FEATURES_ALL = [
  'AI-powered chatbot trained on your content',
  'Unlimited conversations and messages',
  'Easy website integration with embed code',
  'Regular updates and improvements',
  'Email support',
];

const FEATURES_BY_TIER = [
  ['Up to 10 website pages', 'Standard response speed', 'Basic analytics'],
  ['Up to 100 website pages', 'Priority response speed', 'Advanced analytics', 'Custom branding'],
  ['Up to 500 website pages', 'Fastest response speed', 'Full analytics suite', 'Custom branding', 'Priority support'],
  ['Unlimited website pages', 'Fastest response speed', 'Full analytics suite', 'Custom branding', 'Dedicated account manager', 'Custom integrations'],
];

export function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, [user]);

  const checkAdmin = async () => {
    const adminStatus = await isAdmin();
    setIsAdminUser(adminStatus);
  };

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onGetStarted={handleGetStarted} isAdminUser={isAdminUser} />

      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-50 via-blue-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              Simple, Transparent Pricing
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Choose the plan that fits your business
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Start with a free demo, then subscribe when you're ready. Cancel anytime. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {PRICING_TIERS.map((tier, index) => {
              const Icon = TIER_ICONS[index];
              const colors = TIER_COLORS[index];

              return (
                <div
                  key={tier.id}
                  className={`relative bg-gradient-to-br ${colors.bg} rounded-2xl border-2 ${colors.border} p-8 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className={`px-4 py-1.5 ${colors.badge} text-white text-xs font-bold rounded-full shadow-lg`}>
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className={`w-12 h-12 ${colors.accent} rounded-xl flex items-center justify-center mb-5`}>
                    <Icon className="text-white" size={24} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">{tier.label}</h3>
                  <p className="text-sm text-gray-500 mb-6">{tier.urlRange}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${tier.priceMonthly.toFixed(2)}</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>

                  <button
                    onClick={handleGetStarted}
                    className={`w-full py-3 rounded-xl font-semibold transition mb-8 ${
                      tier.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    Start Free Demo
                  </button>

                  <div className="space-y-3 flex-1">
                    {FEATURES_BY_TIER[index].map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <CheckCircle className={`flex-shrink-0 mt-0.5 ${tier.popular ? 'text-blue-600' : 'text-green-500'}`} size={16} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Every plan includes
            </h2>
            <p className="text-lg text-gray-600">
              Core features available on all subscription tiers
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: MessageSquare, title: 'Unlimited Conversations', desc: 'No caps on messages or conversations with your visitors' },
              { icon: Code2, title: 'Easy Embed Code', desc: 'Add to any website with a single line of code' },
              { icon: RefreshCw, title: 'Regular Updates', desc: 'Continuous improvements and new features at no extra cost' },
              { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level encryption protects your data and conversations' },
              { icon: Globe, title: 'Works Everywhere', desc: 'Compatible with WordPress, Shopify, custom sites, and more' },
              { icon: Headphones, title: 'Email Support', desc: 'Our team is ready to help with setup and optimization' },
            ].map(({ icon: FeatureIcon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-6 rounded-xl hover:bg-slate-50 transition">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FeatureIcon className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: 'Can I change my plan later?',
                a: 'Yes! You can upgrade or downgrade your subscription at any time. Changes take effect at the start of your next billing cycle.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Every plan starts with a free demo chatbot so you can see exactly how it works with your website content before subscribing.',
              },
              {
                q: 'What happens if I cancel?',
                a: 'You can cancel anytime. Your chatbot will remain active until the end of your current billing period. No cancellation fees.',
              },
              {
                q: 'What counts as a URL?',
                a: 'Each unique page on your website counts as one URL. For example, your homepage, about page, and each product page each count as one URL.',
              },
              {
                q: 'Can I add more URLs later?',
                a: 'Absolutely. If your website grows beyond your current plan, simply upgrade to a higher tier to include more pages.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Try your free demo chatbot today. No credit card required.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-10 py-5 bg-white text-blue-600 text-lg rounded-xl font-bold hover:bg-gray-100 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Start Free Demo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
