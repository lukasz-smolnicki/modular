import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { fetchPublicModules, fetchVisibleModules } from "@/data/userModules";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import type { Modules } from "@modular/types";

export default function AppShell() {
  const [mods, setMods] = useState<Modules.ModuleInfo[]>([]);
  const { user } = useAuthStatus();
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (loc.pathname === "/") {
      nav("/user", { replace: true });
    }
  }, [loc.pathname, nav]);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const list = user
          ? await fetchVisibleModules(user.uid)
          : await fetchPublicModules();
        if (on) setMods(list ?? []);
      } catch {
        if (on) setMods([]);
      }
    })();
    return () => {
      on = false;
    };
  }, [user]);

  const sorted = useMemo(() => {
    return [...mods].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [mods]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        height: "100vh",
      }}
    >
      <header
        style={{
          gridColumn: "1 / -1",
          height: 48,
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          fontFamily: "ui-sans-serif, system-ui",
        }}
      >
        <strong>PowerApp</strong>
        <span style={{ opacity: 0.6 }}>Użytkownik</span>
      </header>

      <aside style={{ borderRight: "1px solid #e5e7eb", padding: 12 }}>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
          Moduły
        </div>
        <nav style={{ display: "grid", gap: 6 }}>
          {sorted.map((m) => (
            <Link
              key={m.key}
              to={m.route ?? `/${m.key}`}
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                textDecoration: "none",
                color: "#111827",
                background:
                  loc.pathname === (m.route ?? `/${m.key}`)
                    ? "#f3f4f6"
                    : "transparent",
              }}
            >
              <span style={{ marginRight: 6 }}>{m.icon ?? "•"}</span>
              {m.name}
            </Link>
          ))}
          {sorted.length === 0 && (
            <div style={{ opacity: 0.6 }}>Brak modułów</div>
          )}
        </nav>
      </aside>

      <main style={{ padding: 24, overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
