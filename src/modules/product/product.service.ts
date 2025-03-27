import { PrismaClient, ProductType } from '@prisma/client';
import { slugify } from '../../shared/utils/slugify';
import { CreateProductDto } from './product.interface';
import { Decimal } from '@prisma/client/runtime/library';

export class ProductService {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getProducts() {
    return await this.prisma.product.findMany();
  }

  async createProduct(data: CreateProductDto) {
    return await this.prisma.product.create({
      data: {
        ...data,
        price: new Decimal(data.price),
        slug: slugify(data.name),
        type: ProductType.ADS,
      },
    });
  }
}
