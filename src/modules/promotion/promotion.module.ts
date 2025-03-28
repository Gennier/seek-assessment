import { PromotionService } from './promotion.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}
