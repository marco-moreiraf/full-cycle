import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";
import SendConsoleLogWhenCustomerAddressUpdatedHandler from "../event/handler/send-console-log-when-customer-address-updated.handler";
import SendConsoleLog1WhenCustomerCreatedHandler from "../event/handler/send-console-log1-when-customer-created.handler";
import SendConsoleLog2WhenCustomerCreatedHandler from "../event/handler/send-console-log2-when-customer-created.handler";
import Address from "../value-object/address";

export default class Customer extends Entity {
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    super();
    this._id = id;
    this._name = name;

    this.validate();

    this.register(
      "CustomerCreatedEvent",
      new SendConsoleLog1WhenCustomerCreatedHandler()
    );
    this.register(
      "CustomerCreatedEvent",
      new SendConsoleLog2WhenCustomerCreatedHandler()
    );
  }

  get name(): string {
    return this._name;
  }

  get Address(): Address {
    return this._address;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      this.notification.addError({
        context: "customer",
        message: "ID is required",
      });
    }
    if (this._name.length === 0) {
      this.notification.addError({
        context: "customer",
        message: "Name is required",
      });
    }

    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors());
    }
  }

  changeName(name: string) {
    this._name = name;

    this.validate();
  }

  changeAddress(address: Address) {
    this._address = address;
    this.register(
      "CustomerAddressUpdatedEvent",
      new SendConsoleLogWhenCustomerAddressUpdatedHandler()
    );
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
