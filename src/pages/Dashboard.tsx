import React, { useEffect, useState } from 'react'
import { useAuth } from '../components/auth/AuthProvider'
import { getUserSubscription, getUserOrders } from '../lib/stripe'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Alert } from '../components/ui/Alert'
import { formatPrice } from '../stripe-config'

export function Dashboard() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subData, ordersData] = await Promise.all([
          getUserSubscription(),
          getUserOrders()
        ])
        
        setSubscription(subData)
        setOrders(ordersData || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.email}</p>
      </div>

      {error && (
        <Alert type="error" className="mb-6" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Subscription Status</h2>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div className="space-y-2">
                <p><span className="font-medium">Status:</span> {subscription.subscription_status || 'No active subscription'}</p>
                {subscription.price_id && (
                  <p><span className="font-medium">Plan:</span> Active Plan</p>
                )}
                {subscription.current_period_end && (
                  <p><span className="font-medium">Next billing:</span> {new Date(subscription.current_period_end * 1000).toLocaleDateString()}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-600">No active subscription</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Orders</h2>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.order_id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium">Order #{order.order_id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.order_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatPrice(order.amount_total / 100, order.currency.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">{order.order_status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}