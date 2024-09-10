import { AggregateRoot } from "../event/aggregate-root";
import Notification from "../notification/notification";

export default abstract class Entity extends AggregateRoot {
  protected _id: string;
  protected notification: Notification;

  constructor() {
    super();
    this.notification = new Notification();
  }

  get id(): string {
    return this._id;
  }
}
