import Product from "../../../domain/product/entity/product";
import { InputUpdateProductDto } from "./update.product.dto";
import UpdateProductUsecase from "./update.product.usecase";

describe("Unit test for product usecase", () => {
  let input: InputUpdateProductDto;
  let product: Product;
  let MockRepository: any;

  beforeEach(() => {
    product = new Product("123", "Product 1", 10);

    MockRepository = () => {
      return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        update: jest.fn(),
      };
    };

    input = {
      id: product.id,
      name: "New product name",
      price: 20,
    };
  });

  it("should update a product", async () => {
    const productRepository = MockRepository();
    const updateProductUsecase = new UpdateProductUsecase(productRepository);

    const output = await updateProductUsecase.execute(input);

    expect(output).toEqual(input);
  });

  it("should not find a product to update", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    });
    const updateProductUsecase = new UpdateProductUsecase(productRepository);

    expect(() => {
      return updateProductUsecase.execute(input);
    }).rejects.toThrow("Product not found");
  });

  it("should thrown an error when name is missing", async () => {
    const productRepository = MockRepository();
    const updateProductUsecase = new UpdateProductUsecase(productRepository);

    input.name = "";

    expect(async () => {
      await updateProductUsecase.execute(input);
    }).rejects.toThrow("product: Name is required");
  });

  it("should thrown an error when price is invalid", async () => {
    const productRepository = MockRepository();
    const updateProductUsecase = new UpdateProductUsecase(productRepository);

    input.price = 0;

    expect(async () => {
      await updateProductUsecase.execute(input);
    }).rejects.toThrow("product: Price must be greater than 0");

    input.price = -10;

    expect(async () => {
      await updateProductUsecase.execute(input);
    }).rejects.toThrow("product: Price must be greater than 0");
  });
});
