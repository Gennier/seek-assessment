import { Promotion } from "../../shared/interfaces/schema.interface";
import { slugify } from "../../shared/utils/slugify";
import { CreatePromotionDto } from "./promotion.interface";
import { v4 as uuidv4 } from "uuid";

export class PromotionService {
  constructor() {}

  private readonly promotionsData: Promotion[] = [
    {
      id: uuidv4(),
      name: "Classic Ad",
      slug: slugify("Classic Ad"),
      description: "Offers the most basic level of advertisement",
      price: 269.99,
      type: ProductType.ADS,
    },
    {
      id: uuidv4(),
      name: "Stand out Ad",
      slug: slugify("Stand out Ad"),
      description:
        "Allows advertisers to use a company logo and use a longer presentation text",
      price: 322.99,
      type: ProductType.ADS,
    },
    {
      id: uuidv4(),
      name: "Premium Ad",
      slug: slugify("Premium Ad"),
      description:
        "Same benefits as Standout Ad, but also puts the advertisement at the top of the results, allowing higher visibility",
      price: 394.99,
      type: ProductType.ADS,
    },
  ];

  getPromotions() {
    return this.promotionsData;
  }

  createPromotion(data: CreatePromotionDto) {
    // do pricing rules here


    this.promotionsData.push({
      id: uuidv4(),
      ...data,
      code: slugify(data.code),
      usageCount: 0,
    });
  }

  getPromotionByCode(code: string) {
    return this.promotionsData.find((promotion) => promotion.code === slugify(code));
  }
}
