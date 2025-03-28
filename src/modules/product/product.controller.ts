import { Controller, Post, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './product.interface';

@Controller('product')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Post('')
  async getList(@Body() data: CreateProductDto) {
      return await this.service.create(data);
  }
}
