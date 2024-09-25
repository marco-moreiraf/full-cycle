import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction.entity";
import ProcessPaymentUseCase from "./process-payment.usecase";

const transaction = new Transaction({
  id: new Id("1"),
  amount: 100,
  orderId: "1",
});
transaction.process();

const transaction2 = new Transaction({
  id: new Id("2"),
  amount: 90,
  orderId: "2",
});
transaction2.process();

const MockRepository = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(transaction)),
  };
};

describe("Process payment usecase unit test", () => {
  it("should porcess a payment", async () => {
    const transactionRepository = MockRepository();
    const processPaymentUseCase = new ProcessPaymentUseCase(
      transactionRepository
    );

    const result = await processPaymentUseCase.execute({
      orderId: "1",
      amount: 100,
    });

    expect(transactionRepository.save).toHaveBeenCalled();
    expect(result.transactionId).toBe(transaction.id.id);
    expect(result.orderId).toBe(transaction.orderId);
    expect(result.amount).toBe(transaction.amount);
    expect(result.status).toBe(transaction.status);
    expect(result.createdAt).toEqual(transaction.createdAt);
    expect(result.updatedAt).toEqual(transaction.updatedAt);
  });

  it("should decline a payment", async () => {
    const transactionRepository = MockRepository();
    transactionRepository.save.mockImplementation(() => {
      return Promise.resolve(transaction2);
    });
    const processPaymentUseCase = new ProcessPaymentUseCase(
      transactionRepository
    );

    const result = await processPaymentUseCase.execute({
      orderId: "2",
      amount: 90,
    });

    expect(transactionRepository.save).toHaveBeenCalled();
    expect(result.transactionId).toBe(transaction2.id.id);
    expect(result.orderId).toBe(transaction2.orderId);
    expect(result.amount).toBe(transaction2.amount);
    expect(result.status).toBe(transaction2.status);
    expect(result.createdAt).toEqual(transaction2.createdAt);
    expect(result.updatedAt).toEqual(transaction2.updatedAt);
  });
});
