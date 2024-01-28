import { RouterProvider } from "react-router-dom";
import { browserRouter } from "./routes";

export function AppRouterProvider() {
  return <RouterProvider router={browserRouter} />;
}
