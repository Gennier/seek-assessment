import { Request, Response } from 'express';
import { CheckoutService } from './checkout.service';
import { PrismaClient } from '@prisma/client';
import { CheckoutDto } from './checkout.interface';

export class CheckoutController {
  private readonly checkoutService: CheckoutService;

  constructor() {
    const prisma = new PrismaClient();
    this.checkoutService = new CheckoutService(prisma);
  }

  async checkout(req: Request, res: Response) {
    try {
      const checkoutData: CheckoutDto = req.body;
      const result = await this.checkoutService.checkout(checkoutData);

      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({
        message: err instanceof Error ? err.message : 'An error occurred',
      });
    }
  }
}
