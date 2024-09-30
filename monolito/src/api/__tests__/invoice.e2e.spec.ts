import Address from "../../modules/@shared/domain/value-object/address.value-object";
import InvoiceItem from "../../modules/invoice/domain/invoice-item.entity";
import Invoice from "../../modules/invoice/domain/invoice.entity";
import InvoiceItemModel from "../../modules/invoice/repository/invoice-item.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import { app, sequelize, migration, setupDb } from "../express";
import request from "supertest";

describe("E2E test for invoice", () => {
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

  it("should find an invoice", async () => {
    const address = new Address({
      street: "Street",
      number: "123",
      complement: "",
      city: "City",
      state: "State",
      zipCode: "12345",
    });

    const invoiceItem1 = new InvoiceItem({
      name: "Item 1",
      price: 100,
    });

    const invoiceItem2 = new InvoiceItem({
      name: "Item 2",
      price: 200,
    });

    const invoice = new Invoice({
      name: "Client",
      document: "1234",
      address: address,
      items: [invoiceItem1, invoiceItem2],
    });

    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        items: invoice.items.map((item) => ({
          id: item.id.id,
          invoiceId: invoice.id.id,
          name: item.name,
          price: item.price,
        })),
        total: invoice.total(),
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
      {
        include: [{ model: InvoiceItemModel }],
      }
    );

    const response = await request(app).get(`/invoice/${invoice.id.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(invoice.id.id);
    expect(response.body.name).toBe(invoice.name);
    expect(response.body.document).toBe(invoice.document);
    expect(response.body.address.street).toBe(invoice.address.street);
    expect(response.body.address.number).toBe(invoice.address.number);
    expect(response.body.address.complement).toBe(invoice.address.complement);
    expect(response.body.address.city).toBe(invoice.address.city);
    expect(response.body.address.state).toBe(invoice.address.state);
    expect(response.body.address.zipCode).toBe(invoice.address.zipCode);
    expect(response.body.items[0].id).toBe(invoice.items[0].id.id);
    expect(response.body.items[0].name).toBe(invoice.items[0].name);
    expect(response.body.items[0].price).toBe(invoice.items[0].price);
    expect(response.body.items[1].id).toBe(invoice.items[1].id.id);
    expect(response.body.items[1].name).toBe(invoice.items[1].name);
    expect(response.body.items[1].price).toBe(invoice.items[1].price);
    expect(response.body.total).toBe(invoice.total());
  });

  it("should not find an invoice", async () => {
    const response = await request(app).get("/invoice/1");

    expect(response.status).toBe(500);
  });
});
