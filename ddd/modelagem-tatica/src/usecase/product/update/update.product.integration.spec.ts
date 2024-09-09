import { Sequelize } from "sequelize-typescript";
import { InputUpdateProductDto } from "./update.product.dto";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUsecase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Integration test for update product usecase", () => {
  let input: InputUpdateProductDto;
  let sequelize: Sequelize;

  beforeEach(async () => {
    input = {
      id: "123",
      name: "New Product Description",
      price: 25,
    };

    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const updateProductUsecase = new UpdateProductUsecase(productRepository);

    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const result = await updateProductUsecase.execute(input);

    expect(result).toEqual({
      id: input.id,
      name: input.name,
      price: input.price,
    });

    //Check if product was updted in database
    const productFound = await productRepository.find(result.id);
    expect({
      id: productFound.id,
      name: productFound.name,
      price: productFound.price,
    }).toEqual(result);
  });

  it("should thrown an error when product not found", async () => {
    const productRepository = new ProductRepository();
    const updateProductUsecase = new UpdateProductUsecase(productRepository);

    expect(() => {
      return updateProductUsecase.execute(input);
    }).rejects.toThrow("Product not found");
  });

  it("should thrown an error when name is missing", async () => {
    const productRepository = new ProductRepository();
    const updateProductUsecase = new UpdateProductUsecase(productRepository);

    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    input.name = "";

    await expect(async () => {
      await updateProductUsecase.execute(input);
    }).rejects.toThrow("Name is required");
  });

  it("should thrown an error when street is missing", async () => {
    const productRepository = new ProductRepository();
    const updateProductUsecase = new UpdateProductUsecase(productRepository);

    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    input.price = 0;

    await expect(async () => {
      await updateProductUsecase.execute(input);
    }).rejects.toThrow("Price must be greater than 0");

    input.price = -10;

    await expect(async () => {
      await updateProductUsecase.execute(input);
    }).rejects.toThrow("Price must be greater than 0");
  });
});
