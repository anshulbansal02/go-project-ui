import { useContext } from "react";
import { SocketContext } from "./provider";
import { Socket } from "./socket";
import { SocketEvents } from "@/events";

interface SocketValue {
  socket: Socket<SocketEvents>;
  isConnected: false;
}

export function useSocket() {
  const value = useContext(SocketContext);

  if (!value.socket) throw new Error("Socket is not provided as value.");

  return value as SocketValue;
}
