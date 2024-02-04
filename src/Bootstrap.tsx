import { useEffect, useState } from "react";
import { useSocket } from "@/lib/WebSocket";
import { getUser as getStoredUser, setUser } from "@/store/user";
import * as Events from "@/events";
import { createUser } from "@/services/user";

function SplashScreen() {
  return <>Loading</>;
}

export function Bootstrap({ children }: { children: React.ReactNode }) {
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    (async () => {
      let user;
      user = getStoredUser();

      if (!user?.secret) {
        user = await createUser();
        setUser({ ...user, isAnonymous: true });
      }

      if (isConnected) {
        await socket.request(Events.AssociateClient, {
          userSecret: user.secret,
        } satisfies Events.AssociateClientData);

        setIsBootstrapped(true);
      }
    })();

    return () => {
      setIsBootstrapped(false);
    };
  }, [socket, isConnected]);

  if (!isBootstrapped) return <SplashScreen />;
  return children;
}
