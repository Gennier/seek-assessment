import { Controller, Get } from '@nestjs/common';
import { PromotionService } from './promotion.service';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly service: PromotionService) {}

  @Get('/list')
  async list() {
    return await this.service.getPromotions();
  }
}
