import { OrderService } from './order.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PromotionModule } from '../promotion/promotion.module';

@Module({
  imports: [PrismaModule, PromotionModule],
  controllers: [],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
