import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Transaction from "../../domain/transaction.entity";
import PaymentGateway from "../../gateway/payment.gateway";
import {
  ProcessPaymentInputDto,
  ProcessPaymentOutpuDto,
} from "./process-payment.usecase.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface {
  private _transactionRepository: PaymentGateway;

  constructor(transactionRepository: PaymentGateway) {
    this._transactionRepository = transactionRepository;
  }

  async execute(
    input: ProcessPaymentInputDto
  ): Promise<ProcessPaymentOutpuDto> {
    const transaction = new Transaction({
      amount: input.amount,
      orderId: input.orderId,
    });
    transaction.process();

    const persistTransaction = await this._transactionRepository.save(
      transaction
    );

    return {
      transactionId: persistTransaction.id.id,
      orderId: persistTransaction.orderId,
      amount: persistTransaction.amount,
      status: persistTransaction.status,
      createdAt: persistTransaction.createdAt,
      updatedAt: persistTransaction.updatedAt,
    };
  }
}
