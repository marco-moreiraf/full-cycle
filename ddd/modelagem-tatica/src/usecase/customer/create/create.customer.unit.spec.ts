import CreateCustomerUsecase from "./create.customer.usecase";

const input = {
  name: "John",
  address: {
    street: "Street",
    number: 123,
    zip: "Zip",
    city: "City",
  },
};

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test create customer usecase", () => {
  it("should create a customer", async () => {
    const customerRepository = MockRepository();
    const createCustomerUsecase = new CreateCustomerUsecase(customerRepository);

    const response = await createCustomerUsecase.execute(input);

    expect(response).toEqual({
        id: expect.any(String),
        name: input.name,
        address: {
          street: input.address.street,
          number: input.address.number,
          zip: input.address.zip,
          city: input.address.city,
        },
      });
  });

  it("should thrown an error when name is missing", async () => {
    const customerRepository = MockRepository();
    const createCustomerUsecase = new CreateCustomerUsecase(customerRepository);

    input.name = "";

    expect(async () => {
        await createCustomerUsecase.execute(input)
    }).rejects.toThrow("Name is required");
  });

  it("should thrown an error when street is missing", async () => {
    const customerRepository = MockRepository();
    const createCustomerUsecase = new CreateCustomerUsecase(customerRepository);

    input.address.street = "";

    expect(async () => {
        await createCustomerUsecase.execute(input)
    }).rejects.toThrow("Street is required");
  });
});
