import React from 'react';
import { PricingCard } from './PricingCard';
import { stripeProducts } from '../../stripe-config';

export function PricingSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your business needs. All plans include our core features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {stripeProducts.map((product, index) => (
            <PricingCard
              key={product.id}
              product={product}
              isPopular={index === 1} // Make the second product popular
            />
          ))}
        </div>
      </div>
    </section>
  );
}