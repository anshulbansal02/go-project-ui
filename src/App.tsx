import "@/styles/global.scss";

import { AppRouterProvider } from "@/app/routes";
import { SocketProvider } from "@/lib/WebSocket";
import { Bootstrap } from "./Bootstrap";

function App() {
  return (
    <SocketProvider url='ws://localhost:5000/client'>
      <Bootstrap>
        <AppRouterProvider />
      </Bootstrap>
    </SocketProvider>
  );
}

export default App;
