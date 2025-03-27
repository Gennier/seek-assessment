export interface IDealPricingRule {
  buyQuantity: number; // X (quantity customer buys)
  payQuantity: number; // Y (quantity customer pays for)
}

export interface IPercentagePricingRule {
  discountPercentage: number; // e.g., 20 for 20% off
}

export interface IFixedPricePricingRule {
  fixedPrice: number; // The new fixed price (e.g., 299.99)
}

export type PricingRule =
  | IDealPricingRule
  | IPercentagePricingRule
  | IFixedPricePricingRule;
