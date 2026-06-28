export const SERVICE_PRICES: Record<string, number> = {
  "Classic Haircut": 45,
  "Skin Fade": 55,
  "Buzz Cut": 35,
  "Beard Trim": 30,
  "Hot Towel Shave": 50,
  "Hair & Beard Combo": 75,
  "Kids Haircut": 30,
  "VIP Grooming Package": 120,
};

export function calcTotal(services: string[]): number {
  return services.reduce((sum, s) => {
    const key = s.split(" — ")[0];
    return sum + (SERVICE_PRICES[key] ?? 0);
  }, 0);
}

export interface PriceBreakdown {
  subtotal: number;
  discount: number;
  total: number;
  offerLabel?: string;
}

export function calcWithOffer(
  services: string[],
  offer?: { type: string; value: string } | null
): PriceBreakdown {
  const subtotal = calcTotal(services);
  let discount = 0;
  let offerLabel: string | undefined;

  if (offer) {
    if (offer.type === "discount" && offer.value.endsWith("%")) {
      const pct = parseFloat(offer.value) / 100;
      discount = Math.round(subtotal * pct * 100) / 100;
      offerLabel = `${offer.value} off`;
    } else if (offer.type === "free_service" || offer.type === "custom") {
      offerLabel = offer.value;
    }
  }

  return { subtotal, discount, total: subtotal - discount, offerLabel };
}
