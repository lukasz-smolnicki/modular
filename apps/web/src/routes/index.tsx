import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AppShell from "@/layout/AppShell";
import ModulePickerPage from "@/modules/shell/ModulePickerPage";
import LoginPage from "@/modules/auth/LoginPage";

const UserPage = lazy(() => import("@/modules/user/UserPage"));

const modules = import.meta.glob("../modules/**/routes.tsx", {
  eager: true,
}) as Record<string, { default: RouteObject[] }>;

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/user" replace /> },
      { path: "/user", element: <UserPage /> },
      { path: "/modules/*", element: <ModulePickerPage /> },
      { path: "/auth", element: <LoginPage /> },
      ...Object.values(modules).flatMap((m) => m.default),
    ],
  },
  { path: "*", element: <Navigate to="/user" replace /> },
];
