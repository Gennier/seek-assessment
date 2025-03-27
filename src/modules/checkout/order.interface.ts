import { Product } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface CreateOrderDto {
  initialAmount: Decimal;
  discountedAmount: Decimal;
  finalAmount: Decimal;
  products: Product[];
}
