import {
  OrderStatus,
  PricingRule,
  PrismaClient,
  Promotion,
} from '@prisma/client';
import { CheckoutDto } from './checkout.interface';
import { Checkout } from './checkout';
import { slugify } from '../../shared/utils/slugify';
import { CreateOrderDto } from './order.interface';

export class CheckoutService {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async checkout(data: CheckoutDto) {
    const { orders, promotionCode } = data;

    let promotion: (Promotion & { pricingRules: PricingRule[] }) | null = null;

    if (promotionCode) {
      promotion = await this.prisma.promotion.findUnique({
        where: {
          code: slugify(promotionCode),
        },
        include: {
          pricingRules: true,
        },
      });
    }

    const checkout = new Checkout({
      pricingRules: promotion?.pricingRules || [],
    });

    for (const order of orders) {
      const product = await this.prisma.product.findUnique({
        where: {
          id: order.productId,
        },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      checkout.addProduct(product);
    }

    checkout.calculate();

    await this.createOrder({
      products: checkout.getProducts(),
      initialAmount: checkout.getInitialAmount(),
      discountedAmount: checkout.getDiscountAmount(),
      finalAmount: checkout.getFinalAmount(),
    });
  }

  async createOrder(data: CreateOrderDto) {
    const { products, ...rest } = data;
    return await this.prisma.order.create({
      data: {
        ...rest,
        status: OrderStatus.PENDING,
        products: {
          connect: products.map((product) => ({ id: product.id })),
        },
      },
    });
  }
}
