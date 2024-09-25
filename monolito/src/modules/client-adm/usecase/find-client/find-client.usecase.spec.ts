import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
  id: new Id(),
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
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client)),
  };
};

describe("FindClient usecase unit test", () => {
  it("should find a client", async () => {
    const clientRepository = MockRepository();
    const findClientUseCase = new FindClientUseCase(clientRepository);

    const input = {
      id: client.id.id,
    };

    const result = await findClientUseCase.execute(input);

    expect(clientRepository.find).toHaveBeenCalled();
    expect(result.id).toBe(client.id.id);
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(client.document).toBe(result.document);
    expect(client.address.street).toBe(result.address.street);
    expect(client.address.number).toBe(result.address.number);
    expect(client.address.complement).toBe(result.address.complement);
    expect(client.address.city).toBe(result.address.city);
    expect(client.address.state).toBe(result.address.state);
    expect(client.address.zipCode).toBe(result.address.zipCode);
  });
});
