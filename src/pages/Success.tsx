import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserSubscription, getUserOrders } from '../lib/stripe';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { CheckCircle, ArrowRight, CreditCard } from 'lucide-react';

export function Success() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [latestOrder, setLatestOrder] = useState<any>(null);

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
      if (ordersData && ordersData.length > 0) {
        setLatestOrder(ordersData[0]); // Most recent order
      }
    } catch (err: any) {
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your purchase details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your bot training service is now ready to use.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase Details</h2>
          
          {subscription && subscription.subscription_status !== 'not_started' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subscription Plan:</span>
                <span className="font-medium">1-10 URLs Bot</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Next Billing:</span>
                <span className="font-medium">
                  {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          ) : latestOrder ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">1-10 URLs Bot Training</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium">
                  {formatCurrency(latestOrder.amount_total / 100, latestOrder.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Purchase Date:</span>
                <span className="font-medium">
                  {new Date(latestOrder.order_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
            </div>
          ) : (
            <Alert type="info">
              Your purchase is being processed. You should see your service details shortly.
            </Alert>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">What's Next?</h3>
          <p className="text-blue-800 mb-4">
            You can now start training your bot with up to 10 URLs. Your service is ready to use!
          </p>
          <ul className="text-left text-blue-800 space-y-2">
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Access to advanced AI training</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Fast and reliable processing</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Secure data handling</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" size="lg">
              <CreditCard className="mr-2 h-5 w-5" />
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}