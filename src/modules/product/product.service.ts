import { ProductType } from "../../shared/interfaces/schema.interface";
import { slugify } from "../../shared/utils/slugify";
import { Product } from "../../shared/interfaces/schema.interface";
import { CreateProductDto } from "./product.interface";
import { v4 as uuidv4 } from "uuid";

export class ProductService {
  constructor() {}

  private readonly productsData: Product[] = [
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

  getProducts() {
    return this.productsData;
  }

  createProduct(data: CreateProductDto) {
    this.productsData.push({
      id: uuidv4(),
      ...data,
      slug: slugify(data.name),
      type: ProductType.ADS,
    });
  }
}
