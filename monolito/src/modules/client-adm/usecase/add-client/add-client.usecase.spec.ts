import Address from "../../../@shared/domain/value-object/address.value-object";
import Client from "../../domain/client.entity";
import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};
describe("AddClient usecase unit test", () => {
  it("should create a client", async () => {
    const clientRepository = MockRepository();
    const addClientUseCase = new AddClientUseCase(clientRepository);

    const input = {
      name: "Client",
      email: "client@email.com",
      document: "1234",
      address: new Address({
        street: "Street",
        number: "123",
        complement: "",
        city: "City",
        state: "State",
        zipCode: "123456",
      }),
    };

    const result = await addClientUseCase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
    expect(result.document).toBe(input.document);
    expect(result.address.street).toBe(input.address.street);
    expect(result.address.number).toBe(input.address.number);
    expect(result.address.complement).toBe(input.address.complement);
    expect(result.address.city).toBe(input.address.city);
    expect(result.address.state).toBe(input.address.state);
    expect(result.address.zipCode).toBe(input.address.zipCode);
  });
});
