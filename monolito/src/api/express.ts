import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import InvoiceModel from "../modules/invoice/repository/invoice.model";
import InvoiceItemModel from "../modules/invoice/repository/invoice-item.model";
import { TransactionModel } from "../modules/payment/repository/transaction.model";
import ProductModelAdm from "../modules/product-adm/repository/product.model";
import ProductModelCatalog from "../modules/store-catalog/repository/product.model";
import OrderModel from "../modules/checkout/repository/order.model";
import OrderProductModel from "../modules/checkout/repository/order-product.model";
import ProductModel from "../modules/checkout/repository/product.model";
import { Umzug } from "umzug";
import { migrator } from "../test-migrations/config-migrations/migrator";
import { productRoute } from "./routes/product.route";
import { clientRoute } from "./routes/client.route";
import { checkoutRoute } from "./routes/checkout.route";
import { invoiceRoute } from "./routes/invoice.route";

export const app: Express = express();
app.use(express.json());
app.use("/products", productRoute);
app.use("/clients", clientRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;
export let migration: Umzug<any>;

export async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
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
  //   await sequelize.sync();
}

setupDb();
