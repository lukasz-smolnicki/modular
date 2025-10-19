import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { apiGet } from "@/api/client";
import type { Modules } from "@modular/types";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { fetchUserSettings } from "@/data/userModules";

function resolveRoute(m: Modules.ModuleInfo)
{
  const key = (m.key || "").toLowerCase();
  const route = m.route || `/${key}`;
  if (key === "users" || route === "/users") return "/user";
  return route;
}

function sortModules(a: Modules.ModuleInfo, b: Modules.ModuleInfo)
{
  const ao = a.order ?? 999;
  const bo = b.order ?? 999;
  if (ao !== bo) return ao - bo;
  return (a.name || "").localeCompare(b.name || "");
}

export default function AppShell()
{
  const [mods, setMods] = useState<Modules.ModuleInfo[]>([]);
  const [err, setErr] = useState("");
  const loc = useLocation();
  const { user } = useAuthStatus();
  const [enabled, setEnabled] = useState<string[] | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() =>
  {
    let on = true;
    (async () =>
    {
      try
      {
        const list = (await apiGet<Modules.ModuleInfo[]>("/modules/registry/public")) ?? [];
        if (on) setMods(list.sort(sortModules));
      } catch (e)
      {
        if (on) setErr(e instanceof Error ? e.message : String(e));
      }
    })();
    return () =>
    {
      on = false;
    };
  }, []);

  useEffect(() =>
  {
    let on = true;
    (async () =>
    {
      if (!user)
      {
        if (on)
        {
          setEnabled(null);
          setIsAdmin(false);
        }
        return;
      }
      try
      {
        const s = await fetchUserSettings(user.uid);
        if (on)
        {
          setEnabled(s.enabled);
          setIsAdmin(s.isAdmin);
        }
      } catch
      {
        if (on)
        {
          setEnabled([]);
          setIsAdmin(false);
        }
      }
    })();
    return () =>
    {
      on = false;
    };
  }, [user?.uid]);

  const visibleMods = useMemo(() =>
  {
    if (!user) return mods;
    if (isAdmin) return mods;
    const set = new Set<string>(["users", ...(enabled ?? [])]);
    return mods.filter((m) => set.has(m.key));
  }, [mods, user, enabled, isAdmin]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "ui-sans-serif, system-ui"
      }}
    >
      <div
        style={{
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 10
        }}
      >
        <Link to="/user" style={{ textDecoration: "none", color: "inherit", fontWeight: 700 }}>
          PowerApp
        </Link>
        <div style={{ opacity: 0.6 }}>{user ? "Zalogowany" : "Użytkownik"}</div>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <aside style={{ width: 240, borderRight: "1px solid #e5e7eb", padding: 12 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>Moduły</div>
          <nav style={{ display: "grid", gap: 4 }}>
            {visibleMods.map((m) => (
              <NavLink
                key={m.key}
                to={resolveRoute(m)}
                style={({ isActive }) => ({
                  padding: "6px 8px",
                  borderRadius: 6,
                  textDecoration: "none",
                  color: isActive ? "#111827" : "#374151",
                  background: isActive ? "#f3f4f6" : "transparent",
                  display: "flex",
                  gap: 8,
                  alignItems: "center"
                })}
              >
                <span aria-hidden="true">{m.icon ?? "•"}</span>
                <span>{m.name}</span>
              </NavLink>
            ))}
            {visibleMods.length === 0 && <div style={{ opacity: 0.6 }}>Brak modułów</div>}
            {!!err && <div style={{ color: "#b91c1c", fontSize: 12 }}>{err}</div>}
          </nav>
        </aside>

        <main style={{ flex: 1, padding: 16, overflow: "auto" }}>
          <Outlet />
        </main>
      </div>

      <div style={{ height: 0, visibility: "hidden" }}>{loc.pathname}</div>
    </div>
  );
}
