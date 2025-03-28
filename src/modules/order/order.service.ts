import { CreateOrderDto } from './order.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PromotionService } from '../promotion/promotion.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly promotionService: PromotionService,
  ) {}

  async create(data: CreateOrderDto, promotionCode?: string) {
    const { products, ...rest } = data;
    const order = await this.prisma.order.create({
      data: {
        ...rest,
        products: {
          connect: products.map((product) => ({ id: product.id })),
        },
      },
    });

    if (promotionCode) {
      await this.promotionService.applyPromotion(promotionCode);
    }

    return order;
  }
}
