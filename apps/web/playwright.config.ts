import "dotenv/config";
import { defineConfig } from "@playwright/test";

const WEB_PORT = Number(process.env.WEB_PORT ?? 5173);
const WEB_E2E_URL = process.env.WEB_E2E_URL;

export default defineConfig({
  testDir: "./test",
  testMatch: ["**/*.spec.ts"],
  timeout: 60_000,
  use: {
    baseURL: WEB_E2E_URL ? WEB_E2E_URL : `http://localhost:${WEB_PORT}`,
  },
  webServer: WEB_E2E_URL
    ? []
    : [
        {
          command: `npm run build && npx serve -s dist -l ${WEB_PORT} --no-clipboard`,
          port: WEB_PORT,
          reuseExistingServer: true,
          cwd: "../../apps/web",
          env: process.env as Record<string, string>,
        },
      ],
});
