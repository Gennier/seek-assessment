import { Controller, Post, Body } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './checkout.interface';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly service: CheckoutService) {}

  @Post('')
  async checkout(@Body() data: CreateCheckoutDto) {
    return await this.service.checkout(data);
  }
}
