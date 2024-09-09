import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CreateCustomerUsecase from "./create.customer.usecase";

describe("Integration test create customer usecase", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const customerRepository = new CustomerRepository();
    const createCustomerUsecase = new CreateCustomerUsecase(customerRepository);

    const input = {
      name: "John",
      address: {
        street: "Street",
        number: 123,
        zip: "Zip",
        city: "City",
      },
    };

    const result = await createCustomerUsecase.execute(input);

    expect(result).toEqual({
      id: expect.any(String),
      name: "John",
      address: {
        street: "Street",
        city: "City",
        number: 123,
        zip: "Zip",
      },
    });

    const customerFound = await customerRepository.find(result.id);

    expect({
      id: customerFound.id,
      name: customerFound.name,
      address: {
        street: customerFound.Address.street,
        city: customerFound.Address.city,
        number: customerFound.Address.number,
        zip: customerFound.Address.zip,
      },
    }).toEqual(result);
  });
});
