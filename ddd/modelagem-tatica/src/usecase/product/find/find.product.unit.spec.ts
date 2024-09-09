import Product from "../../../domain/product/entity/product";
import { FindProductUsecase } from "./find.product.usecase";

const product = new Product("123", "Product 1", 10);

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test for find product usecase", () => {
  it("should find a product", async () => {
    const productRepository = MockRepository();
    const findProductUsecase = new FindProductUsecase(productRepository);

    const input = {
      id: "123",
    };

    const result = await findProductUsecase.execute(input);

    expect(result).toEqual({
      id: "123",
      name: "Product 1",
      price: 10,
    });
  });

  it("should not find a customer", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    });
    const findProductUsecase = new FindProductUsecase(productRepository);

    const input = {
      id: "1",
    };

    expect(() => {
      return findProductUsecase.execute(input);
    }).rejects.toThrow("Product not found");
  });
});
