import Address from "../../../@shared/domain/value-object/address.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

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

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    add: jest.fn(),
  };
};

describe("FindInvoice usecase unit test", () => {
  it("should find an invoice", async () => {
    const invoiceRepository = MockRepository();
    const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);

    const result = await findInvoiceUseCase.execute({ id: invoice.id.id });

    expect(invoiceRepository.find).toHaveBeenCalled();
    expect(invoice.id.id).toBe(result.id);
    expect(invoice.name).toBe(result.name);
    expect(invoice.document).toBe(result.document);
    expect(invoice.address.street).toBe(result.address.street);
    expect(invoice.address.number).toBe(result.address.number);
    expect(invoice.address.complement).toBe(result.address.complement);
    expect(invoice.address.city).toBe(result.address.city);
    expect(invoice.address.state).toBe(result.address.state);
    expect(invoice.address.zipCode).toBe(result.address.zipCode);
    expect(result.items.length).toBe(2);
    expect(invoice.items[0].id.id).toBe(result.items[0].id);
    expect(invoice.items[0].name).toBe(result.items[0].name);
    expect(invoice.items[0].price).toBe(result.items[0].price);
    expect(invoice.items[1].id.id).toBe(result.items[1].id);
    expect(invoice.items[1].name).toBe(result.items[1].name);
    expect(invoice.items[1].price).toBe(result.items[1].price);
    expect(invoice.items[0].price + invoice.items[1].price).toBe(result.total);
  });
});
