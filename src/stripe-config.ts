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
    description: 'Training of website boat up to $10 URLs',
    price: 100.00,
    currency: 'AUD',
    mode: 'payment'
  },
  {
    id: 'prod_TZXNOa6SW3cRd9',
    priceId: 'price_1ScOJBGNit8AFLhVGlkFd3I9',
    name: '11-50 URLs',
    description: 'Training of bot (11 to 50 URLs or links)',
    price: 200.00,
    currency: 'AUD',
    mode: 'payment'
  },
  {
    id: 'prod_TZXPDlNUgoiRL3',
    priceId: 'price_1ScOKDGNit8AFLhVNyyZSkqu',
    name: '51- 200 URLs',
    description: 'Training of bot (51 to 200 URLs or links)',
    price: 500.00,
    currency: 'AUD',
    mode: 'payment'
  },
  {
    id: 'prod_TZXPK9xEm2EvkP',
    priceId: 'price_1ScOKrGNit8AFLhV78V1DZwc',
    name: '201 - 500 URLs',
    description: 'Training of bot (201 to 500 URLs or links)',
    price: 900.00,
    currency: 'AUD',
    mode: 'payment'
  },
  {
    id: 'prod_TZXQEgp42ptHgX',
    priceId: 'price_1ScOLPGNit8AFLhVSaT2OOHV',
    name: '501 - 1000 URLs',
    description: 'Training of bot (501 to 1000 URLs or links)',
    price: 1200.00,
    currency: 'AUD',
    mode: 'payment'
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}

export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
  }).format(price);
}