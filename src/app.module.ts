import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
@Module({
  imports: [PrismaModule, ProductModule, PromotionModule, CheckoutModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
