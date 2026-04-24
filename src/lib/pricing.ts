export function calculatePrice(urlCount: number): number {
  if (urlCount <= 10) return 10000;
  if (urlCount <= 50) return 20000;
  if (urlCount <= 200) return 50000;
  if (urlCount <= 500) return 90000;
  if (urlCount <= 1000) return 120000;
  return -1;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export function getPricingTier(urlCount: number): string {
  if (urlCount <= 10) return '1-10 URLs';
  if (urlCount <= 50) return '11-50 URLs';
  if (urlCount <= 200) return '51-200 URLs';
  if (urlCount <= 500) return '201-500 URLs';
  if (urlCount <= 1000) return '501-1000 URLs';
  return '>1000 URLs';
}
