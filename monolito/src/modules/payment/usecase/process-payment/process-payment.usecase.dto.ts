export interface ProcessPaymentInputDto {
  orderId: string;
  amount: number;
}

export interface ProcessPaymentOutpuDto {
  transactionId: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
