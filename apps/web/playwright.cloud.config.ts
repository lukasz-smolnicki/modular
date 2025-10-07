import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./test",
  testMatch: ["**/*.spec.ts"],
  timeout: 60000,
  use: {
    baseURL: process.env.WEB_BASE_URL,
  },
};

export default config;
