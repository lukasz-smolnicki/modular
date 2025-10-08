import type { PlaywrightTestConfig } from "@playwright/test";

const base = process.env.WEB_BASE_URL;
if (!base) {
  throw new Error("WEB_BASE_URL is not set for cloud e2e");
}

const config: PlaywrightTestConfig = {
  testDir: "./test",
  testMatch: ["**/*.spec.ts"],
  timeout: 60000,
  use: { baseURL: base },
};

export default config;
