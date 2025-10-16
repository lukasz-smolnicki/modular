import { useState } from "react";
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

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErr] = useState<string>("");

  async function onLogin(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
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
    <div
      style={{
        padding: 24,
        maxWidth: 420,
        margin: "0 auto",
        fontFamily: "ui-sans-serif, system-ui",
      }}
    >
      <h1 style={{ margin: 0, fontSize: 20 }}>Logowanie</h1>
      <form onSubmit={onLogin} style={{ marginTop: 16 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Email</div>
            <input
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              type="email"
              autoComplete="email"
              style={{
                width: "100%",
                padding: 8,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
              }}
            />
          </label>
          <label>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Hasło</div>
            <input
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              type="password"
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: 8,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
              }}
            />
          </label>
          <button
            type="submit"
            style={{
              padding: "8px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
            }}
          >
            Zaloguj
          </button>
          <button
            type="button"
            onClick={onRegister}
            style={{
              padding: "8px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
            }}
          >
            Zarejestruj
          </button>
        </div>
      </form>
      {!!err && <pre style={{ marginTop: 12, color: "#b91c1c" }}>{err}</pre>}
    </div>
  );
}
