import {
  type Handler,
  SocketEvent,
  WebSocketMessage,
  MessageType,
} from "./types";
import { Dispatcher } from "./dispatcher";
import { MessageTranscoder } from "./transcoder";
import { WorkerQueue } from "@/lib/WorkerQueue";
import { nanoid } from "nanoid";

type SocketState = "connecting" | "open" | "closed";

type EmitterQueueTask = { message: WebSocketMessage<unknown> };

export class Socket {
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

  on<PayloadType>(event: SocketEvent, handler: Handler<PayloadType>): string {
    return this.dispatcher.addObserver(event, handler as Handler<unknown>);
  }

  once<PayloadType>(
    event: SocketEvent,
    handler: Handler<PayloadType>,
    timeout?: number
  ) {
    const handlerId = this.dispatcher.addObserver(
      event,
      (message: WebSocketMessage<unknown>) => {
        handler(message as WebSocketMessage<PayloadType>);
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

  emit(event: SocketEvent, payload?: unknown) {
    const message: WebSocketMessage<unknown> = {
      type: MessageType.Notification,
      eventName: event,
      payload,
    };

    this.emitterQueue.enqueueTask({ message });
  }

  async request<ResponseType>(
    event: SocketEvent,
    payload?: unknown
  ): Promise<WebSocketMessage<ResponseType>> {
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

    let responseResolver: (value: WebSocketMessage<ResponseType>) => void;
    const responsePromise = new Promise<WebSocketMessage<ResponseType>>(
      (resolve) => {
        responseResolver = resolve;
      }
    );

    const handlerId = this.on<ResponseType>(event, (message) => {
      if (message.meta?.rId === requestId) {
        responseResolver(message);
        this.off(handlerId);
      }
    });

    return responsePromise;
  }
}
