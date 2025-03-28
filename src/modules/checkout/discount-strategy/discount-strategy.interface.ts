import { Product } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface DiscountStrategy {
  calculateDiscount(product: Product, quantity: number): Decimal;
}
