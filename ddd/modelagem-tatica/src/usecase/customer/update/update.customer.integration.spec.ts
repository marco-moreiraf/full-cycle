import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import UpdateCustomerUsecase from "./update.customer.usecase";

describe("Integration test for customer update usecase", () => {
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

  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const updateCustomerUsecase = new UpdateCustomerUsecase(customerRepository);

    const customer = new Customer("123", "John");
    const address = new Address("Street", 123, "Zip", "City");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const input = {
      id: "123",
      name: "Jane",
      address: {
        street: "New Street",
        city: "New City",
        number: 321,
        zip: "New Zip",
      },
    };

    const output = {
      id: "123",
      name: "Jane",
      address: {
        street: "New Street",
        city: "New City",
        number: 321,
        zip: "New Zip",
      },
    };

    const result = await updateCustomerUsecase.execute(input);

    expect(result).toEqual(output);

    //Check if user was updted in database
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

  it("should thrown an error when customer not found", async () => {
    const customerRepository = new CustomerRepository();
    const updateCustomerUsecase = new UpdateCustomerUsecase(customerRepository);

    const input = {
      id: "123",
      name: "Jane",
      address: {
        street: "New Street",
        city: "New City",
        number: 321,
        zip: "New Zip",
      },
    };

    expect(() => {
      return updateCustomerUsecase.execute(input);
    }).rejects.toThrow("Customer not found");
  });

  it("should thrown an error when name is missing", async () => {
    const customerRepository = new CustomerRepository();
    const updateCustomerUsecase = new UpdateCustomerUsecase(customerRepository);

    const customer = new Customer("123", "John");
    const address = new Address("Street", 123, "Zip", "City");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const input = {
      id: "123",
      name: "",
      address: {
        street: "New Street",
        city: "New City",
        number: 321,
        zip: "New Zip",
      },
    };

    await expect(async () => {
      await updateCustomerUsecase.execute(input);
    }).rejects.toThrow("Name is required");
  });

  it("should thrown an error when street is missing", async () => {
    const customerRepository = new CustomerRepository();
    const updateCustomerUsecase = new UpdateCustomerUsecase(customerRepository);

    const customer = new Customer("123", "John");
    const address = new Address("Street", 123, "Zip", "City");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const input = {
      id: "123",
      name: "Jane",
      address: {
        street: "",
        city: "New City",
        number: 321,
        zip: "New Zip",
      },
    };

    await expect(async () => {
      await updateCustomerUsecase.execute(input);
    }).rejects.toThrow("Street is required");
  });
});
