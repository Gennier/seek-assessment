import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutService } from './checkout.service';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderService } from '../order/order.service';
import { PromotionService } from '../promotion/promotion.service';
import { NotFoundException } from '@nestjs/common';
import { PricingRuleType, Product, Promotion, ProductType, Order } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let prismaService: PrismaService;
  let orderService: OrderService;
  let promotionService: PromotionService;

  const mockProductClassic: Product = {
    id: '1',
    name: 'Classic Ad',
    slug: 'classic-ad',
    description: 'Test Description',
    price: new Decimal(269.99),
    type: ProductType.ADS,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockProductPremium: Product = {
    id: '2',
    name: 'Premium Ad',
    slug: 'premium-ad',
    description: 'Test Description',
    price: new Decimal(394.99),
    type: ProductType.ADS,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockPromotion1: Promotion & { pricingRules: any[] } = {
    id: '1',
    code: 'PROMO123',
    description: 'Test Description',
    usageLimit: null,
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    pricingRules: [
      {
        id: '1',
        promotionId: '1',
        productId: '1',
        type: PricingRuleType.DEALS,
        rule: {
          buyQuantity: 3,
          payQuantity: 2,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ],
  };

  const mockPromotion2: Promotion & { pricingRules: any[] } = {
    id: '2',
    code: 'PROMO456',
    description: 'Test Description',
    usageLimit: null,
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    pricingRules: [
      {
        id: '1',
        promotionId: '2',
        productId: '1',
        type: PricingRuleType.DEALS,
        rule: {
          buyQuantity: 2,
          payQuantity: 1,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: '2',
        promotionId: '2',
        productId: '2',
        type: PricingRuleType.FIXED_PRICE_DISCOUNT,
        rule: {
          fixedPrice: 100,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ],
  };

  const mockOrder: Order = {
    id: '1',
    initialAmount: new Decimal(0),
    discountedAmount: new Decimal(0),
    finalAmount: new Decimal(0),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: OrderService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: PromotionService,
          useValue: {
            getPromotionByCode: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CheckoutService>(CheckoutService);
    prismaService = module.get<PrismaService>(PrismaService);
    orderService = module.get<OrderService>(OrderService);
    promotionService = module.get<PromotionService>(PromotionService);
  });

  describe('checkout', () => {
    it('should process checkout without promotion', async () => {
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(mockProductClassic);
      jest.spyOn(orderService, 'create').mockResolvedValue(mockOrder);

      await service.checkout({
        orders: [{ productId: '1', quantity: 1 }],
      });

      expect(orderService.create).toHaveBeenCalledWith(
        {
          products: [mockProductClassic],
          initialAmount: new Decimal(269.99),
          discountedAmount: new Decimal(0),
          finalAmount: new Decimal(269.99),
        },
        undefined,
      );
    });

    it('should process checkout with promotion', async () => {
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(mockProductClassic);
      jest.spyOn(promotionService, 'getPromotionByCode').mockResolvedValue(mockPromotion1);
      jest.spyOn(orderService, 'create').mockResolvedValue(mockOrder);

      await service.checkout({
        orders: [{ productId: '1', quantity: 3 }],
        promotionCode: 'PROMO123',
      });

      expect(promotionService.getPromotionByCode).toHaveBeenCalledWith('PROMO123');
      expect(orderService.create).toHaveBeenCalledWith(
        {
          products: Array(3).fill(mockProductClassic),
          initialAmount: new Decimal(809.97),
          discountedAmount: new Decimal(269.99),
          finalAmount: new Decimal(539.98),
        },
        'PROMO123',
      );
    });

    it('should have no discount when checkout with promotion', async () => {
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(mockProductClassic);
      jest.spyOn(promotionService, 'getPromotionByCode').mockResolvedValue(mockPromotion1);
      jest.spyOn(orderService, 'create').mockResolvedValue(mockOrder);

      await service.checkout({
        orders: [{ productId: '1', quantity: 2 }],
        promotionCode: 'PROMO123',
      });

      expect(promotionService.getPromotionByCode).toHaveBeenCalledWith('PROMO123');
      expect(orderService.create).toHaveBeenCalledWith(
        {
          products: Array(2).fill(mockProductClassic),
          initialAmount: new Decimal(539.98),
          discountedAmount: new Decimal(0),
          finalAmount: new Decimal(539.98),
        },
        'PROMO123',
      );
    });

    it('should process checkout with promotion with multiple pricing rules', async () => {
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValueOnce(mockProductClassic);
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValueOnce(mockProductPremium);
      jest.spyOn(promotionService, 'getPromotionByCode').mockResolvedValue(mockPromotion2);
      jest.spyOn(orderService, 'create').mockResolvedValue(mockOrder);

      await service.checkout({
        orders: [
          { productId: '1', quantity: 3 },
          { productId: '2', quantity: 1 },
        ],
        promotionCode: 'PROMO456',
      });

      expect(promotionService.getPromotionByCode).toHaveBeenCalledWith('PROMO456');
      expect(orderService.create).toHaveBeenCalledWith(
        {
          products: [...Array(3).fill(mockProductClassic), mockProductPremium],
          initialAmount: new Decimal(1204.96),
          discountedAmount: new Decimal(564.98),
          finalAmount: new Decimal(639.98),
        },
        'PROMO456',
      );
    });

    it('should have no discount when checkout with promotion', async () => {
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(mockProductClassic);
      jest.spyOn(promotionService, 'getPromotionByCode').mockResolvedValue(mockPromotion1);
      jest.spyOn(orderService, 'create').mockResolvedValue(mockOrder);

      await service.checkout({
        orders: [{ productId: '1', quantity: 2 }],
        promotionCode: 'PROMO123',
      });

      expect(promotionService.getPromotionByCode).toHaveBeenCalledWith('PROMO123');
      expect(orderService.create).toHaveBeenCalledWith(
        {
          products: Array(2).fill(mockProductClassic),
          initialAmount: new Decimal(539.98),
          discountedAmount: new Decimal(0),
          finalAmount: new Decimal(539.98),
        },
        'PROMO123',
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      const mockOrderData = {
        orders: [{ productId: '1', quantity: 1 }],
      };

      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(null);

      await expect(
        service.checkout({
          orders: [{ productId: 'xx', quantity: 1 }],
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
