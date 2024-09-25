import { Sequelize } from "sequelize-typescript";
import { TransactionModel } from "./transaction.model";
import Transaction from "../domain/transaction.entity";
import TransactionRepository from "./transaction.repository";

describe("Transaction repository unit tests", () => {
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

  it("should create a transaction", async () => {
    const transactionRepository = new TransactionRepository();

    const transaction = new Transaction({
      amount: 100,
      orderId: "1",
    });
    transaction.approve();

    await transactionRepository.save(transaction);

    const transactionFound = await TransactionModel.findOne({
      where: { id: transaction.id.id },
    });

    expect(transactionFound.id).toBe(transaction.id.id);
    expect(transactionFound.orderId).toBe(transaction.orderId);
    expect(transactionFound.amount).toBe(transaction.amount);
    expect(transactionFound.status).toBe(transaction.status);
    expect(transactionFound.createdAt).toEqual(transaction.createdAt);
    expect(transactionFound.updatedAt).toEqual(transaction.updatedAt);
  });
});
