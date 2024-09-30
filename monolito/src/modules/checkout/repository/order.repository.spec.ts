import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import OrderProductModel from "./order-product.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import Client from "../domain/client.entity";
import Address from "../../@shared/domain/value-object/address.value-object";
import Product from "../domain/product.entity";
import Order from "../domain/order.entity";

describe("Order repository unit tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      database: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel, OrderProductModel, OrderModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an order", async () => {
    const orderRepository = new OrderRepository();

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

    const product1 = new Product({
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
    });

    const product2 = new Product({
      name: "Product 2",
      description: "Product 2 description",
      salesPrice: 200,
    });

    const order = new Order({
      client: client,
      products: [product1, product2],
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

    await orderRepository.add(order);

    const orderFound = await OrderModel.findOne({
      where: { id: order.id.id },
      include: [{ model: ClientModel }, { model: OrderProductModel }],
    });

    expect(order.id.id).toBe(orderFound.id);
    expect(order.client.id.id).toBe(orderFound.clientId);
    expect(order.client.name).toBe(orderFound.client.name);
    expect(order.client.email).toBe(orderFound.client.email);
    expect(order.client.document).toBe(orderFound.client.document);
    expect(order.client.address.street).toBe(orderFound.client.street);
    expect(order.client.address.number).toBe(orderFound.client.number);
    expect(order.client.address.complement).toBe(orderFound.client.complement);
    expect(order.client.address.city).toBe(orderFound.client.city);
    expect(order.client.address.state).toBe(orderFound.client.state);
    expect(order.client.address.zipCode).toBe(orderFound.client.zipCode);
    expect(order.products[0].id.id).toBe(orderFound.products[0].id);
    expect(order.products[0].name).toBe(orderFound.products[0].name);
    expect(order.products[0].description).toBe(
      orderFound.products[0].description
    );
    expect(order.products[0].salesPrice).toBe(
      orderFound.products[0].salesPrice
    );
    expect(order.products[1].id.id).toBe(orderFound.products[1].id);
    expect(order.products[1].name).toBe(orderFound.products[1].name);
    expect(order.products[1].description).toBe(
      orderFound.products[1].description
    );
    expect(order.products[1].salesPrice).toBe(
      orderFound.products[1].salesPrice
    );
    expect(order.status).toBe(orderFound.status);
  });

  it("should find an order", async () => {
    const orderRepository = new OrderRepository();

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

    const product1 = new Product({
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
    });

    const product2 = new Product({
      name: "Product 2",
      description: "Product 2 description",
      salesPrice: 200,
    });

    const order = new Order({
      client: client,
      products: [product1, product2],
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

    await OrderModel.create(
      {
        id: order.id.id,
        clientId: client.id.id,
        products: order.products.map((product) => ({
          id: product.id.id,
          orderId: order.id.id,
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        })),
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      {
        include: [{ model: OrderProductModel }],
      }
    );

    const orderFound = await orderRepository.find(order.id.id);

    expect(order.id.id).toBe(orderFound.id.id);
    expect(order.client.id.id).toBe(orderFound.client.id.id);
    expect(order.client.name).toBe(orderFound.client.name);
    expect(order.client.email).toBe(orderFound.client.email);
    expect(order.client.document).toBe(orderFound.client.document);
    expect(order.client.address.street).toBe(orderFound.client.address.street);
    expect(order.client.address.number).toBe(orderFound.client.address.number);
    expect(order.client.address.complement).toBe(
      orderFound.client.address.complement
    );
    expect(order.client.address.city).toBe(orderFound.client.address.city);
    expect(order.client.address.state).toBe(orderFound.client.address.state);
    expect(order.client.address.zipCode).toBe(
      orderFound.client.address.zipCode
    );
    expect(order.products[0].id.id).toBe(orderFound.products[0].id.id);
    expect(order.products[0].name).toBe(orderFound.products[0].name);
    expect(order.products[0].description).toBe(
      orderFound.products[0].description
    );
    expect(order.products[0].salesPrice).toBe(
      orderFound.products[0].salesPrice
    );
    expect(order.products[1].id.id).toBe(orderFound.products[1].id.id);
    expect(order.products[1].name).toBe(orderFound.products[1].name);
    expect(order.products[1].description).toBe(
      orderFound.products[1].description
    );
    expect(order.products[1].salesPrice).toBe(
      orderFound.products[1].salesPrice
    );
    expect(order.status).toBe(orderFound.status);
  });
});
