import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { User, CreditCard, Bot, LogOut } from 'lucide-react';

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const { subscription, activePlan, loading } = useSubscription();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Account
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user?.email}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Current Plan
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? 'Loading...' : activePlan || 'No active plan'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Chatbots Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Bot className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Chatbots
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          {subscription && (
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Subscription Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">
                      {subscription.subscription_status}
                    </dd>
                  </div>
                  {subscription.current_period_end && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Next Billing Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(
                          subscription.current_period_end * 1000
                        ).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                  {subscription.payment_method_brand && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Payment Method
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {subscription.payment_method_brand} ****{' '}
                        {subscription.payment_method_last4}
                      </dd>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}