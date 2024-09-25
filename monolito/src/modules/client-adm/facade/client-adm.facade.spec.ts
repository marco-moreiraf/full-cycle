import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientAdmFacadeFactory from "../factory/facade.factory";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("ClientAdm facade unit tests", () => {
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

  it("should add a client", async () => {
    const clientAdmFacade = ClientAdmFacadeFactory.create();

    const client = new Client({
      id: new Id(),
      name: "Client",
      email: "client@email.com",
      address: "Address",
    });

    await clientAdmFacade.addClient({
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
    });

    const clientFound = await ClientModel.findOne({
      where: { id: client.id.id },
    });

    expect(client.id.id).toBe(clientFound.id);
    expect(client.name).toBe(clientFound.name);
    expect(client.email).toBe(clientFound.email);
    expect(client.address).toBe(clientFound.address);
  });

  it("should find a client", async () => {
    const clientAdmFacade = ClientAdmFacadeFactory.create();

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

    const clientFound = await clientAdmFacade.findClient({ id: client.id.id });

    expect(client.id.id).toBe(clientFound.id);
    expect(client.name).toBe(clientFound.name);
    expect(client.email).toBe(clientFound.email);
    expect(client.address).toBe(clientFound.address);
    expect(client.createdAt).toEqual(clientFound.createdAt);
    expect(client.updatedAt).toEqual(clientFound.updatedAt);
  });
});
