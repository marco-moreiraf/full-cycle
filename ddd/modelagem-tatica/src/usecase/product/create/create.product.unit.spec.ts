import { InputCreateProductDto } from "./create.product.dto";
import CreateProductUsecase from "./create.product.usecase";

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test for create product usecase", () => {
  let input: InputCreateProductDto;

  beforeEach(() => {
    input = {
      name: "Product a",
      price: 10,
    };
  });

  it("should create a product", async () => {
    const productRepository = MockRepository();
    const createProductUsecase = new CreateProductUsecase(productRepository);

    const response = await createProductUsecase.execute(input);

    expect(response).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it("should thrown an error when name is missing", () => {
    const productRepository = MockRepository();
    const createProductUsecase = new CreateProductUsecase(productRepository);

    input.name = "";

    expect(async () => {
      await createProductUsecase.execute(input);
    }).rejects.toThrow("Name is required");
  });

  it("should thrown an error when amount is invalid", () => {
    const productRepository = MockRepository();
    const createProductUsecase = new CreateProductUsecase(productRepository);

    input.price = 0;

    expect(async () => {
      await createProductUsecase.execute(input);
    }).rejects.toThrow("Price must be greater than 0");

    input.price = -10;

    expect(async () => {
      await createProductUsecase.execute(input);
    }).rejects.toThrow("Price must be greater than 0");
  });
});
