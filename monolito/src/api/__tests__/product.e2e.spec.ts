import { app, sequelize, migration, setupDb } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
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

  it("should create a product", async () => {
    const input = {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };

    const response = await request(app).post("/products").send(input);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(input.id);
    expect(response.body.name).toBe(input.name);
    expect(response.body.description).toBe(input.description);
    expect(response.body.purchasePrice).toBe(input.purchasePrice);
    expect(response.body.stock).toBe(input.stock);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/products").send({
      name: "Product 1",
    });

    expect(response.status).toBe(500);
  });
});
