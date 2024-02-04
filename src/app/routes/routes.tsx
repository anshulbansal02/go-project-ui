import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const HomePage = lazy(() => import("@/app/home"));
const RoomPage = lazy(() => import("@/app/room/[code]"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/room/:code",
    element: <RoomPage />,
  },
  {
    path: "*",
    element: <Navigate to='/' replace />,
  },
];

export const browserRouter = createBrowserRouter(routes);
