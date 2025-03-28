import { CreateCheckoutDto } from './checkout.interface';
import { Checkout } from './checkout';
import { PricingRule, Promotion } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, Injectable } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { PromotionService } from '../promotion/promotion.service';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
    private readonly promotionService: PromotionService,
  ) {}

  async checkout(data: CreateCheckoutDto) {
    const { orders, promotionCode } = data;

    let promotion: (Promotion & { pricingRules: PricingRule[] }) | null = null;

    if (promotionCode) {
      promotion = await this.promotionService.getPromotionByCode(promotionCode);
    }

    // init checkout
    const checkout = new Checkout(promotion?.pricingRules || []);

    for (const order of orders) {
      const { productId, quantity } = order;

      const product = await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      checkout.addProduct(product, quantity);
    }

    checkout.calculate();

    return await this.orderService.create(
      {
        products: checkout.getProducts(),
        initialAmount: checkout.getInitialAmount(),
        discountedAmount: checkout.getDiscountAmount(),
        finalAmount: checkout.getFinalAmount(),
      },
      promotionCode,
    );
  }
}
