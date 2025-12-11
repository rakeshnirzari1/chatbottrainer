import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, LogOut, Loader2, Save, FileText, StickyNote, Download, ChevronDown, ChevronUp, Plus, Trash2, ExternalLink, Copy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin, getAllOrders, updateOrder, Order } from '../lib/admin';
import { formatPrice } from '../lib/pricing';
import { supabase } from '../lib/supabase';

interface EditingOrder {
  id: string;
  status: Order['status'];
  embedCode: string;
  adminInstructions: string;
  adminNotes: string;
}

interface DemoPage {
  id: string;
  company_name: string;
  slug: string;
  embed_code: string;
  created_at: string;
  updated_at: string;
}

export function Admin() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<EditingOrder | null>(null);
  const [expandedUrls, setExpandedUrls] = useState<Set<string>>(new Set());
  const [demoPages, setDemoPages] = useState<DemoPage[]>([]);
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [newDemo, setNewDemo] = useState({ companyName: '', embedCode: '' });
  const [creatingDemo, setCreatingDemo] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndLoadOrders();
  }, [user, navigate]);

  const checkAdminAndLoadOrders = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    const adminStatus = await isAdmin();
    if (!adminStatus) {
      navigate('/dashboard');
      return;
    }

    loadAllOrders();
    loadDemoPages();
  };

  const loadAllOrders = async () => {
    try {
      const ordersData = await getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDemoPages = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDemoPages(data || []);
    } catch (error) {
      console.error('Error loading demo pages:', error);
    }
  };

  const createSlug = (companyName: string): string => {
    return companyName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-demo';
  };

  const handleCreateDemo = async () => {
    if (!newDemo.companyName.trim() || !newDemo.embedCode.trim()) {
      alert('Please fill in both company name and embed code');
      return;
    }

    setCreatingDemo(true);
    try {
      const slug = createSlug(newDemo.companyName);

      const { error } = await supabase
        .from('demo_pages')
        .insert([{
          company_name: newDemo.companyName.trim(),
          slug,
          embed_code: newDemo.embedCode.trim()
        }]);

      if (error) throw error;

      setNewDemo({ companyName: '', embedCode: '' });
      setShowDemoForm(false);
      await loadDemoPages();
      alert(`Demo page created! URL: https://dashbot.com.au/${slug}`);
    } catch (error) {
      console.error('Error creating demo page:', error);
      alert('Failed to create demo page. Please try again.');
    } finally {
      setCreatingDemo(false);
    }
  };

  const handleDeleteDemo = async (id: string, slug: string) => {
    if (!confirm(`Are you sure you want to delete the demo page for "${slug}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('demo_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadDemoPages();
    } catch (error) {
      console.error('Error deleting demo page:', error);
      alert('Failed to delete demo page');
    }
  };

  const copyToClipboard = (slug: string) => {
    const url = `https://dashbot.com.au/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;

    setUpdating(editingOrder.id);

    try {
      await updateOrder(editingOrder.id, {
        status: editingOrder.status,
        embed_code: editingOrder.embedCode.trim() || null,
        admin_instructions: editingOrder.adminInstructions.trim() || null,
        admin_notes: editingOrder.adminNotes.trim() || null,
      });

      await loadAllOrders();
      setEditingOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    } finally {
      setUpdating(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'demo_requested':
        return 'bg-purple-100 text-purple-800';
      case 'demo_ready':
        return 'bg-cyan-100 text-cyan-800';
      case 'payment_received':
        return 'bg-blue-100 text-blue-800';
      case 'training':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadUrls = (order: Order) => {
    const urls = Array.isArray(order.selected_urls) ? order.selected_urls : [];
    const content = urls.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.website_url.replace(/[^a-z0-9]/gi, '_')}_urls.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const toggleUrlsExpanded = (orderId: string) => {
    const newExpanded = new Set(expandedUrls);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedUrls(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between border-b border-gray-200 bg-white/50 backdrop-blur">
        <div className="flex items-center gap-2">
          <Bot className="text-blue-600" size={32} />
          <span className="text-2xl font-bold text-gray-900">DashBot Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-gray-900">Demo Pages</h1>
              <button
                onClick={() => setShowDemoForm(!showDemoForm)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                <Plus size={20} />
                Create Demo Page
              </button>
            </div>

            {showDemoForm && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Demo Page</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={newDemo.companyName}
                      onChange={(e) => setNewDemo({ ...newDemo, companyName: e.target.value })}
                      placeholder="e.g., Richmond High School"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {newDemo.companyName && (
                      <p className="mt-2 text-sm text-gray-600">
                        URL will be: <span className="font-mono font-semibold text-blue-600">
                          https://dashbot.com.au/{createSlug(newDemo.companyName)}
                        </span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Embed Code
                    </label>
                    <textarea
                      value={newDemo.embedCode}
                      onChange={(e) => setNewDemo({ ...newDemo, embedCode: e.target.value })}
                      placeholder='<script src="..." data-bot="..."></script>'
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateDemo}
                      disabled={creatingDemo}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {creatingDemo ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus size={18} />
                          Create Demo Page
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowDemoForm(false);
                        setNewDemo({ companyName: '', embedCode: '' });
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {demoPages.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {demoPages.map((demo) => (
                  <div
                    key={demo.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {demo.company_name}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          /{demo.slug}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteDemo(demo.id, demo.slug)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(`/${demo.slug}`, '_blank')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        <ExternalLink size={16} />
                        View Page
                      </button>
                      <button
                        onClick={() => copyToClipboard(demo.slug)}
                        className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition flex items-center gap-2"
                      >
                        <Copy size={16} />
                        {copiedSlug === demo.slug ? 'Copied!' : 'Copy URL'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center mb-6">
                <p className="text-gray-600">No demo pages created yet</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900">All Orders</h1>
            <div className="text-sm text-gray-600">
              Total Orders: <span className="font-bold text-gray-900">{orders.length}</span>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
              <p className="text-gray-600">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const isEditing = editingOrder?.id === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {order.website_url}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Order ID: {order.id.slice(0, 8)}...
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-6 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-semibold">
                          User ID
                        </label>
                        <p className="text-gray-900 font-mono text-xs">{order.user_id.slice(0, 8)}...</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-semibold">
                          Customer Name
                        </label>
                        <p className="text-gray-900 font-medium">{order.customer_name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-semibold">
                          Phone
                        </label>
                        <p className="text-gray-900 font-medium">{order.customer_phone || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-semibold">
                          Total URLs
                        </label>
                        <p className="text-gray-900 font-medium">{order.total_urls}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-semibold">
                          Price
                        </label>
                        <p className="text-gray-900 font-medium">{formatPrice(order.final_price_cents)}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-semibold">
                          Created
                        </label>
                        <p className="text-gray-900 text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => toggleUrlsExpanded(order.id)}
                          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold transition"
                        >
                          {expandedUrls.has(order.id) ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                          Training URLs ({order.total_urls})
                        </button>
                        <button
                          onClick={() => handleDownloadUrls(order)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                        >
                          <Download size={16} />
                          Download URLs
                        </button>
                      </div>

                      {expandedUrls.has(order.id) && (
                        <div className="mt-3 max-h-60 overflow-y-auto space-y-1">
                          {Array.isArray(order.selected_urls) && order.selected_urls.length > 0 ? (
                            order.selected_urls.map((url: string, index: number) => (
                              <div
                                key={index}
                                className="text-sm text-gray-600 p-2 bg-gray-50 rounded hover:bg-gray-100 transition"
                              >
                                {index + 1}. {url}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 italic">No URLs available</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                            value={isEditing ? editingOrder.status : order.status}
                            onChange={(e) =>
                              setEditingOrder({
                                id: order.id,
                                status: e.target.value as Order['status'],
                                embedCode: order.embed_code || '',
                                adminInstructions: order.admin_instructions || '',
                                adminNotes: order.admin_notes || ''
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="pending">Pending</option>
                            <option value="demo_requested">Demo Requested</option>
                            <option value="demo_ready">Demo Ready</option>
                            <option value="payment_received">Payment Received</option>
                            <option value="training">Training</option>
                            <option value="ready">Ready</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Stripe Payment ID
                          </label>
                          <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700 text-sm font-mono">
                            {order.stripe_payment_intent_id || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <FileText size={16} />
                          Instructions for Client (Visible to Client)
                        </label>
                        <textarea
                          value={isEditing ? editingOrder.adminInstructions : order.admin_instructions || ''}
                          onChange={(e) =>
                            setEditingOrder({
                              id: order.id,
                              status: isEditing ? editingOrder.status : order.status,
                              embedCode: isEditing ? editingOrder.embedCode : order.embed_code || '',
                              adminInstructions: e.target.value,
                              adminNotes: isEditing ? editingOrder.adminNotes : order.admin_notes || ''
                            })
                          }
                          placeholder="Enter instructions for the client (e.g., how to use the chatbot, customization options, etc.)"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <StickyNote size={16} />
                          Admin Notes (Private - Not Visible to Client)
                        </label>
                        <textarea
                          value={isEditing ? editingOrder.adminNotes : order.admin_notes || ''}
                          onChange={(e) =>
                            setEditingOrder({
                              id: order.id,
                              status: isEditing ? editingOrder.status : order.status,
                              embedCode: isEditing ? editingOrder.embedCode : order.embed_code || '',
                              adminInstructions: isEditing ? editingOrder.adminInstructions : order.admin_instructions || '',
                              adminNotes: e.target.value
                            })
                          }
                          placeholder="Internal notes (training progress, issues, etc.)"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-yellow-50"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Embed Code (Visible to Client When Ready)
                        </label>
                        <textarea
                          value={isEditing ? editingOrder.embedCode : order.embed_code || ''}
                          onChange={(e) =>
                            setEditingOrder({
                              id: order.id,
                              status: isEditing ? editingOrder.status : order.status,
                              embedCode: e.target.value,
                              adminInstructions: isEditing ? editingOrder.adminInstructions : order.admin_instructions || '',
                              adminNotes: isEditing ? editingOrder.adminNotes : order.admin_notes || ''
                            })
                          }
                          placeholder="<script>...</script>"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                          rows={4}
                        />
                      </div>

                      {isEditing && (
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={handleUpdateOrder}
                            disabled={updating === order.id}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {updating === order.id ? (
                              <>
                                <Loader2 className="animate-spin" size={18} />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={18} />
                                Save Changes
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setEditingOrder(null)}
                            disabled={updating === order.id}
                            className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
