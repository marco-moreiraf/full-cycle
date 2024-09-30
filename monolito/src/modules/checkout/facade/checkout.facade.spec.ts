import { Sequelize } from "sequelize-typescript";
import OrderProductModel from "../repository/order-product.model";
import OrderModel from "../repository/order.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import ProductModelAdm from "../../product-adm/repository/product.model";
import ProductModelCatalog from "../../store-catalog/repository/product.model";
import InvoiceItemModel from "../../invoice/repository/invoice-item.model";
import { TransactionModel } from "../../payment/repository/transaction.model";
import { Umzug } from "umzug";
import { migrator } from "../../../test-migrations/config-migrations/migrator";
import ProductModel from "../repository/product.model";
import Client from "../domain/client.entity";
import Address from "../../@shared/domain/value-object/address.value-object";
import CheckoutFacadeFactory from "../factory/facade.factory";
import { ClientModel } from "../../client-adm/repository/client.model";

describe("Checkout facade unit tests", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      database: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      ClientModel,
      OrderModel,
      OrderProductModel,
      InvoiceModel,
      InvoiceItemModel,
      ProductModelAdm,
      ProductModelCatalog,
      ProductModel,
      TransactionModel,
    ]);
    migration = migrator(sequelize);
    await migration.up();
    // await sequelize.sync();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    migration = migrator(sequelize);
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

    //Initialize facade
    const checkoutFacade = CheckoutFacadeFactory.create();

    const input = {
      clientId: client.id.id,
      products: [{ productId: product1.id }, { productId: product2.id }],
    };
    const createdOrder = await checkoutFacade.placeOrder(input);

    expect(createdOrder.id).toBeDefined();
    expect(createdOrder.invoiceId).toBeDefined();
    expect(createdOrder.products.length).toBe(2);
    expect(createdOrder.products[0].productId).toBe(product1.id);
    expect(createdOrder.products[1].productId).toBe(product2.id);
    expect(createdOrder.status).toBe("approved");
    expect(createdOrder.total).toBe(300);
  });
});
