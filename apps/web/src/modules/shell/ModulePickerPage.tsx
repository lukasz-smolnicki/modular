import { useEffect, useState } from "react";
import { apiGet } from "@/api/client";
import type { ModuleInfo } from "@/types/modules";

export default function ModulePickerPage() {
  const [mods, setMods] = useState<ModuleInfo[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const list = await apiGet<ModuleInfo[]>("/modules/registry/public");
        if (on) setMods(list ?? []);
      } catch (e) {
        if (on) setErr(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      on = false;
    };
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ margin: 0, fontSize: 20 }}>Moduły</h1>
      <ul style={{ marginTop: 12 }}>
        {mods.map((m) => (
          <li key={m.key}>
            <strong>{m.name}</strong>{" "}
            <span style={{ opacity: 0.6 }}>{m.route ?? `/${m.key}`}</span>
          </li>
        ))}
      </ul>
      {!!err && <pre style={{ color: "#b91c1c" }}>{err}</pre>}
    </div>
  );
}
