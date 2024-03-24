export enum MessageType {
  Notification = 0x0,
  Command = 0x1,
  Request = 0x2,
  Response = 0x3,
}

export type EventName = string;

export interface WebSocketMessage<PayloadType> {
  type: MessageType;
  eventName: EventName;
  meta?: Record<string, unknown> | null;
  payload: PayloadType;
}

export type Handler<PayloadType> = (
  message: WebSocketMessage<PayloadType>
) => void;

export type EventsRegistry = Record<
  EventName,
  { clientPayload: unknown; serverPayload: unknown }
>;

export type EmitterQueueTask = { message: WebSocketMessage<unknown> };

export type EventPayload<
  T extends EventName,
  K extends EventsRegistry,
  P extends "client" | "server"
> = K[T][P extends "client" ? "clientPayload" : "serverPayload"];
