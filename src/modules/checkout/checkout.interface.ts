import { Decimal } from '@prisma/client/runtime/library';

export interface CheckoutDto {
  orders: [{ productId: string; quantity: number }];
  promotionCode?: string;
}
