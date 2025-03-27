import { PricingRuleType } from '@prisma/client';

export interface CreatePromotionDto {
  code: string;
  description: string;
  usageLimit?: number;
  pricingRules?: CreatePricingRuleDto[];
}

export interface IDealPricingRule {
  buyQuantity: number; // X (quantity customer buys)
  payQuantity: number; // Y (quantity customer pays for)
}

export interface IFixedPricePricingRule {
  fixedPrice: number; // The new fixed price
}

export type PricingRuleMetadata = IDealPricingRule | IFixedPricePricingRule;

export interface CreatePricingRuleDto {
  productId: string;
  type: PricingRuleType;
  rule: PricingRuleMetadata;
}
