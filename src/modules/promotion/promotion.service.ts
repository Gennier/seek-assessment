import { slugify } from '../../commons/utils/slugify';
import { CreatePromotionDto } from './promotion.interface';
import { PrismaService } from '@src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PromotionService {
    constructor(private readonly prisma: PrismaService) {}

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
