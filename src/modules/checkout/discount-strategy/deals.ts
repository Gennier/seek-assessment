import { Product } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { IDealPricingRule } from '../../promotion/promotion.interface';
import { DiscountStrategy } from './discount-strategy.interface';

export class DealDiscountStrategy implements DiscountStrategy {
  constructor(private readonly rule: IDealPricingRule) {}

  calculateDiscount(product: Product, quantity: number): Decimal {
    if (quantity >= this.rule.buyQuantity) {
      const initialPrice = product.price.mul(this.rule.buyQuantity);
      const payPrice = product.price.mul(this.rule.payQuantity);
      return initialPrice.sub(payPrice);
    }
    return new Decimal(0);
  }
}
