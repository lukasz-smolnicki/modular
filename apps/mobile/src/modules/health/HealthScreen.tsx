import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { apiGet } from "../../api/client";

function errorMessage(e: unknown) {
  return e instanceof Error ? e.message : String(e);
}

export default function HealthScreen() {
  const [apiMsg, setApiMsg] = useState("");
  const [fsMsg, setFsMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const h = await apiGet<{ message?: string }>("/health/api");
        if (on) setApiMsg(h?.message ?? "OK");
      } catch (e: unknown) {
        if (on) setErr(errorMessage(e));
      }
      try {
        const f = await apiGet<{ message?: string }>("/health/firestore");
        if (on) setFsMsg(f?.message ?? "OK");
      } catch (e: unknown) {
        if (on) setErr((p) => p || errorMessage(e));
      }
    })();
    return () => {
      on = false;
    };
  }, []);

  return (
    <View style={s.wrap}>
      <Text style={s.h1}>Health</Text>
      <View style={s.card}>
        <Text style={s.h2}>API</Text>
        <Text style={s.p}>{apiMsg}</Text>
      </View>
      <View style={s.card}>
        <Text style={s.h2}>Firestore</Text>
        <Text style={s.p}>{fsMsg}</Text>
      </View>
      {!!err && <Text style={s.err}>{err}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 24 },
  h1: { fontSize: 20, fontWeight: "600" },
  h2: { fontSize: 16, fontWeight: "600" },
  p: { marginTop: 6 },
  card: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
  },
  err: { marginTop: 16, color: "#b91c1c" },
});
