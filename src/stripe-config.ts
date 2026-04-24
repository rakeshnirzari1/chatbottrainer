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
    id: 'prod_UOMELivnJBRRNT',
    priceId: 'price_1TPZVyGNit8AFLhVYZG5KIV1',
    name: '1-10 URLs Bot',
    description: 'Chatbot trained up to 10 URLs on your website',
    price: 9.99,
    currency: 'AUD',
    mode: 'subscription'
  },
  {
    id: 'prod_UOMHdtCqSqDy2E',
    priceId: 'price_1TPZZ1GNit8AFLhVQB35zteB',
    name: '11-100 URLs Bot',
    description: 'Chatbot trained on 11 to 100 URLs of your business website',
    price: 19.99,
    currency: 'AUD',
    mode: 'subscription'
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}