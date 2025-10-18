import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { apiGet } from "@/api/client";
import type { Modules } from "@modular/types";
import Header from "./Header";

type UserMod = { key: string; role: "read" | "write" | "admin" };
type RouteName = "Auth" | "Dashboard" | "Health";
type Navigation = { navigate: (route: RouteName) => void };

export default function ModulePickerScreen({
  navigation,
}: {
  navigation: Navigation;
}) {
  const [mods, setMods] = useState<Modules.ModuleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const [pub, mine] = await Promise.all([
          apiGet<Modules.ModuleInfo[]>("/modules/registry/public"),
          apiGet<UserMod[]>("/users/me/modules"),
        ]);
        const allowed = new Set((mine ?? []).map((m) => m.key));
        const filtered = (pub ?? []).filter(
          (m) =>
            allowed.has(m.key) || m.key === "dashboard" || m.key === "auth",
        );
        if (on) setMods(filtered);
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

  function navigateToModule(m: Modules.ModuleInfo) {
    const key = m.key;
    if (key === "auth") return navigation.navigate("Auth");
    if (key === "dashboard") return navigation.navigate("Dashboard");
    return navigation.navigate("Health");
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />
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
              <Pressable
                key={m.key}
                style={s.item}
                onPress={() => navigateToModule(m)}
              >
                <Text style={s.itemTitle}>{m.name}</Text>
                <Text style={s.itemSub}>{m.route ?? `/${m.key}`}</Text>
              </Pressable>
            ))}
            {mods.length === 0 && <Text style={s.p}>Brak modułów</Text>}
          </View>
        )}
        {!!err && <Text style={s.err}>{err}</Text>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 16 },
  h1: { fontSize: 20, fontWeight: "600" },
  p: { marginLeft: 8 },
  row: { marginTop: 12, flexDirection: "row", alignItems: "center" },
  item: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  itemTitle: { fontWeight: "600" },
  itemSub: { opacity: 0.6 },
  err: { marginTop: 16, color: "#b91c1c" },
});
