import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase";

function errorMessage(e: unknown): string {
  if (typeof e === "string") return e;
  if (e && typeof e === "object" && "message" in e) {
    const m = (e as { message?: unknown }).message;
    return typeof m === "string" ? m : JSON.stringify(m);
  }
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErr] = useState<string>("");

  async function onLogin() {
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: unknown) {
      setErr(errorMessage(e));
    }
  }

  async function onRegister() {
    setErr("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e: unknown) {
      setErr(errorMessage(e));
    }
  }

  return (
    <View style={s.wrap}>
      <Text style={s.h1}>Logowanie</Text>
      <View style={{ marginTop: 16, gap: 12 }}>
        <View>
          <Text style={s.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={(v: string) => setEmail(v)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={s.input}
          />
        </View>
        <View>
          <Text style={s.label}>Hasło</Text>
          <TextInput
            value={password}
            onChangeText={(v: string) => setPassword(v)}
            secureTextEntry
            style={s.input}
          />
        </View>
        <Pressable onPress={onLogin} style={s.btn}>
          <Text style={s.btnText}>Zaloguj</Text>
        </Pressable>
        <Pressable onPress={onRegister} style={s.btn}>
          <Text style={s.btnText}>Zarejestruj</Text>
        </Pressable>
        {!!err && <Text style={s.err}>{err}</Text>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 24 },
  h1: { fontSize: 20, fontWeight: "600" },
  label: { fontSize: 12, opacity: 0.7, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 10,
  },
  btn: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: { fontWeight: "600" },
  err: { marginTop: 12, color: "#b91c1c" },
});
