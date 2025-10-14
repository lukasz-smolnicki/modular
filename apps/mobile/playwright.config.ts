import "dotenv/config";
import { defineConfig } from "@playwright/test";

const API_PORT = Number(process.env.API_PORT ?? 3000);
const EXPO_WEB_PORT = Number(process.env.EXPO_WEB_PORT ?? 8081);
const API_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || `http://localhost:${API_PORT}`;

export default defineConfig({
  testDir: "./test",
  testMatch: ["**/*.spec.ts"],
  timeout: 60_000,
  use: { baseURL: `http://localhost:${EXPO_WEB_PORT}` },
  webServer: [
    {
      command: "npm run dev:firestore",
      port: 8080,
      reuseExistingServer: true,
      cwd: "../../",
      env: process.env as Record<string, string>,
    },
    {
      command: "npm run dev:api",
      port: API_PORT,
      reuseExistingServer: true,
      cwd: "../../",
      env: {
        ...process.env,
        WEB_ORIGIN: `http://localhost:${EXPO_WEB_PORT}`,
        FIRESTORE_EMULATOR_HOST:
          process.env.FIRESTORE_EMULATOR_HOST ?? "127.0.0.1:8080",
        FIRESTORE_SEED_ON_START: process.env.FIRESTORE_SEED_ON_START ?? "true",
      } as Record<string, string>,
    },
    {
      command: `npx expo start --web --port ${EXPO_WEB_PORT} --non-interactive`,
      port: EXPO_WEB_PORT,
      reuseExistingServer: true,
      cwd: "../../apps/mobile",
      env: {
        ...process.env,
        EXPO_PUBLIC_API_BASE_URL: API_URL,
      } as Record<string, string>,
    },
  ],
});
