import type { RouteObject } from "react-router-dom";
import ModulePickerPage from "@/modules/shell/ModulePickerPage";
import LoginPage from "@/modules/auth/LoginPage";

const modules = import.meta.glob("../modules/**/routes.tsx", {
  eager: true,
}) as Record<string, { default: RouteObject[] }>;

export const routes: RouteObject[] = [
  {
    path: "/modules/*",
    element: <ModulePickerPage />,
  },
  {
    path: "/auth",
    element: <LoginPage />,
  },
  ...Object.values(modules).flatMap((m) => m.default),
];
