import {
  type Handler,
  WebSocketMessage,
  MessageType,
  EventsRegistry,
  EmitterQueueTask,
  EventPayload,
} from "./types";
import { Dispatcher } from "./dispatcher";
import { MessageTranscoder } from "./transcoder";
import { WorkerQueue } from "@/lib/WorkerQueue";
import { nanoid } from "nanoid";

type SocketState = "connecting" | "open" | "closed";

export type EventName<T extends EventsRegistry> = keyof T & string;

export class Socket<Events extends EventsRegistry> {
  private socket: WebSocket;
  private dispatcher: Dispatcher;
  private transcoder: MessageTranscoder;

  private emitterQueue: WorkerQueue<EmitterQueueTask>;

  private _state: SocketState = "connecting";
  public onOpen: (ev?: Event) => void = () => {};
  public onClose: (ev?: CloseEvent) => void = () => {};

  constructor(url: URL | string) {
    this.socket = new WebSocket(url);
    this.dispatcher = new Dispatcher();
    this.transcoder = new MessageTranscoder();

    this.emitterQueue = new WorkerQueue<EmitterQueueTask>(
      this.emitterQueueWorker
    );

    this.init();
  }

  get state() {
    return this._state;
  }

  private emitterQueueWorker = (params: EmitterQueueTask) => {
    const bytes = this.transcoder.encode(params.message);
    if (bytes) this.socket.send(bytes);
  };

  private init() {
    this.socket.binaryType = "arraybuffer";

    this._state = "connecting";

    this.socket.addEventListener("close", (ev: CloseEvent) => {
      this._state = "closed";
      this.onClose?.call(ev);
    });

    this.socket.addEventListener("error", (ev: Event) => {
      console.log("Socket error: ", ev);
    });

    this.socket.addEventListener("open", (ev: Event) => {
      this._state = "open";
      this.onOpen?.call(ev);
    });

    this.socket.addEventListener("message", (ev) => {
      const message = this.transcoder.decode(ev.data);
      if (message) this.dispatcher.dispatchMessage(message);
    });
  }

  close() {
    if (this.socket.readyState !== 1) {
      this.socket.addEventListener("open", () => {
        this.socket.close();
      });
    } else {
      this.socket.close(1000);
    }
  }

  on<
    Event extends EventName<Events>,
    EventHandler extends Handler<EventPayload<Event, Events, "server">>
  >(event: Event, handler: EventHandler): string {
    return this.dispatcher.addObserver(event, handler);
  }

  once<
    Event extends EventName<Events>,
    EventHandler extends Handler<EventPayload<Event, Events, "server">>
  >(event: Event, handler: EventHandler, timeout?: number) {
    const handlerId = this.dispatcher.addObserver(
      event,
      (message: WebSocketMessage<unknown>) => {
        handler(message);
        this.dispatcher.removeObserver(handlerId);
      }
    );

    if (timeout) {
      setTimeout(() => {
        this.dispatcher.removeObserver(handlerId);
      }, timeout);
    }
  }

  off(observerId: string): boolean {
    return this.dispatcher.removeObserver(observerId);
  }

  emit<
    Event extends EventName<Events>,
    Payload extends EventPayload<Event, Events, "client">
  >(event: Event, payload: Payload) {
    const message: WebSocketMessage<unknown> = {
      type: MessageType.Notification,
      eventName: event,
      payload,
    };

    this.emitterQueue.enqueueTask({ message });
  }

  async request<
    Event extends EventName<Events>,
    RequestPayload extends EventPayload<Event, Events, "client">,
    ResponsePayload extends EventPayload<Event, Events, "server">
  >(
    event: Event,
    payload?: RequestPayload
  ): Promise<WebSocketMessage<ResponsePayload>> {
    const requestId = nanoid();

    const requestMessage: WebSocketMessage<unknown> = {
      type: MessageType.Request,
      eventName: event,
      meta: {
        rId: requestId,
      },
      payload,
    };

    this.emitterQueue.enqueueTask({ message: requestMessage });

    let responseResolver: (value: WebSocketMessage<ResponsePayload>) => void;
    const responsePromise = new Promise<WebSocketMessage<ResponsePayload>>(
      (resolve) => (responseResolver = resolve)
    );

    const handlerId = this.on(event, (message) => {
      if (message.meta?.rId === requestId) {
        responseResolver(message as WebSocketMessage<ResponsePayload>);
        this.off(handlerId);
      }
    });

    return responsePromise;
  }
}
