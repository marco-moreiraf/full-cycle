import { Sequelize } from "sequelize-typescript";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import ProductModel from "../db/sequelize/model/product.model";
import ProductRepository from "./product.repository";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();        
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua 1", 1, "Zipcode 1", "City 1");
        customer.Address = address;
        await customerRepository.create(customer);

        const productRepository = new ProductRepository()
        const product = new Product("1", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);

        const orderRepository = new OrderRepository();
        const order = new Order("1", customer.id, [orderItem]);
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ["items"], 
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    product_id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                },
            ],
        });
    });

    it("should update an order when adding an item", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua 1", 1, "Zipcode 1", "City 1");
        customer.Address = address;
        await customerRepository.create(customer);

        const productRepository = new ProductRepository()
        const product1 = new Product("1", "Product 1", 100);
        await productRepository.create(product1);

        const product2 = new Product("2", "Product 2", 200);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem("1", product1.id, product1.name, product1.price, 2);

        const orderRepository = new OrderRepository();
        const order = new Order("1", customer.id, [orderItem1]);
        await orderRepository.create(order);

        const orderItem2 = new OrderItem("2", product2.id, product2.name, product2.price, 3);
        order.addItem(orderItem2);
        
        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ["items"], 
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem1.id,
                    product_id: orderItem1.id,
                    name: orderItem1.name,
                    price: orderItem1.price,
                    quantity: orderItem1.quantity,
                    order_id: order.id,
                },
                {
                    id: orderItem2.id,
                    product_id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    order_id: order.id,
                },
            ],
        })
    });

    it("should update an order when removing an item", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua 1", 1, "Zipcode 1", "City 1");
        customer.Address = address;
        await customerRepository.create(customer);

        const productRepository = new ProductRepository()
        const product1 = new Product("1", "Product 1", 100);
        await productRepository.create(product1);

        const product2 = new Product("2", "Product 2", 200);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem("1", product1.id, product1.name, product1.price, 2);
        const orderItem2 = new OrderItem("2", product2.id, product2.name, product2.price, 3);

        const orderRepository = new OrderRepository();
        const order = new Order("1", customer.id, [orderItem1, orderItem2]);
        await orderRepository.create(order);

        var orderModel = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ["items"], 
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem1.id,
                    product_id: orderItem1.id,
                    name: orderItem1.name,
                    price: orderItem1.price,
                    quantity: orderItem1.quantity,
                    order_id: order.id,
                },
                {
                    id: orderItem2.id,
                    product_id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    order_id: order.id,
                },
            ],
        });

        order.removeItem(orderItem2.id);
        
        await orderRepository.update(order);

        orderModel = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ["items"], 
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem1.id,
                    product_id: orderItem1.id,
                    name: orderItem1.name,
                    price: orderItem1.price,
                    quantity: orderItem1.quantity,
                    order_id: order.id,
                },
            ],
        });
    });

    it("should find an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua 1", 1, "Zipcode 1", "City 1");
        customer.Address = address;
        await customerRepository.create(customer);

        const productRepository = new ProductRepository()
        const product = new Product("1", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);

        const orderRepository = new OrderRepository();
        const order = new Order("1", customer.id, [orderItem]);
        await orderRepository.create(order);

        const foundOrder = await orderRepository.find(order.id);

        expect(order).toStrictEqual(foundOrder);
    });

    it("should throw an error when order is not found", async () => {
        const orderRepository = new OrderRepository();

        expect(async () => {
            const foundOrder = await orderRepository.find("123");
        }).rejects.toThrow("Order not found");
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua 1", 1, "Zipcode 1", "City 1");
        customer.Address = address;
        await customerRepository.create(customer);

        const productRepository = new ProductRepository()
        const product1 = new Product("1", "Product 1", 100);
        await productRepository.create(product1);

        const product2 = new Product("2", "Product 2", 200);
        await productRepository.create(product2);

        const order1Item1 = new OrderItem("1", product1.id, product1.name, product1.price, 2);

        const orderRepository = new OrderRepository();
        const order1 = new Order("1", customer.id, [order1Item1]);
        await orderRepository.create(order1);

        const order2Item1 = new OrderItem("2", product1.id, product1.name, product1.price, 2);
        const order2Item2 = new OrderItem("3", product2.id, product2.name, product2.price, 3);
        const order2 = new Order("2", customer.id, [order2Item1, order2Item2]);
        await orderRepository.create(order2);

        const foundOrders = await orderRepository.findAll();

        expect([order1, order2]).toStrictEqual(foundOrders);
    });

});