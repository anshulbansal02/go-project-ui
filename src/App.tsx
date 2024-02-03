import "@/styles/global.scss";

import { AppRouterProvider } from "@/app/routes";
import { SocketProvider } from "@/lib/WebSocket";
import { Bootstrap } from "./Bootstrap";
import { config } from "./config";

function App() {
  return (
    <SocketProvider url={config.SOCKET_URL}>
      <Bootstrap>
        <AppRouterProvider />
      </Bootstrap>
    </SocketProvider>
  );
}

export default App;
