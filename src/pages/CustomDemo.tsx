import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, MessageSquare, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { supabase } from '../lib/supabase';

interface DemoPage {
  id: string;
  company_name: string;
  slug: string;
  embed_code: string;
}

export function CustomDemo() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [demoPage, setDemoPage] = useState<DemoPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDemoPage();
  }, [slug]);

  useEffect(() => {
    if (!demoPage) return;

    const existingScript = document.querySelector(`script[data-demo-slug="${demoPage.slug}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = demoPage.embed_code.trim();
    const scriptElement = tempDiv.querySelector('script');

    if (scriptElement) {
      const script = document.createElement('script');
      script.src = scriptElement.src;
      script.setAttribute('data-demo-slug', demoPage.slug);

      Array.from(scriptElement.attributes).forEach(attr => {
        if (attr.name !== 'src') {
          script.setAttribute(attr.name, attr.value);
        }
      });

      script.onload = () => {
        console.log('Chatbot script loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load chatbot script');
      };

      document.body.appendChild(script);
    }

    return () => {
      const scriptToRemove = document.querySelector(`script[data-demo-slug="${demoPage.slug}"]`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }

      const allWidgets = document.querySelectorAll('[id*="dashbot"], [class*="dashbot"], [id*="chat-widget"], [class*="chat-widget"], iframe[src*="dashbot"], [data-bot]');
      allWidgets.forEach(widget => widget.remove());

      const shadowHosts = document.querySelectorAll('*');
      shadowHosts.forEach(host => {
        if (host.shadowRoot) {
          const shadowChat = host.shadowRoot.querySelector('[id*="chat"], [class*="chat"], [id*="bot"], [class*="bot"]');
          if (shadowChat) {
            host.remove();
          }
        }
      });

      if (window.dashbot) {
        delete window.dashbot;
      }
    };
  }, [demoPage]);

  const loadDemoPage = async () => {
    if (!slug) {
      navigate('/');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('demo_pages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        navigate('/');
        return;
      }

      setDemoPage(data);
    } catch (error) {
      console.error('Error loading demo page:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!demoPage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <Sparkles size={16} />
              Custom Demo for {demoPage.company_name}
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Experience Your AI-Powered Chatbot
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've created this personalized demo specifically for {demoPage.company_name}.
              Test our intelligent chatbot trained with your industry-specific knowledge.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Try It Now
            </h2>
            <p className="text-lg text-gray-600 text-center mb-8">
              Click the chat widget in the bottom right corner to start a conversation.
              Ask questions relevant to {demoPage.company_name} and see how our AI responds.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-2xl">
                <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Smart Responses</h3>
                <p className="text-sm text-gray-600">
                  Get instant, accurate answers tailored to your needs
                </p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-2xl">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">24/7 Availability</h3>
                <p className="text-sm text-gray-600">
                  Always ready to assist your visitors anytime
                </p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-2xl">
                <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Custom Training</h3>
                <p className="text-sm text-gray-600">
                  Trained specifically on your content and industry
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Your Own Chatbot?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Transform your website with an AI assistant that understands your business.
                Join companies already using DashBot to enhance customer engagement.
              </p>
              <button
                onClick={() => window.location.href = 'https://dashbot.com.au'}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
              >
                Get Started Now
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Try These Sample Questions
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Not sure what to ask? Try these questions to see how our chatbot responds:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-700">What services does {demoPage.company_name} offer?</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-700">How can I get in touch with {demoPage.company_name}?</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-700">What makes {demoPage.company_name} unique?</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-700">Tell me more about your programs and offerings</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
