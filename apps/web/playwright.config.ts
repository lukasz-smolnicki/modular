import "dotenv/config";
import { defineConfig } from "@playwright/test";

const API_PORT = Number(process.env.API_PORT ?? 3000);
const WEB_PORT = Number(process.env.WEB_PORT ?? 5173);
const API_URL = process.env.VITE_API_BASE_URL || `http://localhost:${API_PORT}`;
const isCI = String(process.env.CI || "").toLowerCase() === "true";

const webCommand = isCI
  ? `npx -y wait-on http-get://localhost:${API_PORT}/health && npm run build && npx -y serve -s dist -l ${WEB_PORT}`
  : `npm run dev -- --port ${WEB_PORT} --strictPort`;

export default defineConfig({
  testDir: "./test",
  testMatch: ["**/*.spec.ts"],
  timeout: 60_000,
  use: { baseURL: `http://localhost:${WEB_PORT}` },
  webServer: [
    {
      command: "npm run dev:firestore",
      port: 8080,
      reuseExistingServer: true,
      timeout: 600_000,
      cwd: "../../",
      env: process.env as Record<string, string>,
    },
    {
      command: "npm run dev:api",
      port: API_PORT,
      reuseExistingServer: true,
      timeout: 600_000,
      cwd: "../../",
      env: {
        ...process.env,
        WEB_ORIGIN: `http://localhost:${WEB_PORT}`,
        FIRESTORE_EMULATOR_HOST:
          process.env.FIRESTORE_EMULATOR_HOST ?? "127.0.0.1:8080",
        FIREBASE_AUTH_EMULATOR_HOST:
          process.env.FIREBASE_AUTH_EMULATOR_HOST ?? "127.0.0.1:9099",
        FIRESTORE_SEED_ON_START: process.env.FIRESTORE_SEED_ON_START ?? "true",
      } as Record<string, string>,
    },
    {
      command: webCommand,
      port: WEB_PORT,
      reuseExistingServer: true,
      timeout: 600_000,
      cwd: "../../apps/web",
      env: {
        ...process.env,
        CI: "1",
        VITE_API_BASE_URL: API_URL,
      } as Record<string, string>,
    },
  ],
});
