import { CreateCheckoutDto } from './checkout.interface';
import { Checkout } from './checkout';
import { slugify } from '../../commons/utils/slugify';
import { CreateOrderDto } from './order.interface';
import { OrderStatus, PricingRule, PrismaClient, Promotion } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckoutService {
    constructor(private readonly prisma: PrismaService) {}

    async checkout(data: CreateCheckoutDto) {
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
            const { productId, quantity } = order;

            const product = await this.prisma.product.findUnique({
                where: {
                    id: productId,
                },
            });

            console.log('product', product);
            if (!product) {
                throw new Error('Product not found');
            }

            checkout.addProduct(product, quantity);
        }

        checkout.calculate();

        await this.createOrder(
            {
                products: checkout.getProducts(),
                initialAmount: checkout.getInitialAmount(),
                discountedAmount: checkout.getDiscountAmount(),
                finalAmount: checkout.getFinalAmount(),
            },
            promotionCode,
        );
    }

    async createOrder(data: CreateOrderDto, promotionCode?: string) {
        const { products, ...rest } = data;
        const order = await this.prisma.order.create({
            data: {
                ...rest,
                status: OrderStatus.PENDING,
                products: {
                    connect: products.map((product) => ({ id: product.id })),
                },
            },
        });

        if (promotionCode) {
            await this.prisma.promotion.update({
                where: {
                    code: slugify(promotionCode),
                },
                data: {
                    usageCount: {
                        increment: 1,
                    },
                },
            });
        }

        return order;
    }
}
