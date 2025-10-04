import 'dotenv/config';
import { defineConfig } from '@playwright/test';

const API_PORT = Number(process.env.API_PORT ?? 3000);
const WEB_PORT = Number(process.env.WEB_PORT ?? 5173);

export default defineConfig({
    testDir: './test',
    testMatch: ['**/*.spec.ts'],
    timeout: 30_000,
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
            env: process.env as Record<string, string>
        },
        {
            command: `npm run --workspace=apps/web build && npm run --workspace=apps/web preview -- --port ${WEB_PORT} --strictPort`,
            port: WEB_PORT,
            reuseExistingServer: true,
            cwd: '../../',
            env: { ...process.env, NODE_ENV: 'production' } as Record<
                string,
                string
            >
        }
    ]
});
