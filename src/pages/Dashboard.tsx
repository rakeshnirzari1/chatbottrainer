import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Copy, CheckCircle, Clock, Rocket, FileText, LogOut, CreditCard, Bot } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from '../components/Footer';
import { Logo } from '../components/Logo';
import { supabase, Order } from '../lib/supabase';
import { formatPrice } from '../lib/pricing';
import { isAdmin } from '../lib/admin';

export function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    if (searchParams.get('success') === '1') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }

    checkAdmin();
    loadOrders();
  }, [user, navigate, searchParams]);

  const checkAdmin = async () => {
    const adminStatus = await isAdmin();
    setIsAdminUser(adminStatus);
  };

  const loadOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['demo_requested', 'demo_ready', 'ready'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmbed = (orderId: string, embedCode: string) => {
    navigator.clipboard.writeText(embedCode);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending Payment',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
      case 'demo_requested':
        return {
          icon: Clock,
          text: 'Demo Requested',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100'
        };
      case 'demo_ready':
        return {
          icon: Rocket,
          text: 'Demo Ready',
          color: 'text-cyan-600',
          bgColor: 'bg-cyan-100'
        };
      case 'payment_received':
        return {
          icon: Clock,
          text: 'Training in Progress',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        };
      case 'training':
        return {
          icon: Loader2,
          text: 'Training in Progress',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        };
      case 'ready':
        return {
          icon: CheckCircle,
          text: 'Ready',
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col">
        <nav className="container mx-auto px-6 py-6 flex items-center justify-between border-b border-gray-200 bg-white/50 backdrop-blur">
          <Logo />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </nav>
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col">
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between border-b border-gray-200 bg-white/50 backdrop-blur">
        <Logo />
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </nav>

      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle size={20} />
          Payment successful! Your chatbot is being trained.
        </div>
      )}

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Chatbots</h1>
              <p className="text-gray-600">Manage your trained chatbots and embed codes</p>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Rocket size={20} />
              Create New Chatbot
            </button>
          </div>

          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="font-semibold text-green-900">Order created successfully!</p>
                <p className="text-sm text-green-700">
                  Your chatbot training is in progress. You'll receive an embed code when ready.
                </p>
              </div>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
              <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No chatbots yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first chatbot to get started
              </p>
              <button
                onClick={() => navigate('/onboarding')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Create Chatbot
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={order.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {order.website_url}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{order.total_urls} URLs</span>
                          <span>•</span>
                          <span>{formatPrice(order.final_price_cents)}</span>
                          <span>•</span>
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bgColor}`}
                      >
                        <StatusIcon
                          className={`${statusInfo.color} ${order.status === 'training' ? 'animate-spin' : ''}`}
                          size={18}
                        />
                        <span className={`font-semibold ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                    </div>

                    {order.admin_instructions && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="text-blue-600" size={18} />
                          <label className="font-semibold text-blue-900">Instructions</label>
                        </div>
                        <div className="text-sm text-blue-800 whitespace-pre-wrap">
                          {order.admin_instructions}
                        </div>
                      </div>
                    )}

                    {order.status === 'demo_requested' && (
                      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="text-purple-600" size={18} />
                          <p className="font-semibold text-purple-900">Demo Being Prepared</p>
                        </div>
                        <p className="text-sm text-purple-800">
                          Your demo is being prepared! We're training an AI chatbot on your {order.total_urls} selected pages.
                          You'll be notified when it's ready to test.
                        </p>
                      </div>
                    )}

                    {(order.status === 'demo_ready' || order.status === 'ready') && order.embed_code && (
                      <div className="mt-4 space-y-4">
                        <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Rocket className="text-cyan-600" size={18} />
                            <label className="font-semibold text-cyan-900">
                              {order.status === 'demo_ready' ? 'Demo Chatbot Preview' : 'Your Chatbot'}
                            </label>
                          </div>
                          <div className="bg-white rounded-lg border border-cyan-300 overflow-hidden">
                            <iframe
                              srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${order.embed_code}</body></html>`}
                              className="w-full h-96 border-0"
                              title="Chatbot Preview"
                              sandbox="allow-scripts allow-same-origin"
                            />
                          </div>
                          <p className="text-sm text-cyan-700 mt-2">
                            Interact with your chatbot above to see it in action!
                          </p>
                        </div>

                        {order.status === 'demo_ready' && (
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div>
                                <p className="font-semibold text-gray-900 mb-1">Ready to go live?</p>
                                <p className="text-sm text-gray-600">
                                  Complete payment to receive the embed code and deploy to your website
                                </p>
                              </div>
                              <button
                                onClick={() => alert('Payment integration coming soon!')}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition whitespace-nowrap"
                              >
                                <CreditCard size={18} />
                                Pay {formatPrice(order.final_price_cents)}
                              </button>
                            </div>
                          </div>
                        )}

                        {order.status === 'ready' && (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <label className="font-semibold text-green-900 flex items-center gap-2">
                                <CheckCircle className="text-green-600" size={18} />
                                Your Chatbot is Ready!
                              </label>
                              <button
                                onClick={() => handleCopyEmbed(order.id, order.embed_code!)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                              >
                                {copiedId === order.id ? (
                                  <>
                                    <CheckCircle size={16} />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy size={16} />
                                    Copy Embed Code
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="bg-white p-4 rounded border border-green-300 text-xs overflow-x-auto font-mono">
                              <code>{order.embed_code}</code>
                            </pre>
                            <div className="mt-4 p-3 bg-white rounded border border-green-200">
                              <p className="font-semibold text-gray-900 mb-2 text-sm">How to add to your website:</p>
                              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                <li>Copy the embed code above using the button</li>
                                <li>Open your website's HTML file</li>
                                <li>Paste the code just before the closing <code className="bg-gray-100 px-1 rounded">&lt;/body&gt;</code> tag</li>
                                <li>Save and publish - your chatbot will appear automatically!</li>
                              </ol>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {(order.status === 'payment_received' || order.status === 'training') && (
                      <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Loader2 className="text-orange-600 animate-spin" size={18} />
                          <p className="font-semibold text-orange-900">Training in Progress</p>
                        </div>
                        <p className="text-sm text-orange-800">
                          Your chatbot is being trained on {order.total_urls} pages. This process
                          typically takes 24-48 hours. You'll see the embed code here once it's ready.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
