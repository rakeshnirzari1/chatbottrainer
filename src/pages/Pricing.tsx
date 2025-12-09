import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createCheckoutSession, getUserSubscription, getUserOrders } from '../lib/stripe';
import { stripeProducts, getProductByPriceId } from '../stripe-config';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Bot, CheckCircle, CreditCard, Clock } from 'lucide-react';

export function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [subscription, setSubscription] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const [subData, ordersData] = await Promise.all([
        getUserSubscription(),
        getUserOrders()
      ]);
      setSubscription(subData);
      setOrders(ordersData);
    } catch (err: any) {
      console.error('Error loading user data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handlePurchase = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(priceId);
    setError('');

    try {
      const { url } = await createCheckoutSession(priceId, mode);
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session');
    } finally {
      setLoading(null);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Choose Your Plan</h1>
          <Alert type="info" className="mb-8">
            Please sign in to purchase a plan and start training your bot.
          </Alert>
          <Button onClick={() => navigate('/login')}>
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Bot Training Plan
        </h1>
        <p className="text-xl text-gray-600">
          Get started with our powerful bot training service
        </p>
      </div>

      {error && (
        <Alert type="error" className="mb-8">
          {error}
        </Alert>
      )}

      {/* Current Status */}
      {!dataLoading && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Account Status</h2>
          
          {subscription && subscription.subscription_status !== 'not_started' ? (
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700 font-medium">
                Active Subscription: {getProductByPriceId(subscription.price_id)?.name || 'Unknown Plan'}
              </span>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-blue-500" />
                <span className="text-blue-700 font-medium">
                  Previous Purchases: {orders.length} order{orders.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Most recent: {getProductByPriceId(orders[0]?.price_id)?.name || 'Bot Training Service'}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">No active subscription or purchases</span>
            </div>
          )}
        </div>
      )}

      {/* Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stripeProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Bot className="h-12 w-12 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                {product.name}
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                {product.description}
              </p>
              
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price, product.currency)}
                </span>
                <span className="text-gray-600 ml-1">
                  {product.mode === 'subscription' ? '/month' : 'one-time'}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Up to 10 URLs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Advanced AI training</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Fast processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Secure data handling</span>
                </div>
              </div>

              <Button
                onClick={() => handlePurchase(product.priceId, product.mode)}
                loading={loading === product.priceId}
                className="w-full"
              >
                {product.mode === 'subscription' ? 'Subscribe Now' : 'Purchase Now'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Order History */}
      {orders.length > 0 && (
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.order_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Bot Training Service
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.amount_total / 100, order.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {order.order_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}