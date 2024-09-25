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
      address: "Address",
    };

    const result = await addClientUseCase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
    expect(result.address).toBe(input.address);
  });
});
