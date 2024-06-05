import Address from "../../entity/address";
import Customer from "../../entity/customer";
import Product from "../../entity/product";
import CustomerAddressUpdatedEvent from "../customer/customer-address-updated.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import { AggregateRoot } from "./aggregate-root";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {

    it("should notify all event handlers", () => {
        const product = new Product("123", "Product", 100);
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        product.register("ProductCreatedEvent", eventHandler);

        expect(product.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent(product);

        eventDispatcher.notify(product, productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should notify customer created event", async () => {
        const eventDispatcher = new EventDispatcher();
        const customer = new Customer("1", "Customer 1");
        customer.Address = new Address("Street 1", 1, "12345-123", "City 1");

        const spyEventHandler1 = jest.spyOn(customer.getEventHandlers["CustomerCreatedEvent"][0], "handle");
        const spyEventHandler2 = jest.spyOn(customer.getEventHandlers["CustomerCreatedEvent"][1], "handle");

        const customerCreatedEvent = new CustomerCreatedEvent(customer);
        eventDispatcher.notify(customer, customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });

    it("should notify customer address updated event", async () => {
        const eventDispatcher = new EventDispatcher();

        const customer = new Customer("1", "Customer 1");
        customer.Address = new Address("Street 1", 1, "12345-123", "City 1");

        customer.changeAddress(new Address("Street 2", 2, "54321-321", "City 2"));

        const spyEventHandler = jest.spyOn(customer.getEventHandlers["CustomerAddressUpdatedEvent"][0], "handle");

        const customerAddressUpdatedEvent = new CustomerAddressUpdatedEvent(customer);
        eventDispatcher.notify(customer, customerAddressUpdatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

});