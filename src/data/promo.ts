import type { PromoCode } from '@/types/cart.ts';

const MOCK_PROMOS: PromoCode[] = [
  { code: 'SALE10', discount: 10 },
  { code: 'HALF', discount: 50 },
];

export const getPromos = (): PromoCode[] => [...MOCK_PROMOS];
