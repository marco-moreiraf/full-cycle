import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import Product from "../../../../domain/product/entity/product";
import ProductRepository from "./product.repository";

describe("Product repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
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
        const product = new Product("1", "Product 1", 100);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: "1" } });

        expect(productModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 1",
            price: 100
        });
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);

        await productRepository.create(product);

        product.changeName("Product 2");
        product.changePrice(200);

        await productRepository.update(product);

        const productModel = await ProductModel.findOne({ where: { id: "1" } });

        expect(productModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 2",
            price: 200
        });
    });

    it("should find a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);

        await productRepository.create(product);

        const foundProduct = await productRepository.find("1");

        expect(product).toStrictEqual(foundProduct);
    });

    it("should throw an error when product is not found", async () => {
        const productRepository = new ProductRepository();

        expect(async () => {
            await productRepository.find("12345");
        }).rejects.toThrow("Product not found");
    })

    it("should find all products", async () => {
        const productRepository = new ProductRepository();
        const product1 = new Product("1", "Product 1", 100);
        await productRepository.create(product1);
        
        const product2 = new Product("2", "Product 2", 200);
        await productRepository.create(product2);
        
        const product3 = new Product("3", "Product 3", 300);
        await productRepository.create(product3);

        const foundProducts = await productRepository.findAll();

        expect(foundProducts).toHaveLength(3);
        expect(foundProducts).toContainEqual(product1);
        expect(foundProducts).toContainEqual(product2);
        expect(foundProducts).toContainEqual(product3);
    });
});