import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { apiGet } from "@/api/client";
import type { ModuleInfo } from "@/types/modules";

export default function ModulePickerScreen() {
  const [mods, setMods] = useState<ModuleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const list = await apiGet<ModuleInfo[]>("/modules/registry/public");
        if (on) setMods(list ?? []);
      } catch (e) {
        if (on) setErr(e instanceof Error ? e.message : String(e));
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => {
      on = false;
    };
  }, []);

  return (
    <View style={s.wrap}>
      <Text style={s.h1}>Moduły</Text>
      {loading ? (
        <View style={s.row}>
          <ActivityIndicator />
          <Text style={s.p}>Ładowanie…</Text>
        </View>
      ) : (
        <View style={{ marginTop: 12 }}>
          {mods.map((m) => (
            <View key={m.key} style={s.item}>
              <Text style={s.itemTitle}>{m.name}</Text>
              <Text style={s.itemSub}>{m.route ?? `/${m.key}`}</Text>
            </View>
          ))}
          {mods.length === 0 && <Text style={s.p}>Brak modułów</Text>}
        </View>
      )}
      {!!err && <Text style={s.err}>{err}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 24 },
  h1: { fontSize: 20, fontWeight: "600" },
  p: { marginLeft: 8 },
  row: { marginTop: 12, flexDirection: "row", alignItems: "center" },
  item: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  itemTitle: { fontWeight: "600" },
  itemSub: { opacity: 0.6 },
  err: { marginTop: 16, color: "#b91c1c" },
});
