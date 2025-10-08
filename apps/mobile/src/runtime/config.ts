import Constants from "expo-constants";

type RuntimeConfig = {
  API_BASE_URL: string;
  ENV_NAME?: string;
  FIREBASE_PROJECT_ID?: string;
  [key: string]: unknown;
};

const envConfig: RuntimeConfig = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "",
  ENV_NAME: process.env.NODE_ENV,
};

let runtimeConfig: RuntimeConfig | null = null;

function readWindowConfig(): Partial<RuntimeConfig> | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { __RUNTIME_CONFIG?: unknown };
  const rc = w.__RUNTIME_CONFIG;
  if (rc && typeof rc === "object") return rc as Partial<RuntimeConfig>;
  return undefined;
}

function readExpoExtra(): Partial<RuntimeConfig> | undefined {
  const ex = Constants?.expoConfig as unknown as
    | { extra?: { RUNTIME_CONFIG?: unknown } }
    | undefined;
  const rc = ex?.extra?.RUNTIME_CONFIG;
  if (rc && typeof rc === "object") return rc as Partial<RuntimeConfig>;
  return undefined;
}

async function resolveRuntimeConfig(): Promise<RuntimeConfig> {
  const fromWindow = readWindowConfig();
  if (fromWindow) return { ...envConfig, ...fromWindow };

  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/config.json", { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as unknown;
        if (json && typeof json === "object") {
          return {
            ...envConfig,
            ...(json as Partial<RuntimeConfig>),
          };
        }
      }
    } catch {
      return { ...envConfig };
    }
  }

  const fromExtra = readExpoExtra();
  if (fromExtra) return { ...envConfig, ...fromExtra };

  return { ...envConfig };
}

export const configReady: Promise<void> = (async () => {
  runtimeConfig = await resolveRuntimeConfig();
})();

export function getConfig(): RuntimeConfig {
  return runtimeConfig ?? envConfig;
}
