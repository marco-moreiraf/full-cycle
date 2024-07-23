import { AggregateRoot } from "./aggregate-root";
import EventDispatcherInterface from "./event-dispactcher.interface";
import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

export default class EventDispatcher implements EventDispatcherInterface {

    notify(aggregateRoot: AggregateRoot, event: EventInterface): void {
        const eventName = event.constructor.name;
        if (aggregateRoot.getEventHandlers[eventName]) {
            aggregateRoot.getEventHandlers[eventName].forEach((eventHandler) => {
                eventHandler.handle(event);
            });
        }
    }
}