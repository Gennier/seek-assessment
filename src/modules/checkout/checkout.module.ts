import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { OrderModule } from '../order/order.module';
import { PromotionModule } from '../promotion/promotion.module';
@Module({
  imports: [PrismaModule, OrderModule, PromotionModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
