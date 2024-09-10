import RepositoryInteface from "../../../domain/@shared/repository/repository-interface";
import Customer from "../../../domain/customer/entity/customer";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import { InputUpdateCustomerDto } from "./update.customer.dto";
import UpdateCustomerUsecase from "./update.customer.usecase";

describe("Unit test for customer update use case", () => {
  let input: InputUpdateCustomerDto;
  let customer: Customer;
  let MockRepository: any;

  beforeEach(() => {
    customer = CustomerFactory.createWithAddress(
      "John",
      new Address("Street", 123, "Zip", "City")
    );

    MockRepository = () => {
      return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        update: jest.fn(),
      };
    };

    input = {
      id: customer.id,
      name: "John Updated",
      address: {
        street: "Street Updated",
        number: 1234,
        zip: "Zip updated",
        city: "City updated",
      },
    };
  });

  afterEach(() => {});

  it("should update customer", async () => {
    const customerRepository = MockRepository();
    const customerUpdateUseCase = new UpdateCustomerUsecase(customerRepository);

    const output = await customerUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });

  it("should thrown an error when customer not found", async () => {
    const customerRepository = MockRepository();
    customerRepository.find.mockImplementation(() => {
      throw new Error("Customer not found");
    });
    const createCustomerUsecase = new UpdateCustomerUsecase(customerRepository);

    expect(() => {
      return createCustomerUsecase.execute(input);
    }).rejects.toThrow("Customer not found");
  });

  it("should thrown an error when name is missing", async () => {
    const customerRepository = MockRepository();
    const createCustomerUsecase = new UpdateCustomerUsecase(customerRepository);

    input.name = "";

    await expect(async () => {
      await createCustomerUsecase.execute(input);
    }).rejects.toThrow("customer: Name is required");
  });

  it("should thrown an error when street is missing", async () => {
    const customerRepository = MockRepository();
    const createCustomerUsecase = new UpdateCustomerUsecase(customerRepository);

    input.address.street = "";

    await expect(async () => {
      await createCustomerUsecase.execute(input);
    }).rejects.toThrow("Street is required");
  });
});
