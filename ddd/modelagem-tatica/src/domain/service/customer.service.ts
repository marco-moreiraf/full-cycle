import CustomerRepository from "../../infrastructure/repository/customer.repository";
import Customer from "../entity/customer";
import EventDispatcher from "../event/@shared/event-dispatcher";
import {v4 as uuid} from 'uuid'
import CustomerCreatedEvent from "../event/customer/customer-created.event";

export default class CustomerService {
    
    constructor (private customerRepository: CustomerRepository, private eventDispatcher: EventDispatcher){}

    async create(customer: Customer): Promise<void> {
        await this.customerRepository.create(customer);
        const customerCreatedEvent = new CustomerCreatedEvent(customer);
        this.eventDispatcher.notify(customer, customerCreatedEvent);
    }
}