import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import ProductRepository from "../repository/product.repository";
import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import StoreCatalogFacadeFactory from "../factory/facade.factory";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("StoreCatalog facade unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      database: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should find all products", async () => {
    const storeCatalogFacade = StoreCatalogFacadeFactory.create();

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

    const products = await storeCatalogFacade.listProducts();

    expect(products.products.length).toBe(2);
    expect(products.products[0].id).toBe(product1.id.id);
    expect(products.products[0].name).toBe(product1.name);
    expect(products.products[0].description).toBe(product1.description);
    expect(products.products[0].salesPrice).toBe(product1.salesPrice);
    expect(products.products[1].id).toBe(product2.id.id);
    expect(products.products[1].name).toBe(product2.name);
    expect(products.products[1].description).toBe(product2.description);
    expect(products.products[1].salesPrice).toBe(product2.salesPrice);
  });

  it("should find a product", async () => {
    const storeCatalogFacade = StoreCatalogFacadeFactory.create();

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

    const product = await storeCatalogFacade.findProduct({
      productId: product1.id.id,
    });

    expect(product.id).toBe(product1.id.id);
    expect(product.name).toBe(product1.name);
    expect(product.description).toBe(product1.description);
    expect(product.salesPrice).toBe(product1.salesPrice);
  });
});
