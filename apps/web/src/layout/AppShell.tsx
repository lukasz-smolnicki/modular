import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { fetchUserSettings } from "@/data/userModules";

type Mod = { key: string; name: string; route?: string };

export default function AppShell() {
  const [mods, setMods] = useState<Mod[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState("");
  const loc = useLocation();

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const s = await fetchUserSettings();
        if (on) setMods(s.modules);
      } catch (e) {
        if (on) setErr(e instanceof Error ? e.message : String(e));
      } finally {
        if (on) setLoaded(true);
      }
    })();
    return () => {
      on = false;
    };
  }, []);

  return (
    <div
      style={{ display: "grid", gridTemplateRows: "48px 1fr", height: "100vh" }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Link
          to="/"
          style={{ textDecoration: "none", color: "inherit", fontWeight: 700 }}
        >
          PowerApp
        </Link>
        <div style={{ opacity: 0.7 }}>User</div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          minHeight: 0,
        }}
      >
        <aside
          style={{
            borderRight: "1px solid #e5e7eb",
            padding: "12px",
            overflow: "auto",
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
            Moduły
          </div>
          <nav style={{ display: "grid", gap: 4 }}>
            {mods.map((m) => (
              <NavLink
                key={m.key}
                to={m.route ?? `/${m.key}`}
                style={({ isActive }) => ({
                  padding: "6px 8px",
                  borderRadius: 6,
                  textDecoration: "none",
                  color: "inherit",
                  background: isActive ? "#f3f4f6" : "transparent",
                })}
              >
                • {m.name}
              </NavLink>
            ))}
          </nav>
          {!!err && (
            <div style={{ marginTop: 12, color: "#b91c1c" }}>{err}</div>
          )}
        </aside>

        <main style={{ padding: 16, overflow: "auto" }}>
          {!loaded ? <div>Ładowanie…</div> : <Outlet key={loc.key} />}
        </main>
      </div>
    </div>
  );
}
