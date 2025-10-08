import 'dotenv/config';
import { defineConfig } from '@playwright/test';

const API_PORT = Number(process.env.API_PORT ?? 3000);
const WEB_PORT = Number(process.env.WEB_PORT ?? 5173);
const API_URL = process.env.VITE_API_BASE_URL || `http://localhost:${API_PORT}`;

export default defineConfig({
    testDir: './test',
    testMatch: ['**/*.spec.ts'],
    timeout: 60_000,
    use: { baseURL: `http://localhost:${WEB_PORT}` },
    webServer: [
        {
            command: 'npm run dev:firestore',
            port: 8080,
            reuseExistingServer: true,
            cwd: '../../',
            env: process.env as Record<string, string>
        },
        {
            command: 'npm run dev:api',
            port: API_PORT,
            reuseExistingServer: true,
            cwd: '../../',
            env: {
                ...process.env,
                WEB_ORIGIN: `http://localhost:${WEB_PORT}`,
                FIREBASE_EMULATORS_HOST: '127.0.0.1:8080'
            } as Record<string, string>
        },
        {
            command: `npm run dev -- --port ${WEB_PORT} --strictPort`,
            port: WEB_PORT,
            reuseExistingServer: true,
            cwd: '../../apps/web',
            env: {
                ...process.env,
                VITE_API_BASE_URL: API_URL
            } as Record<string, string>
        }
    ]
});
