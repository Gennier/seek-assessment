export enum ProductType {
  ADS = "ADS",
}

export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PricingRuleType {
  DEALS = "DEALS",
  FIXED_PRICE_DISCOUNT = "FIXED_PRICE_DISCOUNT",
  PERCENTAGE_DISCOUNT = "PERCENTAGE_DISCOUNT",
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  type: ProductType;
  description: string;
  price: number;
  orders?: Order[];
  pricingRules?: PricingRule[];
}

export interface Order {
  id: string;
  productId: string;
  product: Product;
  initialAmount: number;
  discountedAmount: number;
  finalAmount: number;
  status: OrderStatus;
}

export interface Promotion {
  id: string;
  code: string;
  description: string;
  usageLimit?: number;
  usageCount: number;
  pricingRules?: PricingRule[];
}

export interface PricingRule {
  id: string;
  productId: string;
  product: Product;
  promotionId: string;
  promotion: Promotion;
  type: PricingRuleType;
  metadata: Record<string, any>;
}
