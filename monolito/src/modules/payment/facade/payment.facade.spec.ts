import { Sequelize } from "sequelize-typescript";
import { TransactionModel } from "../repository/transaction.model";
import PaymentFacadeFactory from "../factory/facade.factory";
import Transaction from "../domain/transaction.entity";

describe("Payment facade unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      database: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should process a payment", async () => {
    const paymentFacade = PaymentFacadeFactory.create();

    const input = {
      orderId: "1",
      amount: 100,
    };

    const result = await paymentFacade.process(input);

    expect(result.transactionId).toBeDefined();
    expect(result.orderId).toBe(input.orderId);
    expect(result.amount).toBe(input.amount);
    expect(result.status).toBe("approved");
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  it("should decline a payment", async () => {
    const paymentFacade = PaymentFacadeFactory.create();

    const input = {
      orderId: "1",
      amount: 90,
    };

    const result = await paymentFacade.process(input);

    expect(result.transactionId).toBeDefined();
    expect(result.orderId).toBe(input.orderId);
    expect(result.amount).toBe(input.amount);
    expect(result.status).toBe("declined");
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });
});
