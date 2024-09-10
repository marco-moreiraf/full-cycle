import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John");
    }).toThrow("customer: ID is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "");
    }).toThrow("customer: Name is required");
  });

  it("should throw error when id and name are empty", () => {
    expect(() => {
      let customer = new Customer("", "");
    }).toThrow("customer: ID is required,customer: Name is required");
  });

  it("should change name", () => {
    let customer = new Customer("123", "John");

    customer.changeName("Jane");

    expect(customer.name).toBe("Jane");
  });

  it("should throw error when change name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "John");
      customer.changeName("");
    }).toThrow("customer: Name is required");
  });

  it("should activate customer", () => {
    let customer = new Customer("123", "John");
    const address = new Address("Street 1", 2, "12345-123", "City");
    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should throw error when activate customer without address", () => {
    expect(() => {
      let customer = new Customer("123", "John");

      customer.activate();
    }).toThrow("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    let customer = new Customer("123", "John");

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });
});
