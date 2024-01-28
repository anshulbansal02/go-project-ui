import { RouteObject, createBrowserRouter } from "react-router-dom";
import { HomePage } from "../home";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
];

export const browserRouter = createBrowserRouter(routes);
