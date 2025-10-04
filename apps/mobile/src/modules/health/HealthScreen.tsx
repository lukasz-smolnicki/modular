import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";

type HealthPayload = { message?: string };

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:3000";

export default function HealthScreen() {
  const [apiMsg, setApiMsg] = useState("");
  const [fsMsg, setFsMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const [a, f]: [HealthPayload, HealthPayload] = await Promise.all([
          fetch(`${API_BASE}/health/api`).then((r) => r.json()),
          fetch(`${API_BASE}/health/firestore`).then((r) => r.json()),
        ]);
        if (!on) return;
        setApiMsg(String(a?.message ?? ""));
        setFsMsg(String(f?.message ?? ""));
      } catch {
        if (!on) return;
        setErr("Błąd");
      }
    })();
    return () => {
      on = false;
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={s.h1}>Health</Text>
      <View style={s.card}>
        <Text style={s.h2}>API</Text>
        <Text style={s.msg}>{apiMsg}</Text>
      </View>
      <View style={s.card}>
        <Text style={s.h2}>Firestore</Text>
        <Text style={s.msg}>{fsMsg}</Text>
      </View>
      {!!err && <Text style={s.err}>{err}</Text>}
      <Text style={s.meta}>platform: {Platform.OS}</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 24, gap: 12 },
  h1: { fontSize: 24, fontWeight: "600" },
  h2: { fontSize: 16, fontWeight: "500" },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
  },
  msg: { marginTop: 8, fontWeight: "700" },
  err: { marginTop: 16, color: "#b91c1c" },
  meta: { marginTop: 12, color: "#6b7280" },
});
