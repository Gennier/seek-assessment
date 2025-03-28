import { Product } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { IFixedPricePricingRule } from '../../promotion/promotion.interface';
import { DiscountStrategy } from './discount-strategy.interface';

export class FixedPriceDiscountStrategy implements DiscountStrategy {
  constructor(private readonly rule: IFixedPricePricingRule) {}

  calculateDiscount(product: Product, quantity: number): Decimal {
    if (quantity === 0) {
      return new Decimal(0);
    }

    const initialPrice = product.price.mul(quantity);
    const payPrice = new Decimal(this.rule.fixedPrice).mul(quantity);
    return initialPrice.sub(payPrice);
  }
}
