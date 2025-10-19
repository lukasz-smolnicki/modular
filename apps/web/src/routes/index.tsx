import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AppShell from "@/layout/AppShell";
import UserPage from "@/modules/user/UserPage";
import healthRoutes from "@/modules/health/routes";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/user" replace /> },
      { path: "user", element: <UserPage /> },
      ...healthRoutes,
      { path: "*", element: <div /> }
    ]
  }
];
