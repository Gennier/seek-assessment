export interface CreateCheckoutDto {
  orders: { productId: string; quantity: number }[];
  promotionCode?: string;
}
