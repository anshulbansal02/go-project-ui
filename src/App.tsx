import "@/styles/global.scss";

import { AppRouterProvider } from "@/app/routes";
import { SocketProvider } from "@/lib/WebSocket";

function App() {
  return (
    <SocketProvider url='ws://localhost:5000/client'>
      <AppRouterProvider />
    </SocketProvider>
  );
}

export default App;
