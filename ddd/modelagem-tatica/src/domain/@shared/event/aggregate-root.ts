import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";


export abstract class AggregateRoot {
    private _eventHandlers: { [eventName: string]: EventHandlerInterface[] } = {};
    
    get getEventHandlers(): { [eventName: string]: EventHandlerInterface[] } {
        return this._eventHandlers;
    }

    register(eventName: string, eventHandler: EventHandlerInterface<EventInterface>): void {
        if (!this._eventHandlers[eventName]) {
            this._eventHandlers[eventName] = [];
        }

        this._eventHandlers[eventName].push(eventHandler);
    }

    unregister(eventName: string, eventHandler: EventHandlerInterface<EventInterface>): void {
        if (this._eventHandlers[eventName]) {
            const index = this._eventHandlers[eventName].indexOf(eventHandler);
            if (index !== -1) {
                this._eventHandlers[eventName].splice(index, 1);
            }
        }
    }

    unregisterAll(): void {
        this._eventHandlers = {};
    }
}