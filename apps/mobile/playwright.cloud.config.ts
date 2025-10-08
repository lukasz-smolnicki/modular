export default {
  testDir: "./test",
  testMatch: ["**/*.spec.ts"],
  timeout: 60000,
  use: { baseURL: process.env.WEB_BASE_URL },
};
