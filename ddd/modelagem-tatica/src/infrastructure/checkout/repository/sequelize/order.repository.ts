import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                product_id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
        }, 
        {
            include: [{model: OrderItemModel}],
        });
    }

    async update(entity: Order): Promise<void> {
        const existingItems = await OrderItemModel.findAll({ where: { order_id: entity.id } });
        const existingItemsIds = existingItems.map(item => item.id);
        const updatedItemsIds = entity.items.map(item => item.id);
        const itemsToRemove = existingItems.filter(item => !updatedItemsIds.includes(item.id));
        const itemsToAdd = entity.items.filter(item => !existingItemsIds.includes(item.id));

        for (const item of itemsToRemove) {
            await OrderItemModel.destroy({ where: { id: item.id } });
        }

        for (const item of itemsToAdd) {
            await OrderItemModel.create({
                id: item.id,
                product_id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                order_id: entity.id,
            });
        }

        await OrderModel.update(
        {
            total: entity.total(),
        }, 
        {
            where: {
                id: entity.id
            }
        });
    }
    
    async find(orderId: string): Promise<Order> {
        let orderModel;

        try {
            orderModel = await OrderModel.findOne({
                where: { id: orderId },
                include: [{model: OrderItemModel}],
                rejectOnEmpty: true,
            });
        } catch (error) {
            throw new Error("Order not found");
        }

        return new Order(
            orderModel.id, 
            orderModel.customer_id, 
            orderModel.items.map(item => new OrderItem(item.id, item.product_id, item.name, item.price, item.quantity))
        );
    }

    async findAll(): Promise<Order[]> {
        const orderModel = await OrderModel.findAll({ include: [{ model: OrderItemModel }]});

        return orderModel.map(order => 
            new Order(
                order.id, 
                order.customer_id, 
                order.items.map(item => 
                    new OrderItem(
                        item.id, 
                        item.product_id, 
                        item.name, item.price, 
                        item.quantity
                    )
                )
            )
        );
    }
}