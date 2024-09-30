import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { ClientModel } from "./client.model";
import OrderProductModel from "./order-product.model";
import OrderModel from "./order.model";

export default class OrderRepository implements CheckoutGateway {
  async add(order: Order): Promise<void> {
    await OrderModel.create(
      {
        id: order.id.id,
        clientId: order.client.id.id,
        products: order.products.map((product) => ({
          id: product.id.id,
          orderId: order.id.id,
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        })),
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      {
        include: [{ model: OrderProductModel }],
      }
    );
  }

  async find(id: string): Promise<Order | null> {
    const order = await OrderModel.findOne({
      where: { id: id },
      include: [{ model: ClientModel }, { model: OrderProductModel }],
    });

    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }

    return new Order({
      id: new Id(order.id),
      client: new Client({
        id: new Id(order.client.id),
        name: order.client.name,
        email: order.client.email,
        document: order.client.document,
        address: new Address({
          street: order.client.street,
          number: order.client.number,
          complement: order.client.complement,
          city: order.client.city,
          state: order.client.state,
          zipCode: order.client.zipCode,
        }),
        createdAt: order.client.createdAt,
        updatedAt: order.client.updatedAt,
      }),
      products: order.products.map(
        (product) =>
          new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
          })
      ),
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  }
}
