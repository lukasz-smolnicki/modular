import "dotenv/config";
import { defineConfig } from "@playwright/test";

const EXPO_WEB_PORT = Number(process.env.EXPO_WEB_PORT ?? 8081);
const MOBILE_WEB_E2E_URL = process.env.MOBILE_WEB_E2E_URL;

export default defineConfig({
  testDir: "./test",
  testMatch: ["**/*.spec.ts"],
  timeout: 60_000,
  use: {
    baseURL: MOBILE_WEB_E2E_URL
      ? MOBILE_WEB_E2E_URL
      : `http://localhost:${EXPO_WEB_PORT}`,
  },
  webServer: MOBILE_WEB_E2E_URL
    ? []
    : [
        {
          command: `npx expo export --platform web && npx serve -s dist -l ${EXPO_WEB_PORT}`,
          port: EXPO_WEB_PORT,
          reuseExistingServer: true,
          cwd: "../../apps/mobile",
          env: process.env as Record<string, string>,
        },
      ],
});
