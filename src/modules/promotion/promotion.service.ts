import { slugify } from '../../commons/utils/slugify';
import { CreatePromotionDto } from './promotion.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Promotion, PricingRule } from '@prisma/client';

@Injectable()
export class PromotionService {
  constructor(private readonly prisma: PrismaService) {}

  async getPromotions() {
    return await this.prisma.promotion.findMany();
  }

  async createPromotion(data: CreatePromotionDto): Promise<void> {
    const pricingRules = data.pricingRules?.map((pricingRule) => {
      return {
        ...pricingRule,
        rule: JSON.stringify(pricingRule.rule),
      };
    });

    await this.prisma.promotion.create({
      data: {
        ...data,
        code: slugify(data.code),
        usageCount: 0,
        pricingRules: {
          create: pricingRules,
        },
      },
    });
  }

  async getPromotionByCode(code: string): Promise<Promotion & { pricingRules: PricingRule[] }> {
    const promotion = await this.prisma.promotion.findUnique({
      where: {
        code: slugify(code),
      },
      include: {
        pricingRules: true,
      },
    });

    if (!promotion) {
      throw new NotAcceptableException('Promotion Code is invalid');
    }

    return promotion;
  }

  async applyPromotion(promotionCode: string): Promise<void> {
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
}
