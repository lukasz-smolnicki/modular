import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const isProd = import.meta.env.MODE === "production";

const cfg = isProd
  ? {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
      appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
    }
  : {
      apiKey:
        (import.meta.env.VITE_FIREBASE_API_KEY as string) || "fake-local-key",
      authDomain:
        (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || "localhost",
      projectId:
        (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || "local-project",
      appId:
        (import.meta.env.VITE_FIREBASE_APP_ID as string) || "1:demo:web:demo",
    };

const app = initializeApp(cfg);
export const auth = getAuth(app);

const emu = !isProd
  ? ((import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST as string | undefined) ??
    "127.0.0.1:9099")
  : undefined;

if (emu) {
  connectAuthEmulator(auth, `http://${emu}`, { disableWarnings: true });
}
