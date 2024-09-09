import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { FindProductUsecase } from "./find.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Integration test find customer usecase", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
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

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const findCustomerUsecase = new FindProductUsecase(productRepository);

    const product = new Product("123", "Product 1", 10);

    await productRepository.create(product);

    const input = {
      id: "123",
    };

    const result = await findCustomerUsecase.execute(input);

    expect(result).toEqual({ id: "123", name: "Product 1", price: 10 });
  });

  it("should not find a product", async () => {
    const productRepository = new ProductRepository();
    const findCustomerUsecase = new FindProductUsecase(productRepository);

    const input = {
      id: "123",
    };

    expect(() => {
      return findCustomerUsecase.execute(input);
    }).rejects.toThrow("Product not found");
  });
});
