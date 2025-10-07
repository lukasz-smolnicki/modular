import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './test',
    testMatch: ['**/*.spec.ts'],
    timeout: 60000,
    use: {
        baseURL: process.env.WEB_BASE_URL
    }
});
