import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUsecase from "./create.product.usecase";
import { InputCreateProductDto } from "./create.product.dto";

describe("Integration test create product usecase", () => {
  let input: InputCreateProductDto;
  let sequelize: Sequelize;

  beforeEach(async () => {
    input = {
      name: "Product a",
      price: 10,
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

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const createProductUsecase = new CreateProductUsecase(productRepository);

    const response = await createProductUsecase.execute(input);

    expect(response).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });

    const productAFound = await productRepository.find(response.id);

    expect({
      id: productAFound.id,
      name: productAFound.name,
      price: productAFound.price,
    }).toEqual(response);
  });

  it("should thrown an error when name is missing", async () => {
    const productRepository = new ProductRepository();
    const createProductUsecase = new CreateProductUsecase(productRepository);

    input.name = "";

    await expect(async () => {
      await createProductUsecase.execute(input);
    }).rejects.toThrow("Name is required");
  });

  it("should thrown an error when price is invalid", async () => {
    const productRepository = new ProductRepository();
    const createProductUsecase = new CreateProductUsecase(productRepository);

    input.price = 0;

    await expect(async () => {
      await createProductUsecase.execute(input);
    }).rejects.toThrow("Price must be greater than 0");

    input.price = -10;

    await expect(async () => {
      await createProductUsecase.execute(input);
    }).rejects.toThrow("Price must be greater than 0");
  });
});
