import "@/styles/global.scss";

import { AppRouterProvider } from "@/app/routes";
import { SocketProvider } from "@/lib/WebSocket";
import { config } from "@/config";
import { Toaster } from "@/components";
import { Bootstrap } from "./Bootstrap";

function App() {
  return (
    <SocketProvider url={config.SOCKET_URL}>
      <Bootstrap>
        <AppRouterProvider />
      </Bootstrap>
      <Toaster />
    </SocketProvider>
  );
}

export default App;
