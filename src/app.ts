import express from 'express';
import checkoutRoutes from './modules/checkout/checkout.routes';

const app = express();
app.use(express.json());
app.use('/api', checkoutRoutes);

export default app;
