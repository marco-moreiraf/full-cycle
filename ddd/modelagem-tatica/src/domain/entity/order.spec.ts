import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", []);
        }).toThrow("ID is required");
    });

    it("should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("123", "", []);
        }).toThrow("CustomerId is required");
    });

    it("should throw error when items is empty", () => {
        expect(() => {
            let order = new Order("123", "123", []);
        }).toThrow("Items are required");
    });

    it("should add an item", () => {
        const item1 = new OrderItem("1", "p1", "Item 1", 100, 2);
        const item2 = new OrderItem("2", "p2", "Item 2", 200, 3);
        const item3 = new OrderItem("3", "p3", "Item 3", 100, 2);

        const order = new Order("1", "1", [item1]);

        order.addItem(item2);

        expect(order.items).toStrictEqual([item1, item2]);
        expect(order.total()).toBe(800);

        order.addItem(item3);

        expect(order.items).toStrictEqual([item1, item2, item3]);
        expect(order.total()).toBe(1000);
    });

    it("should remove an item", () => {
        const item1 = new OrderItem("1", "p1", "Item 1", 100, 2);
        const item2 = new OrderItem("2", "p2", "Item 2", 200, 3);
        const item3 = new OrderItem("3", "p3", "Item 3", 100, 2);

        const order = new Order("1", "1", [item1, item2, item3]);

        order.removeItem(item3.id);

        expect(order.items).toStrictEqual([item1, item2]);
        expect(order.total()).toBe(800);

        order.removeItem(item2.id);

        expect(order.items).toStrictEqual([item1]);
        expect(order.total()).toBe(200);
    });

    it("should throw an error when remove invalid item", () => {
        expect(() => {
            let item1 = new OrderItem("1", "p1", "Item 1", 100, 2);
            let order = new Order("1", "1", [item1]);
            order.removeItem("123");
        }).toThrow("Item not found");
    });

    it("should throw an error when remove all items", () => {
        expect(() => {
            let item1 = new OrderItem("1", "p1", "Item 1", 100, 2);
            let order = new Order("1", "1", [item1]);
            order.removeItem(item1.id);
        }).toThrow("Items are required");
    });

    it("should calculate total", () => {
        const item1 = new OrderItem("1", "p1", "Item 1", 100, 2);
        const item2 = new OrderItem("2", "p2", "Item 2", 200, 3);
        const item3 = new OrderItem("3", "p3", "Item 3", 100, 2);

        const order1 = new Order("1", "1", [item1]);

        expect(order1.total()).toBe(200);

        const order2 = new Order("1", "1", [item1, item2, item3]);

        expect(order2.total()).toBe(1000);
    });

});