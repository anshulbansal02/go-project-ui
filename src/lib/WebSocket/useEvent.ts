import { useSocket } from "./useSocket";
import { EventPayload, Handler } from "./types";
import { useEffect } from "react";
import { SocketEvents } from "@/events";
import { EventName } from "./socket";

export function useEvent<
  Event extends EventName<SocketEvents>,
  EventHandler extends Handler<EventPayload<Event, SocketEvents, "server">>
>(event: Event, handler: EventHandler) {
  const v = useSocket();

  useEffect(() => {
    const observerId = v.socket.on(event, handler);

    return () => {
      v.socket.off(observerId);
    };
  }, [event, v.socket, handler]);
}
