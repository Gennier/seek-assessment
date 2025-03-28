import { PricingRule, PricingRuleType, Product, Promotion } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { IDealPricingRule, IFixedPricePricingRule } from '../promotion/promotion.interface';
import { DealDiscountStrategy } from './discount-strategy/deals';
import { FixedPriceDiscountStrategy } from './discount-strategy/fixed-price';
import { DiscountStrategy } from './discount-strategy/discount-strategy.interface';
import { BadRequestException } from '@nestjs/common';

export class Checkout {
  private readonly products: Product[] = [];
  private finalAmount: Decimal = new Decimal(0);
  private discountAmount: Decimal = new Decimal(0);
  private initialAmount: Decimal = new Decimal(0);

  constructor(private readonly pricingRules: PricingRule[]) {}

  addProduct(product: Product, quantity: number): void {
    this.products.push(...Array(quantity).fill(product));
  }

  getProducts(): Product[] {
    return this.products;
  }

  calculate(): void {
    this.finalAmount = this.products.reduce((acc, product) => acc.add(product.price), new Decimal(0));
    this.discountAmount = new Decimal(0);
    this.initialAmount = this.finalAmount;

    for (const pricingRule of this.pricingRules) {
      // Find for products that applies to the promo
      const product = this.products.find((p) => p.id === pricingRule.productId);

      if (!product) {
        continue;
      }

      const quantity = this.getProductQuantity(product.id);
      const discountStrategy = this.createDiscountStrategy(pricingRule);
      const discount = discountStrategy.calculateDiscount(product, quantity);

      if (discount.gt(0)) {
        this.applyDiscount(discount);
      } else {
        // If discount is 0 meaning deals does not meet, then doesnt qualify for all rules in promo
        this.revertDiscount();
        return;
      }
    }
  }

  private createDiscountStrategy(pricingRule: PricingRule): DiscountStrategy {
    switch (pricingRule.type) {
      case PricingRuleType.DEALS:
        return new DealDiscountStrategy(pricingRule.rule as unknown as IDealPricingRule);
      case PricingRuleType.FIXED_PRICE_DISCOUNT:
        return new FixedPriceDiscountStrategy(pricingRule.rule as unknown as IFixedPricePricingRule);
      default:
        throw new BadRequestException('Invalid pricing rule type');
    }
  }

  private applyDiscount(discount: Decimal): void {
    this.discountAmount = this.discountAmount.add(discount);
    this.finalAmount = this.finalAmount.sub(discount);
  }

  private revertDiscount(): void {
    this.discountAmount = new Decimal(0);
    this.finalAmount = this.initialAmount;
  }

  private getProductQuantity(productId: string): number {
    return this.products.filter((p) => p.id === productId).length;
  }

  getFinalAmount(): Decimal {
    return this.finalAmount;
  }

  getInitialAmount(): Decimal {
    return this.initialAmount;
  }

  getDiscountAmount(): Decimal {
    return this.discountAmount;
  }
}
