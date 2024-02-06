export enum MessageType {
  Notification = 0x0,
  Command = 0x1,
  Request = 0x2,
  Response = 0x3,
}

export type SocketEvent = string;

export interface WebSocketMessage<PayloadType> {
  type: MessageType;
  eventName: SocketEvent;
  meta?: Record<string, unknown> | null;
  payload: PayloadType;
}

export type Handler<PayloadType> = (
  message: WebSocketMessage<PayloadType>
) => void;
