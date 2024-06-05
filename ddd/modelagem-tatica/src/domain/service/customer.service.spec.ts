import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../infrastructure/db/sequelize/model/customer.model";
import CustomerRepository from "../../infrastructure/repository/customer.repository";
import Address from "../entity/address";
import Customer from "../entity/customer";
import EventDispatcher from "../event/@shared/event-dispatcher";
import CustomerService from "./customer.service";

describe("Order service unit tests", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();        
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should notify customer created event", async () => {
        const customerRepository = new CustomerRepository();
        const eventDispatcher = new EventDispatcher();
        const customerService = new CustomerService(customerRepository, eventDispatcher);

        const customer = new Customer("1", "Customer 1");
        customer.Address = new Address("Street 1", 1, "12345-123", "City 1");

        const spyEventHandler1 = jest.spyOn(customer.getEventHandlers["CustomerCreatedEvent"][0], "handle");
        const spyEventHandler2 = jest.spyOn(customer.getEventHandlers["CustomerCreatedEvent"][1], "handle");

        await customerService.create(customer);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });

    it("should notify customer address updated event", async () => {
        const customerRepository = new CustomerRepository();
        const eventDispatcher = new EventDispatcher();
        const customerService = new CustomerService(customerRepository, eventDispatcher);

        const customer = new Customer("1", "Customer 1");
        customer.Address = new Address("Street 1", 1, "12345-123", "City 1");

        const spyEventHandler1 = jest.spyOn(customer.getEventHandlers["CustomerCreatedEvent"][0], "handle");
        const spyEventHandler2 = jest.spyOn(customer.getEventHandlers["CustomerCreatedEvent"][1], "handle");

        await customerService.create(customer);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });

});