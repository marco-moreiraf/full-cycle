import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUsecase from "./list.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Integration test for listing product usecase", () => {
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

  it("should list products", async () => {
    const productRepository = new ProductRepository();
    const listProductUsecase = new ListProductUsecase(productRepository);

    const product1 = new Product("123", "Product 1", 10);
    await productRepository.create(product1);

    const product2 = new Product("321", "Product 2", 25);
    await productRepository.create(product2);

    const output = {
      products: [
        {
          id: "123",
          name: "Product 1",
          price: 10
        },
        {
          id: "321",
          name: "Product 2",
          price: 25
        },
      ],
    };

    const result = await listProductUsecase.execute({});

    expect(result).toEqual(output);
  });

  it("should return an empty list", async () => {
    const productRepository = new ProductRepository();
    const listProductUsecase = new ListProductUsecase(productRepository);

    const output = {
      products: <Product[]>[],
    };

    const result = await listProductUsecase.execute({});

    expect(result).toEqual(output);
  });
});
