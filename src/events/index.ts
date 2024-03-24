import { RoomEvents } from "./room";
import { ChatEvents } from "./chat";

export type SocketEvents = RoomEvents & ChatEvents;
