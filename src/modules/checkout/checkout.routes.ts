import { Router, Request, Response } from 'express';
import { CheckoutController } from './checkout.controller';

const router = Router();
const checkoutController = new CheckoutController();

router.post('/checkout', async (req: Request, res: Response) => {
  return checkoutController.checkout(req, res);
});

export default router;
