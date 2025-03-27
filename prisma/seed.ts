import { PricingRuleType, PrismaClient, ProductType } from '@prisma/client';
import { slugify } from '../src/commons/utils/slugify';
import { Decimal } from '@prisma/client/runtime/library';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const classicAdId = uuidv4();
  const standoutAdId = uuidv4();
  const premiumAdId = uuidv4();

  await prisma.product.createMany({
    data: [
      {
        id: classicAdId,
        name: 'Classic Ad',
        slug: slugify('Classic Ad'),
        description: 'Offers the most basic level of advertisement',
        price: new Decimal(269.99),
        type: ProductType.ADS,
      },
      {
        id: standoutAdId,
        name: 'Stand out Ad',
        slug: slugify('Stand out Ad'),
        description:
          'Allows advertisers to use a company logo and use a longer presentation text',
        price: new Decimal(322.99),
        type: ProductType.ADS,
      },
      {
        id: premiumAdId,
        name: 'Premium Ad',
        slug: slugify('Premium Ad'),
        description:
          'Same benefits as Standout Ad, but also puts the advertisement at the top of the results, allowing higher visibility',
        price: new Decimal(394.99),
        type: ProductType.ADS,
      },
    ],
  });

  await prisma.promotion.create({
    data: {
      code: 'bite123',
      description: 'Gets a 3 for 2 deal on Classic Ads',
      usageCount: 0,
      pricingRules: {
        create: [
          {
            productId: classicAdId,
            type: PricingRuleType.DEALS,
            rule: { buyQuantity: 3, payQuantity: 2 },
          },
        ],
      },
    },
  });

  await prisma.promotion.create({
    data: {
      code: 'axil123',
      description:
        'Gets a discount on StandoutAds where the price drops to $299.99 per ads',
      usageCount: 0,
      pricingRules: {
        create: [
          {
            productId: standoutAdId,
            type: PricingRuleType.FIXED_PRICE_DISCOUNT,
            rule: { fixedPrice: 299.99 },
          },
        ],
      },
    },
  });

  await prisma.promotion.create({
    data: {
      code: 'myer333',
      description:
        'Gets a 5 for 4 deal on Stand out Ads and gets a discount on PremiumAds where the price drops to $389.99 per ad',
      usageCount: 0,
      pricingRules: {
        create: [
          {
            productId: standoutAdId,
            type: PricingRuleType.DEALS,
            rule: { buyQuantity: 5, payQuantity: 4 },
          },
          {
            productId: premiumAdId,
            type: PricingRuleType.FIXED_PRICE_DISCOUNT,
            rule: { fixedPrice: 389.99 },
          },
        ],
      },
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
