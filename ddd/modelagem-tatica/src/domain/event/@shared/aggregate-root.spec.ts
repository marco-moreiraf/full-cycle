import Product from "../../entity/product";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";

describe("Aggregate root tests", () => {

    it("should register an event handler", () => {
        const product = new Product("123", "Product", 100);
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        product.register("ProductCreatedEvent", eventHandler);

        expect(product.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(product.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(product.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should unregister an event handler", () => {
        const product = new Product("123", "Product", 100);
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        product.register("ProductCreatedEvent", eventHandler);

        expect(product.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        product.unregister("ProductCreatedEvent", eventHandler);

        expect(product.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(product.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it("should unregister all event handlers", () => {
        const product = new Product("123", "Product", 100);
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        product.register("ProductCreatedEvent", eventHandler);

        expect(product.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        product.unregisterAll();

        expect(product.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });

})