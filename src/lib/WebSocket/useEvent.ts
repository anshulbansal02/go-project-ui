import { useSocket } from "./useSocket";
import { Handler, SocketEvent } from "./types";
import { useEffect } from "react";

export function useEvent<PayloadType>(
  event: SocketEvent,
  handler: Handler<PayloadType>
) {
  const v = useSocket();

  useEffect(() => {
    const observerId = v.socket.on(event, handler);

    return () => {
      v.socket.off(observerId);
    };
  }, [event, v.socket, handler]);
}
