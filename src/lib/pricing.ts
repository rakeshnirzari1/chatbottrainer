export interface PricingTier {
  id: string;
  label: string;
  urlRange: string;
  priceMonthly: number;
  priceCents: number;
  maxUrls: number;
  popular: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    label: 'Starter',
    urlRange: '1-10 URLs',
    priceMonthly: 9.99,
    priceCents: 999,
    maxUrls: 10,
    popular: false,
  },
  {
    id: 'growth',
    label: 'Growth',
    urlRange: '11-100 URLs',
    priceMonthly: 19.99,
    priceCents: 1999,
    maxUrls: 100,
    popular: true,
  },
  {
    id: 'business',
    label: 'Business',
    urlRange: '101-500 URLs',
    priceMonthly: 29.99,
    priceCents: 2999,
    maxUrls: 500,
    popular: false,
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    urlRange: '500+ URLs',
    priceMonthly: 49.99,
    priceCents: 4999,
    maxUrls: Infinity,
    popular: false,
  },
];

export function getTierForUrlCount(urlCount: number): PricingTier {
  if (urlCount <= 10) return PRICING_TIERS[0];
  if (urlCount <= 100) return PRICING_TIERS[1];
  if (urlCount <= 500) return PRICING_TIERS[2];
  return PRICING_TIERS[3];
}

export function calculatePrice(urlCount: number): number {
  return getTierForUrlCount(urlCount).priceCents;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatPriceMonthly(cents: number): string {
  return `$${(cents / 100).toFixed(2)}/mo`;
}

export function getPricingTier(urlCount: number): string {
  return getTierForUrlCount(urlCount).urlRange;
}
