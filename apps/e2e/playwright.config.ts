import { defineConfig, devices } from '@playwright/test';

// Config base del template. Ajustar timeouts/proyectos por proyecto.
export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: process.env.WEB_BASE_URL || 'https://www.saucedemo.com',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
