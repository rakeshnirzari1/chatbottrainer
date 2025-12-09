import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { updateOrderStatus } from '../lib/stripe';
import { Logo } from '../components/Logo';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const sessionId = searchParams.get('session_id');

    if (!orderId || !sessionId) {
      setStatus('error');
      return;
    }

    updateOrderStatus(orderId, 'ready', sessionId)
      .then(() => {
        setStatus('success');
      })
      .catch((error) => {
        console.error('Failed to update order:', error);
        setStatus('error');
      });
  }, [searchParams]);

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Loader2 className="w-16 h-16 md:w-20 md:h-20 text-blue-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Processing Payment...</h2>
          <p className="text-gray-600 text-sm md:text-base">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <nav className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between">
          <Logo />
        </nav>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl md:text-4xl">❌</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              There was an issue processing your payment. Please contact support.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <nav className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between">
        <Logo />
      </nav>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
              <CheckCircle className="text-green-600" size={56} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Payment Successful!
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Thank you for your purchase. Your AI chatbot is being prepared.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Training Your Chatbot</h3>
                  <p className="text-gray-600 text-sm">
                    We're processing your website content and training your AI chatbot. This usually takes a few minutes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Check Your Dashboard</h3>
                  <p className="text-gray-600 text-sm">
                    You can monitor the training progress and access your chatbot from your dashboard.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Deploy to Your Website</h3>
                  <p className="text-gray-600 text-sm">
                    Once training is complete, you'll get an embed code to add the chatbot to your website.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 md:p-8 rounded-2xl border border-blue-200 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              If you have any questions or need assistance, our support team is here to help.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition"
            >
              Contact Support →
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Go to Dashboard
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
