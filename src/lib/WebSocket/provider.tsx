import { ReactNode, createContext, useEffect, useState } from "react";
import { Socket } from "./socket";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

interface SocketProviderProps {
  url: URL | string;
  children: ReactNode;
}

export function SocketProvider({ children, url }: SocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [socket] = useState<Socket>(() => new Socket(url));

  useEffect(() => {
    socket.onOpen = () => setIsConnected(true);
    socket.onClose = () => setIsConnected(false);

    return () => {
      socket.close();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
