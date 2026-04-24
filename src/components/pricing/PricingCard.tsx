import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { StripeProduct } from '../../stripe-config';
import { createCheckoutSession } from '../../lib/stripe';
import { useAuth } from '../../hooks/useAuth';

interface PricingCardProps {
  product: StripeProduct;
  isPopular?: boolean;
}

export function PricingCard({ product, isPopular = false }: PricingCardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      const { url } = await createCheckoutSession({
        priceId: product.priceId,
        mode: product.mode,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: window.location.href,
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    `Up to ${product.name.includes('1-10') ? '10' : '100'} URLs`,
    'AI-powered responses',
    'Easy website integration',
    'Analytics dashboard',
    '24/7 support',
  ];

  return (
    <div
      className={`relative rounded-2xl border ${
        isPopular
          ? 'border-indigo-500 shadow-lg scale-105'
          : 'border-gray-200 shadow-sm'
      } bg-white p-8 transition-all duration-200 hover:shadow-lg`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-6">{product.description}</p>

        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">
            A${product.price}
          </span>
          <span className="text-gray-600 ml-1">/month</span>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            isPopular
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Get Started'
          )}
        </button>
      </div>

      <div className="mt-8">
        <h4 className="font-medium text-gray-900 mb-4">What's included:</h4>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}