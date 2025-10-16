import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getConfig } from "@/runtime/config";

type FirebaseRuntime = {
  FIREBASE_API_KEY?: string;
  FIREBASE_AUTH_DOMAIN?: string;
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_APP_ID?: string;
  ENV_NAME?: string;
};

function str(v: unknown, fallback: string): string {
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

const cfg = getConfig() as Partial<FirebaseRuntime>;

const app =
  getApps()[0] ??
  initializeApp({
    apiKey: str(cfg.FIREBASE_API_KEY, "dev"),
    authDomain: str(cfg.FIREBASE_AUTH_DOMAIN, "dev"),
    projectId: str(cfg.FIREBASE_PROJECT_ID, "local-project"),
    appId: str(cfg.FIREBASE_APP_ID, "1:dev:web:dev"),
  });

const auth = getAuth(app);

if (
  typeof window !== "undefined" &&
  (cfg.ENV_NAME === "development" || location.hostname === "localhost")
) {
  try {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
  } catch (e) {
    void e;
  }
}

export { app, auth };
