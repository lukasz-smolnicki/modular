/// <reference types="vite/client" />

declare global {
  interface Window {
    __RUNTIME_CONFIG?: {
      API_BASE_URL?: string;
      ENV_NAME?: string;
      FIREBASE_PROJECT_ID?: string;
      [key: string]: unknown;
    };
  }
}
export {};
