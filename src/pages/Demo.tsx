import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function Demo() {
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://your.dashbot.com.au/bot.js';
    script.setAttribute('data-bot', 'RHS_BOT');
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://your.dashbot.com.au/bot.js"]');
      if (existingScript) {
        existingScript.remove();
      }

      const chatWidget = document.querySelector('[id*="dashbot"], [class*="dashbot"], [id*="chat"], iframe[src*="dashbot"]');
      if (chatWidget) {
        chatWidget.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col">
      <Header />

      <div className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                <Sparkles size={16} />
                Live Demo
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Experience AI-Powered Customer Support
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Try our intelligent chatbot in action. Ask questions, test its knowledge, and see how it can transform your customer service.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Interactive Chatbot Demo</h2>
                  <p className="text-gray-600">Click the chat icon in the bottom right to start</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">How to Test:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <p className="text-gray-700">
                      <strong>Look for the chat widget</strong> - You'll see a chat icon in the bottom right corner of your screen
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <p className="text-gray-700">
                      <strong>Click to open</strong> - The chatbot interface will slide up, ready for your questions
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <p className="text-gray-700">
                      <strong>Ask anything</strong> - Type your questions about products, services, or general inquiries
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      4
                    </div>
                    <p className="text-gray-700">
                      <strong>Test the knowledge</strong> - See how accurately it responds based on your website content
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Pro Tip:</strong> Try asking specific questions about your business, products, or services. The chatbot has been trained on your website content to provide accurate, helpful responses.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Our AI Chatbots?</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">24/7 Availability</h3>
                    <p className="text-gray-600 text-sm">Never miss a customer inquiry, even outside business hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Instant Responses</h3>
                    <p className="text-gray-600 text-sm">Customers get immediate answers without waiting</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Trained on Your Content</h3>
                    <p className="text-gray-600 text-sm">Responses are based on your actual website information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Easy Integration</h3>
                    <p className="text-gray-600 text-sm">Simple embed code - add to your site in minutes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 sm:p-8 text-white text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Get Your Own Chatbot?</h2>
              <p className="text-lg mb-6 text-blue-50">
                Transform your customer service with an AI-powered chatbot trained on your website
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/onboarding')}
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-50 transition shadow-lg inline-flex items-center justify-center gap-2"
                >
                  Get Started Now
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-8 py-4 bg-blue-700 text-white rounded-lg font-bold text-lg hover:bg-blue-800 transition border-2 border-white"
                >
                  Contact Us
                </button>
              </div>
              <p className="text-sm text-blue-100 mt-4">
                Get a free demo first, then decide if you want to proceed
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
