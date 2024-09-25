import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ClientRepository from "./client.repository";

describe("Client repository unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      database: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const clientRepository = new ClientRepository();

    const client = new Client({
      id: new Id(),
      name: "Client",
      email: "client@email.com",
      address: "Address",
    });

    await clientRepository.add(client);

    const clientFound = await ClientModel.findOne({
      where: { id: client.id.id },
    });

    expect(client.id.id).toBe(clientFound.id);
    expect(client.name).toBe(clientFound.name);
    expect(client.email).toBe(clientFound.email);
    expect(client.address).toBe(clientFound.address);
  });

  it("should find a client", async () => {
    const clientRepository = new ClientRepository();

    const client = new Client({
      id: new Id(),
      name: "Client",
      email: "client@email.com",
      address: "Address",
    });

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });

    const clientFound = await clientRepository.find(client.id.id);

    expect(client.id.id).toEqual(clientFound.id.id);
    expect(client.name).toEqual(clientFound.name);
    expect(client.email).toEqual(clientFound.email);
    expect(client.address).toEqual(clientFound.address);
    expect(client.createdAt).toEqual(clientFound.createdAt);
    expect(client.updatedAt).toEqual(clientFound.updatedAt);
  });
});
