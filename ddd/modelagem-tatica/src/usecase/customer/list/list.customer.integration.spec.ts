import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import ListCustomerUsecase from "./list.customer.usecase";

describe("Integration test for listing customer usecase", () => {
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

  it("should list customers", async () => {
    const customerRepository = new CustomerRepository();
    const listCustomerUsecase = new ListCustomerUsecase(customerRepository);

    const customer1 = new Customer("123", "John");
    const address1 = new Address("Street", 123, "Zip", "City");
    customer1.changeAddress(address1);

    await customerRepository.create(customer1);

    const customer2 = new Customer("321", "Jane");
    const address2 = new Address("Street 2", 321, "Zip 2", "City 2");
    customer2.changeAddress(address2);

    await customerRepository.create(customer2);

    const output = {
      customers: [
        {
          id: "123",
          name: "John",
          address: {
            street: "Street",
            city: "City",
            number: 123,
            zip: "Zip",
          },
        },
        {
          id: "321",
          name: "Jane",
          address: {
            street: "Street 2",
            city: "City 2",
            number: 321,
            zip: "Zip 2",
          },
        },
      ],
    };

    const result = await listCustomerUsecase.execute({});

    expect(result).toEqual(output);
  });

  it("should return an empty list", async () => {
    const customerRepository = new CustomerRepository();
    const listCustomerUsecase = new ListCustomerUsecase(customerRepository);

    const output = {
      customers: <Customer[]>[],
    };

    const result = await listCustomerUsecase.execute({});

    expect(result).toEqual(output);
  });
});
