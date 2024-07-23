import { AggregateRoot } from "./aggregate-root";
import EventInterface from "./event.interface";

export default interface EventDispatcherInterface {
    notify(aggregateRoot: AggregateRoot, event: EventInterface): void;
}