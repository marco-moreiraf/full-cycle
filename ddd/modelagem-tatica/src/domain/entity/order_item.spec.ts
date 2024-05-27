import OrderItem from "./order_item";

describe("OrderItem unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let orderItem = new OrderItem("", "123", "Item 1", 100, 2);
        }).toThrow("ID is required");
    });

    it("should throw error when productId is empty", () => {
        expect(() => {
            let orderItem = new OrderItem("123", "", "Item 1", 100, 2);
        }).toThrow("ProductId is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            let orderItem = new OrderItem("123", "123", "", 100, 2);
        }).toThrow("Name is required");
    });

    it("should throw error when price is less than or equal to 0", () => {
        expect(() => {
            let orderItem = new OrderItem("123", "123", "Item 1", 0, 2);
        }).toThrow("Price must be greater than 0");
    });

    it("should throw error when quantity is less than or equal to 0", () => {
        expect(() => {
            let orderItem = new OrderItem("123", "123", "Item 1", 100, -1);
        }).toThrow("Quantity must be greater than 0");
    });

    it("should calculate total", () => {
        const item = new OrderItem("123", "123", "Item 1", 100, 2);

        expect(item.orderItemTotal()).toBe(200);
    });
    
})