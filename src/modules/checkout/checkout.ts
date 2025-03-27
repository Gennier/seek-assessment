import { PricingRule, PricingRuleType, Product, Promotion } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { IDealPricingRule, IFixedPricePricingRule } from '../promotion/promotion.interface';

export class Checkout {
    products: Product[];
    finalAmount: Decimal;
    discountAmount: Decimal;
    initialAmount: Decimal;
    pricingRules: PricingRule[];

    constructor(data: { pricingRules: PricingRule[] }) {
        this.pricingRules = data.pricingRules;
        this.products = [];
        this.finalAmount = new Decimal(0);
        this.discountAmount = new Decimal(0);
        this.initialAmount = new Decimal(0);
    }

    addProduct(product: Product, quantity: number) {
        // Push the product to the array 'quantity' times
        for (let i = 1; i <= quantity; i++) {
            this.products.push(product);
        }
    }

    getProducts() {
        return this.products;
    }

    calculate() {
        this.finalAmount = this.products.reduce((acc, product) => acc.add(product.price), new Decimal(0));
        this.discountAmount = new Decimal(0);
        this.initialAmount = this.finalAmount;

        for (const pricingRule of this.pricingRules) {
            const product = this.products.find((p) => p.id === pricingRule.productId);

            /* 
      With this added means promo code doesnt have to exect match the product.
      If there are some products that are not in the promo code, it will still 
      give discount to other product that is found
      */

            if (!product) {
                continue;
            }

            switch (pricingRule.type) {
                case PricingRuleType.DEALS: {
                    const discountAmount = this.calculateDealDiscount(
                        product,
                        pricingRule.rule as unknown as IDealPricingRule,
                    );
                    this.discountAmount = this.discountAmount.add(discountAmount);
                    this.finalAmount = this.finalAmount.sub(discountAmount);
                    break;
                }
                case PricingRuleType.FIXED_PRICE_DISCOUNT: {
                    const discountAmount = this.calculateFixedPriceDiscount(
                        product,
                        pricingRule.rule as unknown as IFixedPricePricingRule,
                    );
                    this.discountAmount = this.discountAmount.add(discountAmount);
                    this.finalAmount = this.finalAmount.sub(discountAmount);
                    break;
                }
            }
        }
    }

    calculateDealDiscount(product: Product, dealRule: IDealPricingRule) {
        const buyingQuantity = this.products.filter((p) => p.id === product.id).length;

        if (buyingQuantity >= dealRule.buyQuantity) {
            const initialPrice = product.price.mul(buyingQuantity);
            const payPrice = product.price.mul(dealRule.payQuantity);
            return initialPrice.sub(payPrice);
        }

        return 0;
    }

    calculateFixedPriceDiscount(product: Product, fixedPriceRule: IFixedPricePricingRule) {
        const buyingQuantity = this.products.filter((p) => p.id === product.id).length;

        if (buyingQuantity === 0) {
            return 0;
        }

        const initialPrice = product.price.mul(buyingQuantity);
        const payPrice = fixedPriceRule.fixedPrice * buyingQuantity;
        return initialPrice.sub(payPrice);
    }

    getFinalAmount() {
        return this.finalAmount;
    }

    getInitialAmount() {
        return this.initialAmount;
    }

    getDiscountAmount() {
        return this.discountAmount;
    }
}
