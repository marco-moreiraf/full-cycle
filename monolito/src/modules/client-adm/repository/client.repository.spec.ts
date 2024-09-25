import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ClientRepository from "./client.repository";
import Address from "../../@shared/domain/value-object/address.value-object";

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

    await clientRepository.add(client);

    const clientFound = await ClientModel.findOne({
      where: { id: client.id.id },
    });

    expect(client.id.id).toBe(clientFound.id);
    expect(client.name).toBe(clientFound.name);
    expect(client.email).toBe(clientFound.email);
    expect(client.document).toBe(clientFound.document);
    expect(client.address.street).toBe(clientFound.street);
    expect(client.address.number).toBe(clientFound.number);
    expect(client.address.complement).toBe(clientFound.complement);
    expect(client.address.city).toBe(clientFound.city);
    expect(client.address.state).toBe(clientFound.state);
    expect(client.address.zipCode).toBe(clientFound.zipCode);
  });

  it("should find a client", async () => {
    const clientRepository = new ClientRepository();

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

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: "1234",
      street: "Street",
      number: "123",
      complement: "",
      city: "City",
      state: "State",
      zipCode: "123456",
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });

    const clientFound = await clientRepository.find(client.id.id);

    expect(client.id.id).toEqual(clientFound.id.id);
    expect(client.name).toEqual(clientFound.name);
    expect(client.email).toEqual(clientFound.email);
    expect(client.document).toBe(clientFound.document);
    expect(client.address.street).toBe(clientFound.address.street);
    expect(client.address.number).toBe(clientFound.address.number);
    expect(client.address.complement).toBe(clientFound.address.complement);
    expect(client.address.city).toBe(clientFound.address.city);
    expect(client.address.state).toBe(clientFound.address.state);
    expect(client.address.zipCode).toBe(clientFound.address.zipCode);
    expect(client.createdAt).toEqual(clientFound.createdAt);
    expect(client.updatedAt).toEqual(clientFound.updatedAt);
  });
});
