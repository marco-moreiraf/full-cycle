import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductRepository from "./product.repository";

describe("ProductRepository unit tests", () => {
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

  it("should find all products", async () => {
    const productRepository = new ProductRepository();

    const product1 = new Product({
      id: new Id(),
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
    });

    const product2 = new Product({
      id: new Id(),
      name: "Product 2",
      description: "Product 2 description",
      salesPrice: 200,
    });

    await ProductModel.create({
      id: product1.id.id,
      name: product1.name,
      description: product1.description,
      salesPrice: product1.salesPrice,
    });

    await ProductModel.create({
      id: product2.id.id,
      name: product2.name,
      description: product2.description,
      salesPrice: product2.salesPrice,
    });

    const products = await productRepository.findAll();

    expect(products.length).toBe(2);
    expect(products[0].id.id).toBe(product1.id.id);
    expect(products[0].name).toBe(product1.name);
    expect(products[0].description).toBe(product1.description);
    expect(products[0].salesPrice).toBe(product1.salesPrice);
    expect(products[1].id.id).toBe(product2.id.id);
    expect(products[1].name).toBe(product2.name);
    expect(products[1].description).toBe(product2.description);
    expect(products[1].salesPrice).toBe(product2.salesPrice);
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();

    const product1 = new Product({
      id: new Id(),
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
    });

    await ProductModel.create({
      id: product1.id.id,
      name: product1.name,
      description: product1.description,
      salesPrice: product1.salesPrice,
    });

    const productFound = await productRepository.find(product1.id.id);

    expect(productFound.id.id).toBe(product1.id.id);
    expect(productFound.name).toBe(product1.name);
    expect(productFound.description).toBe(product1.description);
    expect(productFound.salesPrice).toBe(product1.salesPrice);
  });
});
