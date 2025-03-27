import { PrismaClient } from '@prisma/client';
import { slugify } from '../../shared/utils/slugify';
import { CreatePromotionDto } from './promotion.interface';

export class PromotionService {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getPromotions() {
    return await this.prisma.promotion.findMany();
  }

  async createPromotion(data: CreatePromotionDto) {
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

  async getPromotionByCode(code: string) {
    return await this.prisma.promotion.findUnique({
      where: {
        code: slugify(code),
      },
    });
  }
}
