import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { ProductModule } from './modules/product/product.module';

@Module({
    imports: [PrismaModule, ProductModule, PromotionModule, CheckoutModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
