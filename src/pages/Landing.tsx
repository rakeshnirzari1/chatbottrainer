import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Zap, Shield, TrendingUp, CheckCircle, MessageSquare, Clock, Globe, BarChart3, Users, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { isAdmin } from '../lib/admin';

export function Landing() {
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

      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              AI-Powered Customer Support
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Website Into an Intelligent
              <span className="text-blue-600"> AI Chatbot</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Train a custom AI chatbot on your website content in minutes. Provide instant, accurate answers to your visitors without writing a single line of code. Teach Your Website to Talk. Based in Sydney, Australia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-blue-600 text-white text-lg rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 text-lg rounded-xl font-bold hover:bg-gray-50 transition"
              >
                Learn More
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-6">No credit card required. Setup in under 5 minutes.</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-gray-100">
  <div className="container mx-auto px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
          Trusted by Leading Organizations
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center justify-items-center">
        <a 
          href="https://chatswoodpodiatry.com.au" 
          target="_blank" 
          rel="noopener noreferrer"
          className="grayscale hover:grayscale-0 transition duration-300 opacity-60 hover:opacity-100 block"
        >
          <img
            src="/chatswoodpodiatry.jpg"
            alt="Chatswood Podiatry"
            className="h-16 w-auto object-contain"
          />
        </a>
        <a 
          href="https://gpvacancy.com.au" 
          target="_blank" 
          rel="noopener noreferrer"
          className="grayscale hover:grayscale-0 transition duration-300 opacity-60 hover:opacity-100 block"
        >
          <img
            src="/gpvacancy.png"
            alt="GP Vacancy"
            className="h-16 w-auto object-contain"
          />
        </a>
        <a 
          href="https://dashbot.com.au" 
          target="_blank" 
          rel="noopener noreferrer"
          className="grayscale hover:grayscale-0 transition duration-300 opacity-60 hover:opacity-100 block"
        >
          <img
            src="/dashbot.png"
            alt="DashBot"
            className="h-16 w-auto object-contain"
          />
        </a>
      </div>
    </div>
  </div>
</section>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose DashBot?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to deliver exceptional customer support with AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast Setup</h3>
              <p className="text-gray-600 leading-relaxed">
                Simply paste your website URL and our AI will automatically crawl, analyze, and train your chatbot in minutes. No technical knowledge required.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Enterprise Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is protected with bank-level encryption. We only access the public pages you explicitly select and approve.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Boost Engagement</h3>
              <p className="text-gray-600 leading-relaxed">
                Keep visitors on your site longer with instant, accurate answers. Increase conversions by helping customers find what they need.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Natural Conversations</h3>
              <p className="text-gray-600 leading-relaxed">
                Powered by advanced AI that understands context and intent, delivering human-like responses that feel personal and helpful.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl border border-cyan-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <Clock className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">24/7 Availability</h3>
              <p className="text-gray-600 leading-relaxed">
                Your chatbot never sleeps. Provide instant support to customers across all time zones, day and night.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-100 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Globe className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Easy Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                Add to any website with a simple embed code. Works seamlessly with WordPress, Shopify, custom sites, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Get your AI chatbot up and running in three simple steps
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Enter Your Website URL</h3>
                  <p className="text-gray-600 text-lg">
                    Simply paste your website URL and our intelligent crawler will discover all your pages. You can review and select which pages to include in the training.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Training Process</h3>
                  <p className="text-gray-600 text-lg">
                    Our advanced AI analyzes your content, understanding the context, relationships, and key information to create an intelligent knowledge base.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Deploy & Engage</h3>
                  <p className="text-gray-600 text-lg">
                    Copy the embed code and add it to your website. Your AI chatbot is now live and ready to help your visitors instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted By Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join many companies using AI to improve customer experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-gray-100">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">10+</div>
              <p className="text-gray-600 font-medium">Active Chatbots</p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-gray-100">
              <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">5K+</div>
              <p className="text-gray-600 font-medium">Conversations Handled</p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-gray-100">
              <BarChart3 className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
              <p className="text-gray-600 font-medium">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600">
                One-time payment based on your website size. No subscriptions or hidden fees.
              </p>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
              <div className="space-y-4 mb-8">
                {[
                  { range: '1-10 URLs', price: '$100', popular: false },
                  { range: '11-50 URLs', price: '$200', popular: true },
                  { range: '51-200 URLs', price: '$500', popular: false },
                  { range: '201-500 URLs', price: '$900', popular: false },
                  { range: '501-1,000 URLs', price: '$1,200', popular: false }
                ].map((tier) => (
                  <div
                    key={tier.range}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 rounded-xl border-2 transition ${
                      tier.popular
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className={tier.popular ? "text-blue-600 flex-shrink-0" : "text-green-500 flex-shrink-0"} size={24} />
                      <span className="text-lg font-semibold text-gray-900">{tier.range}</span>
                      {tier.popular && (
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full whitespace-nowrap">
                          MOST POPULAR
                        </span>
                      )}
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">{tier.price}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl">
                <div className="flex items-start gap-3 mb-3">
                  <Lock className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">What's Included:</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• AI-powered chatbot trained on your content</li>
                      <li>• Unlimited conversations and messages</li>
                      <li>• Easy website integration with embed code</li>
                      <li>• Regular updates and improvements</li>
                      <li>• Email support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Customer Support?
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-90">
              Join thousands of businesses using AI to provide instant, accurate support to their customers.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-10 py-5 bg-white text-blue-600 text-lg rounded-xl font-bold hover:bg-gray-100 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Start Building Your Chatbot Now
            </button>
            <p className="text-sm mt-6 opacity-75">Setup takes less than 5 minutes. No credit card required.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
