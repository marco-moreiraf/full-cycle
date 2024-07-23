import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("Order service unit tests", () => {

    it("should place an order", () => {
        const customer = new Customer("1", "John");
        const item1 = new OrderItem("1", "p1", "Item 1", 100, 2);
        const item2 = new OrderItem("2", "p2", "Item 2", 200, 3);
        const item3 = new OrderItem("3", "p3", "Item 3", 100, 2);

        const order = OrderService.placeOrder(customer, [item1, item2, item3]);

        expect(customer.rewardPoints).toBe(500);
        expect(order.total()).toBe(1000);
    });

    it("should get total of all orders", () => {
        const item1 = new OrderItem("1", "p1", "Item 1", 100, 2);
        const item2 = new OrderItem("2", "p2", "Item 2", 200, 3);
        const item3 = new OrderItem("3", "p3", "Item 3", 100, 2);

        const order1 = new Order("1", "1", [item1]);
        const order2 = new Order("1", "1", [item1, item2, item3]);
        const orders = [order1, order2];

        const total = OrderService.total(orders);

        expect(total).toBe(1200);
    });

});