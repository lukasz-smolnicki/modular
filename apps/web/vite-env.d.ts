/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_FIREBASE_PROJECT_ID?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

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
