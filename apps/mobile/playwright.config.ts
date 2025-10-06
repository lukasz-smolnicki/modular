import "dotenv/config";
import { defineConfig } from "@playwright/test";

const WEB_PORT = Number(process.env.EXPO_WEB_PORT ?? 8081);
const BASE_URL =
  process.env.MOBILE_WEB_E2E_URL ?? `http://localhost:${WEB_PORT}`;
const useRemote = !!process.env.MOBILE_WEB_E2E_URL;

export default defineConfig({
  testDir: "./test",
  testMatch: ["**/*.spec.ts"],
  timeout: 60000,
  use: { baseURL: BASE_URL },
  webServer: useRemote
    ? []
    : [
        {
          command: "npm run dev:firestore",
          port: 8080,
          reuseExistingServer: true,
          cwd: "../../",
          env: process.env as Record<string, string>,
        },
        {
          command: "npm run dev:api",
          port: Number(process.env.API_PORT ?? 3000),
          reuseExistingServer: true,
          cwd: "../../",
          env: {
            ...process.env,
            WEB_ORIGIN: `http://localhost:${WEB_PORT}`,
            EXPO_WEB_ORIGIN: `http://localhost:${WEB_PORT}`,
          } as Record<string, string>,
        },
        {
          command: `npx expo export --platform web --output-dir dist --clear && npx serve -s dist -l ${WEB_PORT}`,
          port: WEB_PORT,
          reuseExistingServer: true,
          cwd: "../../apps/mobile",
          env: process.env as Record<string, string>,
        },
      ],
});
