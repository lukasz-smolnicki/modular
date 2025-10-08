type RuntimeConfig = {
    API_BASE_URL: string;
    ENV_NAME?: string;
    FIREBASE_PROJECT_ID?: string;
    [key: string]: unknown;
};

const envConfig: RuntimeConfig = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '',
    ENV_NAME: import.meta.env.MODE,
    FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? undefined
};

let runtimeConfig: RuntimeConfig | null = null;

async function resolveRuntimeConfig(): Promise<RuntimeConfig> {
    if (typeof window !== 'undefined') {
        const fromWindow = (window as any).__RUNTIME_CONFIG as
            | RuntimeConfig
            | undefined;
        if (fromWindow && typeof fromWindow === 'object') {
            return { ...envConfig, ...fromWindow };
        }
    }
    try {
        const res = await fetch('/config.json', { cache: 'no-store' });
        if (res.ok) {
            const json = (await res.json()) as Partial<RuntimeConfig>;
            if (json && typeof json === 'object') {
                return { ...envConfig, ...json };
            }
        }
    } catch {}
    return { ...envConfig };
}

export const configReady: Promise<void> = (async () => {
    runtimeConfig = await resolveRuntimeConfig();
})();

export function getConfig(): RuntimeConfig {
    return runtimeConfig ?? envConfig;
}
