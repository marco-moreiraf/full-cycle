import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import Address from "../../@shared/domain/value-object/address.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceRepository from "./invoice.repository";

describe("Invoice repository unit tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      database: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

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

    await invoiceRepository.add(invoice);

    const invoiceFound = await InvoiceModel.findOne({
      where: { id: invoice.id.id },
      include: ["items"],
    });

    expect(invoiceFound.id).toBe(invoice.id.id);
    expect(invoiceFound.name).toBe(invoice.name);
    expect(invoiceFound.document).toBe(invoice.document);
    expect(invoiceFound.street).toBe(invoice.address.street);
    expect(invoiceFound.number).toBe(invoice.address.number);
    expect(invoiceFound.complement).toBe(invoice.address.complement);
    expect(invoiceFound.city).toBe(invoice.address.city);
    expect(invoiceFound.state).toBe(invoice.address.state);
    expect(invoiceFound.zipCode).toBe(invoice.address.zipCode);
    expect(invoiceFound.items[0].id).toBe(invoice.items[0].id.id);
    expect(invoiceFound.items[0].name).toBe(invoice.items[0].name);
    expect(invoiceFound.items[0].price).toBe(invoice.items[0].price);
    expect(invoiceFound.items[1].id).toBe(invoice.items[1].id.id);
    expect(invoiceFound.items[1].name).toBe(invoice.items[1].name);
    expect(invoiceFound.items[1].price).toBe(invoice.items[1].price);
    expect(invoiceFound.total).toBe(invoice.total());
  });

  it("should find a invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

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

    const invoiceFound = await invoiceRepository.find(invoice.id.id);

    expect(invoiceFound.id.id).toBe(invoice.id.id);
    expect(invoiceFound.name).toBe(invoice.name);
    expect(invoiceFound.document).toBe(invoice.document);
    expect(invoiceFound.address.street).toBe(invoice.address.street);
    expect(invoiceFound.address.number).toBe(invoice.address.number);
    expect(invoiceFound.address.complement).toBe(invoice.address.complement);
    expect(invoiceFound.address.city).toBe(invoice.address.city);
    expect(invoiceFound.address.state).toBe(invoice.address.state);
    expect(invoiceFound.address.zipCode).toBe(invoice.address.zipCode);
    expect(invoiceFound.items[0].id.id).toBe(invoice.items[0].id.id);
    expect(invoiceFound.items[0].name).toBe(invoice.items[0].name);
    expect(invoiceFound.items[0].price).toBe(invoice.items[0].price);
    expect(invoiceFound.items[1].id.id).toBe(invoice.items[1].id.id);
    expect(invoiceFound.items[1].name).toBe(invoice.items[1].name);
    expect(invoiceFound.items[1].price).toBe(invoice.items[1].price);
    expect(invoiceFound.total()).toBe(invoice.total());
  });
});
