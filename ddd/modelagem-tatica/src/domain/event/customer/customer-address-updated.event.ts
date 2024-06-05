import Address from "../../entity/address";
import Customer from "../../entity/customer";
import EventInterface from "../@shared/event.interface";

export default class CustomerAddressUpdatedEvent implements EventInterface {
    dataTimeOccurred: Date;
    eventData: Customer;

    constructor(eventData: any) {
        this.dataTimeOccurred = new Date();
        this.eventData = eventData;
    }
}