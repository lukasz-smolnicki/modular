import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiGet } from "@/api/client";
import type { Modules } from "@modular/types";
import { useAuthUser } from "@/hooks/useAuthUser";

type UserMod = { key: string; role: "read" | "write" | "admin" };

export default function Sidebar() {
  const [pub, setPub] = useState<Modules.ModuleInfo[]>([]);
  const [mine, setMine] = useState<UserMod[]>([]);
  const [err, setErr] = useState("");
  const user = useAuthUser();
  const loc = useLocation();

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const res = await apiGet<Modules.ModuleInfo[]>(
          "/modules/registry/public",
        );
        if (on) setPub(res ?? []);
      } catch (e) {
        if (on) setErr(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      on = false;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setMine([]);
      return;
    }
    let on = true;
    (async () => {
      try {
        const m = await apiGet<UserMod[]>("/users/me/modules");
        if (on) setMine(m ?? []);
      } catch {
        if (on) setMine([]);
      }
    })();
    return () => {
      on = false;
    };
  }, [user?.uid, user]);

  const allowed = useMemo(() => new Set(mine.map((m) => m.key)), [mine]);

  const items = useMemo(() => {
    if (!user) {
      return pub.filter((m) => m.key === "auth" || m.key === "dashboard");
    }
    return pub.filter((m) => allowed.has(m.key) || m.key === "dashboard");
  }, [pub, allowed, user]);

  return (
    <aside
      style={{
        width: 240,
        borderRight: "1px solid #e5e7eb",
        padding: 12,
        height: "calc(100vh - 48px)",
        overflow: "auto",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>Moduły</div>
      <nav style={{ display: "grid", gap: 6 }}>
        {items.map((m) => {
          const to = m.route || `/${m.key}`;
          const active =
            loc.pathname === to || (to === "/" && loc.pathname === "/");
          return (
            <Link
              key={m.key}
              to={to}
              style={{
                padding: "6px 8px",
                borderRadius: 6,
                textDecoration: "none",
                background: active ? "#f3f4f6" : "transparent",
                color: "#111827",
              }}
            >
              {m.name}
            </Link>
          );
        })}
      </nav>
      {!!err && <div style={{ color: "#b91c1c", marginTop: 8 }}>{err}</div>}
    </aside>
  );
}
