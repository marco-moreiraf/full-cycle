import { app, sequelize, migration, setupDb } from "../express";
import request from "supertest";

describe("E2E test for client", () => {
  beforeEach(async () => {
    await setupDb();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    await migration.down();
    await sequelize.close();
  });

  it("should create a client", async () => {
    const input = {
      id: "1",
      name: "Client 1",
      email: "client@email.com",
      document: "1234",
      address: {
        street: "Street",
        number: "123",
        complement: "",
        city: "City",
        state: "State",
        zipCode: "12345",
      },
    };

    const response = await request(app).post("/clients").send(input);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(input.id);
    expect(response.body.name).toBe(input.name);
    expect(response.body.email).toBe(input.email);
    expect(response.body.document).toBe(input.document);
    expect(response.body.address.street).toBe(input.address.street);
    expect(response.body.address.number).toBe(input.address.number);
    expect(response.body.address.complement).toBe(input.address.complement);
    expect(response.body.address.city).toBe(input.address.city);
    expect(response.body.address.state).toBe(input.address.state);
    expect(response.body.address.zipCode).toBe(input.address.zipCode);
  });

  it("should not add a client", async () => {
    const response = await request(app).post("/clients").send({
        name: "Client 1"
    });

    expect(response.status).toBe(500);
  })
});
