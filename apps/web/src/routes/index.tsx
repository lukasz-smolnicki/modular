import type { RouteObject } from "react-router-dom";
import ModulePickerPage from "@/modules/shell/ModulePickerPage";
import LoginPage from "@/modules/auth/LoginPage";
import aboutRoutes from "@/modules/about/routes";
import healthRoutes from "@/modules/health/routes";
import AppShell from "@/layout/AppShell";

function RedirectUser() {
  return null;
}

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      { path: "", element: <RedirectUser /> },
      { path: "/modules/*", element: <ModulePickerPage /> },
      { path: "/user", element: <LoginPage /> },
      ...aboutRoutes,
      ...healthRoutes,
    ],
  },
];
