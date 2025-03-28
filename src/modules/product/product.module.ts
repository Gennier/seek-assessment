import { ProductService } from './product.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [ProductService],
})
export class ProductModule {}
