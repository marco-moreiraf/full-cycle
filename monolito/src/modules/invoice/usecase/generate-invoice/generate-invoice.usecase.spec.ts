import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    find: jest.fn(),
    add: jest.fn(),
  };
};

describe("GenerateInvoice usecase unit test", () => {
  it("should generate an invoice", async () => {
    const invoiceRepository = MockRepository();
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(
      invoiceRepository
    );

    const input = {
      name: "Name",
      document: "1234",
      street: "Street",
      number: "12",
      complement: "",
      city: "City",
      state: "State",
      zipCode: "12345",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
        },
      ],
    };

    const result = await generateInvoiceUseCase.execute(input);

    expect(invoiceRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined;
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items[0].id).toBe(input.items[0].id);
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
    expect(result.items[1].id).toBe(input.items[1].id);
    expect(result.items[1].name).toBe(input.items[1].name);
    expect(result.items[1].price).toBe(input.items[1].price);
    expect(result.total).toBe(input.items[0].price + input.items[1].price);
  });
});
