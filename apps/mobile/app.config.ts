import { ExpoConfig } from "expo/config";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

const config: ExpoConfig = {
  name: "mobile",
  slug: "mobile",
  scheme: "mobile",
  extra: {
    RUNTIME_CONFIG: {
      API_BASE_URL,
      ENV_NAME: process.env.NODE_ENV || "development",
    },
  },
  web: { bundler: "metro" },
};

export default config;
