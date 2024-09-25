import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
  id: new Id(),
  name: "Client",
  email: "client@email.com",
  address: "Address",
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
    expect(result.address).toBe(client.address);
  });
});
