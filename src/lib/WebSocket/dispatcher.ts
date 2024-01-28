import { nanoid } from "nanoid";
import { type SocketEvent, Handler, WebSocketMessage } from "./types";

type Observer = {
  handler: Handler<unknown>;
  id: string;
};

export class Dispatcher {
  private observers: Record<SocketEvent, Array<Observer>>;
  private observingEvent: Record<string, SocketEvent>;

  constructor() {
    this.observers = {};
    this.observingEvent = {};
  }

  /**
   *
   * @param event Event name for which to register handler as observer
   * @param handler Called when an incoming message is received
   * @returns Observer Id for later removal of observer
   */
  addObserver(event: SocketEvent, handler: Handler<unknown>): string {
    const observer = {
      handler,
      id: nanoid(),
    };

    const observersForEvent = this.observers[event];

    if (observersForEvent != null) observersForEvent.push(observer);
    else this.observers[event] = [observer];

    this.observingEvent[observer.id] = event;

    return observer.id;
  }

  /**
   *
   * @param observerId Registered observer Id
   * @returns whether an observer with given Id was removed
   */
  removeObserver(observerId: string): boolean {
    const event = this.observingEvent[observerId];
    if (event) {
      delete this.observingEvent[observerId];
      this.observers[event] = this.observers[event].filter(
        (ob) => ob.id !== observerId
      );
      return true;
    }
    return false;
  }

  /**
   *
   * @param message Dispatch message to all observers for an event
   */
  dispatchMessage(message: WebSocketMessage<unknown>): void {
    for (const observer of this.observers[message.eventName]) {
      observer.handler(message);
    }
  }
}
