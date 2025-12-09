export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_TZXMUBOwD8ye9k',
    priceId: 'price_1ScOHwGNit8AFLhVGGFGiwzc',
    name: '1-10 URLs Bot',
    description: 'Training of website bot up to 10 URLs',
    price: 100.00,
    currency: 'AUD',
    mode: 'payment'
  }
];

export function getProductById(id: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.id === id);
}

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}