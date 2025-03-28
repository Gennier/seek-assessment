import { ProductType } from '@prisma/client';
import { slugify } from '../../commons/utils/slugify';
import { CreateProductDto } from './product.interface';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts() {
    return await this.prisma.product.findMany();
  }

  async create(data: CreateProductDto) {
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
