import Address from "../../modules/@shared/domain/value-object/address.value-object";
import Client from "../../modules/checkout/domain/client.entity";
import ProductModel from "../../modules/checkout/repository/product.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { app, sequelize, migration, setupDb } from "../express";
import request from "supertest";

describe("E2E test for checkout", () => {
  beforeEach(async () => {
    await setupDb();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    await migration.down();
    await sequelize.close();
  });

  it("should place an order", async () => {
    //Create client in database
    const client = new Client({
      name: "Client",
      email: "Email",
      document: "1234",
      address: new Address({
        street: "Street",
        number: "123",
        complement: "",
        city: "City",
        state: "State",
        zipCode: "12345",
      }),
    });

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });

    //Create products in database
    const product1 = {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      salesPrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const product2 = {
      id: "2",
      name: "Product 2",
      description: "Product 2 description",
      purchasePrice: 200,
      salesPrice: 200,
      stock: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ProductModel.create(product1);
    await ProductModel.create(product2);

    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: client.id.id,
        products: [{ productId: "1" }, { productId: "2" }],
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.products.length).toBe(2);
    expect(response.body.products[0].productId).toBe(product1.id);
    expect(response.body.products[1].productId).toBe(product2.id);
    expect(response.body.status).toBe("approved");
    expect(response.body.total).toBe(300);
  });

  it("should not place an order", async () => {
    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "1",
        products: [{ productId: "1" }, { productId: "2" }],
      });

    expect(response.status).toBe(500);
  });
});
