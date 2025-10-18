import type { RouteObject } from "react-router-dom";
import ModulePickerPage from "@/modules/shell/ModulePickerPage";
import LoginPage from "@/modules/auth/LoginPage";
import DashboardPage from "@/modules/shell/DashboardPage";
import AppShell from "@/layout/AppShell";

const modules = import.meta.glob("../modules/**/routes.tsx", {
  eager: true,
}) as Record<string, { default: RouteObject[] }>;

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <AppShell>
        <DashboardPage />
      </AppShell>
    ),
  },
  {
    path: "/modules/*",
    element: (
      <AppShell>
        <ModulePickerPage />
      </AppShell>
    ),
  },
  {
    path: "/auth",
    element: (
      <AppShell>
        <LoginPage />
      </AppShell>
    ),
  },
  ...Object.values(modules)
    .flatMap((m) => m.default)
    .map((r) => ({
      ...r,
      element: <AppShell>{r.element}</AppShell>,
    })),
];
