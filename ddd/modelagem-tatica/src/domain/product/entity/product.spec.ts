import Product from "./product";

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let product = new Product("", "Product 1", 100);
    }).toThrow("product: ID is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let product = new Product("1", "", 100);
    }).toThrow("product: Name is required");
  });

  it("should throw error when price is less than or equal to", () => {
    expect(() => {
      let product = new Product("1", "Product 1", 0);
    }).toThrow("product: Price must be greater than 0");
  });

  it("should thrown an error when id and name are empty", () => {
    expect(() => {
      let product = new Product("", "", 100);
    }).toThrow("product: ID is required,product: Name is required");
  });

  it("should change name", () => {
    const product = new Product("123", "Product 1", 100);

    product.changeName("Product 2");

    expect(product.name).toBe("Product 2");
  });

  it("should change price", () => {
    const product = new Product("123", "Product 1", 100);

    product.changePrice(200);

    expect(product.price).toBe(200);
  });
});
