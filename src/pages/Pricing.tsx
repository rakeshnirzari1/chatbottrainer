import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { stripeProducts, formatPrice } from '../stripe-config'
import { createCheckoutSession } from '../lib/stripe'
import { useAuth } from '../components/auth/AuthProvider'
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { Check } from 'lucide-react'

export function Pricing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handlePurchase = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!user) {
      navigate('/login')
      return
    }

    setLoading(priceId)
    setError('')

    try {
      const { url } = await createCheckoutSession({
        price_id: priceId,
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/pricing`,
        mode
      })

      if (url) {
        window.location.href = url
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your chatbot training needs. All plans include full access to our AI training platform.
        </p>
      </div>

      {error && (
        <Alert type="error" className="mb-8" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stripeProducts.map((product) => (
          <Card key={product.id} className="relative">
            <CardHeader>
              <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price, product.currency)}
                </span>
                <span className="text-gray-600 ml-2">one-time</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>AI-powered chatbot training</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Custom embed code</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>24/7 support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Analytics dashboard</span>
                </li>
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handlePurchase(product.priceId, product.mode)}
                loading={loading === product.priceId}
                disabled={loading !== null}
              >
                {loading === product.priceId ? 'Processing...' : 'Get Started'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Need a custom solution? {' '}
          <a href="mailto:support@dashbot.com" className="text-blue-600 hover:text-blue-500">
            Contact us
          </a>
        </p>
      </div>
    </div>
  )
}