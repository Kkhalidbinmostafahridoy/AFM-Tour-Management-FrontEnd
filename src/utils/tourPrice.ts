/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ITourPackage } from "@/types/tour.type";

/**
 * Resolves the effective price of a tour by checking multiple
 * possible field names the backend might use.
 */
export function resolveTourPrice(tour: ITourPackage | any): number {
  if (!tour) return 0;

  // Check all common price field names in priority order
  const priceFields = [
    "price",
    "costFrom",
    "tourCost",
    "cost",
    "basePrice",
    "amount",
    "fare",
    "totalCost",
    "perPersonCost",
    "tourPrice",
  ];

  for (const field of priceFields) {
    const value = tour[field];
    if (value !== undefined && value !== null && Number(value) > 0) {
      return Number(value);
    }
  }

  // Check nested pricing object
  if (tour.pricing) {
    if (tour.pricing.perPerson && Number(tour.pricing.perPerson) > 0) {
      return Number(tour.pricing.perPerson);
    }
    if (tour.pricing.basePrice && Number(tour.pricing.basePrice) > 0) {
      return Number(tour.pricing.basePrice);
    }
    if (tour.pricing.amount && Number(tour.pricing.amount) > 0) {
      return Number(tour.pricing.amount);
    }
  }

  // Check if there's a priceRange with a min
  if (tour.priceRange?.min && Number(tour.priceRange.min) > 0) {
    return Number(tour.priceRange.min);
  }

  return 0;
}

/**
 * Returns the human-readable label for the price field that matched.
 */
export function resolveTourPriceLabel(tour: ITourPackage | any): string {
  if (!tour) return "Price";

  const labelMap: Record<string, string> = {
    price: "Price per person",
    costFrom: "Cost from",
    tourCost: "Tour cost",
    cost: "Cost per person",
    basePrice: "Base price",
    amount: "Amount",
    fare: "Fare",
    totalCost: "Total cost",
    perPersonCost: "Per person cost",
    tourPrice: "Tour price",
  };

  const priceFields = [
    "price",
    "costFrom",
    "tourCost",
    "cost",
    "basePrice",
    "amount",
    "fare",
    "totalCost",
    "perPersonCost",
    "tourPrice",
  ];

  for (const field of priceFields) {
    const value = tour[field];
    if (value !== undefined && value !== null && Number(value) > 0) {
      return labelMap[field] || "Price";
    }
  }

  if (tour.pricing?.perPerson && Number(tour.pricing.perPerson) > 0) {
    return "Price per person";
  }
  if (tour.pricing?.basePrice && Number(tour.pricing.basePrice) > 0) {
    return "Base price";
  }

  return "Price";
}
