export interface PlaceOrderFacadeInputDto {
  clientId: string;
  products: {
    productId: string;
  }[];
}

export interface PlaceOrderFacadeOutputDto {
  id: string;
  invoiceId: string;
  products: {
    productId: string;
  }[];
  status: string;
  total: number;
}

export default interface CheckoutFacadeInterface {
  placeOrder(
    input: PlaceOrderFacadeInputDto
  ): Promise<PlaceOrderFacadeOutputDto>;
}
