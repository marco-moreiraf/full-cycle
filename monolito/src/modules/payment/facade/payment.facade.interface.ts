export interface ProcessPaymentFacadeInputDto {
  orderId: string;
  amount: number;
}

export interface ProcessPaymentFacadeOutputDto {
  transactionId: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export default interface PaymentFacadeInterface {
  process(
    input: ProcessPaymentFacadeInputDto
  ): Promise<ProcessPaymentFacadeOutputDto>;
}
