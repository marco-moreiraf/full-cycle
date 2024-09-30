import {
    BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { ClientModel } from "./client.model";
import OrderProductModel from "./order-product.model";
import Product from "../domain/product.entity";
import Client from "../domain/client.entity";

@Table({ tableName: "orders", timestamps: false })
export default class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => ClientModel)
  @Column({ allowNull: false, field: "client_id" })
  declare clientId: string;

  @BelongsTo(() => ClientModel)
  declare client: ClientModel;

  @HasMany(() => OrderProductModel)
  declare products: OrderProductModel[];

  @Column({ allowNull: false })
  declare status: string;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
