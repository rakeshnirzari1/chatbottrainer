import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, LogOut, Loader2, Save, FileText, StickyNote, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin, getAllOrders, updateOrder, Order } from '../lib/admin';
import { formatPrice } from '../lib/pricing';

interface EditingOrder {
  id: string;
  status: Order['status'];
  embedCode: string;
  adminInstructions: string;
  adminNotes: string;
}

export function Admin() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<EditingOrder | null>(null);
  const [expandedUrls, setExpandedUrls] = useState<Set<string>>(new Set());

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
          <span className="text-2xl font-bold text-gray-900">ChatbotTrainer Admin</span>
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

                    <div className="grid md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-semibold">
                          User ID
                        </label>
                        <p className="text-gray-900 font-mono text-xs">{order.user_id.slice(0, 8)}...</p>
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
