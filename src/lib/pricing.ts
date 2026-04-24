export interface PricingTier {
  id: string;
  name: string;
  urlRange: string;
  minUrls: number;
  maxUrls: number;
  priceMonthly: number;
  popular: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    urlRange: '1-10 URLs',
    minUrls: 1,
    maxUrls: 10,
    priceMonthly: 999,
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    urlRange: '11-100 URLs',
    minUrls: 11,
    maxUrls: 100,
    priceMonthly: 1999,
    popular: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    urlRange: '101-500 URLs',
    minUrls: 101,
    maxUrls: 500,
    priceMonthly: 2999,
    popular: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    urlRange: '500+ URLs',
    minUrls: 501,
    maxUrls: Infinity,
    priceMonthly: 4999,
    popular: false,
  },
];

export function getTierForUrlCount(urlCount: number): PricingTier | null {
  return pricingTiers.find(t => urlCount >= t.minUrls && urlCount <= t.maxUrls) ?? null;
}

export function calculatePrice(urlCount: number): number {
  const tier = getTierForUrlCount(urlCount);
  return tier ? tier.priceMonthly : -1;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getPricingTier(urlCount: number): string {
  const tier = getTierForUrlCount(urlCount);
  return tier ? tier.urlRange : 'Custom';
}
