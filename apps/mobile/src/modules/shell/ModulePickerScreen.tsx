import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import type { Modules } from "@modular/types";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { fetchPublicModules, fetchVisibleModules } from "@/data/userModules";
import { useNavigation } from "@react-navigation/native";

export default function ModulePickerScreen() {
  const [mods, setMods] = useState<Modules.ModuleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const { user } = useAuthStatus();
  const nav = useNavigation();

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const list = user
          ? await fetchVisibleModules(user.uid)
          : await fetchPublicModules();
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
  }, [user]);

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
            <Pressable
              key={m.key}
              style={s.item}
              onPress={() => nav.navigate("Modules" as never)}
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
