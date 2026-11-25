import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.TEST_BASE_URL || 'http://localhost:3000'
const launchOptions = process.env.TEST_CHROME_PATH
  ? { executablePath: process.env.TEST_CHROME_PATH }
  : undefined
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  use: { baseURL, trace: 'retain-on-failure', launchOptions },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command: 'pnpm start',
        url: baseURL,
        timeout: 120_000,
        reuseExistingServer: !process.env.CI,
      },
})
