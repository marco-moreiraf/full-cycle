import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import CustomerRepository from "./customer.repository";

describe("Customer repository test", () => {

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

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua 1", 123, "12345-123", "Cidade");
        customer.Address = address;

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: customer.id } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: customer.Address.street,
            number: customer.Address.number,
            zipcode: customer.Address.zip,
            city: customer.Address.city,
        });
    });

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua 1", 123, "12345-123", "Cidade");
        customer.Address = address;

        await customerRepository.create(customer);

        customer.changeName("Customer 2");

        await customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: customer.id } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: customer.Address.street,
            number: customer.Address.number,
            zipcode: customer.Address.zip,
            city: customer.Address.city,
        });
    });

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua 1", 123, "12345-123", "Cidade");
        customer.Address = address;

        await customerRepository.create(customer);

        var foundCustomer = await customerRepository.find(customer.id);

        expect(customer).toStrictEqual(foundCustomer);

        customer.addRewardPoints(100);
        customer.activate();

        await customerRepository.update(customer);

        foundCustomer = await customerRepository.find(customer.id);

        expect(customer).toStrictEqual(foundCustomer);
    });

    it("should throw an error when customer is not found", async () => {
        const customerRepository = new CustomerRepository();

        expect(async () => {
            await customerRepository.find("12345123");
        }).rejects.toThrow("Customer not found");
    });

    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("1", "Customer 1");
        const address1 = new Address("Rua 1", 123, "12345-123", "Cidade");
        customer1.Address = address1;
        await customerRepository.create(customer1);

        const customer2 = new Customer("2", "Customer 2");
        const address2 = new Address("Rua 2", 321, "54321-321", "Cidade 2");
        customer2.Address = address2;
        await customerRepository.create(customer2);

        var foundCustomers = await customerRepository.findAll();

        expect(foundCustomers).toHaveLength(2);
        expect(foundCustomers).toContainEqual(customer1);
        expect(foundCustomers).toContainEqual(customer2);

        customer1.addRewardPoints(100);
        customer1.activate();
        await customerRepository.update(customer1);

        customer2.addRewardPoints(200);
        customer2.deactivate();
        await customerRepository.update(customer2);

        foundCustomers = await customerRepository.findAll();

        expect(foundCustomers).toHaveLength(2);
        expect(foundCustomers).toContainEqual(customer1);
        expect(foundCustomers).toContainEqual(customer2);
    });
});