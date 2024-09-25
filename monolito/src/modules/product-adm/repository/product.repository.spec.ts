import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import Product from "../domain/product.entity";
import ProductRepository from "./product.repository";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("ProductRepository test", () => {
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

  it("should create a product", async () => {
    const productRepository = new ProductRepository();

    const product = new Product({
      id: new Id(),
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    });

    await productRepository.add(product);

    const productFound = await ProductModel.findOne({
      where: { id: product.id.id },
    });

    expect(product.id.id).toEqual(productFound.id);
    expect(product.name).toEqual(productFound.name);
    expect(product.description).toEqual(productFound.description);
    expect(product.purchasePrice).toEqual(productFound.purchasePrice);
    expect(product.stock).toEqual(productFound.stock);
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();

    const product = new Product({
      id: new Id(),
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    });

    await ProductModel.create({
      id: product.id.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });

    const productFound = await productRepository.find(product.id.id);

    expect(product.id.id).toEqual(productFound.id.id);
    expect(product.name).toEqual(productFound.name);
    expect(product.description).toEqual(productFound.description);
    expect(product.purchasePrice).toEqual(productFound.purchasePrice);
    expect(product.stock).toEqual(productFound.stock);
    expect(product.createdAt).toEqual(productFound.createdAt);
    expect(product.updatedAt).toEqual(productFound.updatedAt);
  });
});
