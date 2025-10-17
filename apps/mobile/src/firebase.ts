import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const isProd = process.env.NODE_ENV === "production";

const cfg = isProd
  ? {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY as string,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID as string,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID as string,
    }
  : {
      apiKey:
        (process.env.EXPO_PUBLIC_FIREBASE_API_KEY as string) ||
        "fake-local-key",
      authDomain:
        (process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN as string) || "localhost",
      projectId:
        (process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID as string) ||
        "local-project",
      appId:
        (process.env.EXPO_PUBLIC_FIREBASE_APP_ID as string) ||
        "1:demo:web:demo",
    };

const app = getApps()[0] ?? initializeApp(cfg);
export const auth = getAuth(app);

const emu = !isProd
  ? ((process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST as
      | string
      | undefined) ?? "127.0.0.1:9099")
  : undefined;

if (emu) {
  connectAuthEmulator(auth, `http://${emu}`, { disableWarnings: true });
}
