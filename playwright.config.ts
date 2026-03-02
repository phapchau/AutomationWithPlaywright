// import { defineConfig, devices } from '@playwright/test';

// /**
//  * 
//  * Cấu hình Playwright cho nhiều dự án
//  * Hỗ trợ: Chụp ảnh, quay video, Allure Report
//  */
// export default defineConfig({
//   testDir: './tests',
//   fullyParallel: true, // Chạy song song để nhanh hơn
//   forbidOnly: !!process.env.CI, // Không cho phép .only trong CI
//   retries: process.env.CI ? 2 : 1, // Retry khi fail
//   workers: process.env.CI ? 1 : undefined,
  
//   // Cấu hình Reporter
//   reporter: [
//     ['list'], // Hiển thị log ở console
//     ['html', { outputFolder: 'playwright-report' }], // HTML report của Playwright
//     ['allure-playwright', { 
//       outputFolder: 'allure-results',
//       detail: true,
//       suiteTitle: true
//     }] // Allure Report - Báo cáo chuyên nghiệp
//   ],

//   // Cấu hình chung cho tất cả test
//   use: {
//     trace: 'on-first-retry', // Lưu trace khi retry
//     screenshot: 'only-on-failure', // Tự động chụp màn hình khi lỗi
//     video: 'retain-on-failure', // Quay video khi lỗi
//     actionTimeout: 15000, // Timeout cho mỗi action (15s)
//     navigationTimeout: 30000, // Timeout cho navigation (30s)
//   },

//   // Cấu hình cho nhiều dự án khác nhau
//   projects: [
//     {
//       name: 'DKTW',
//       testDir: './tests/dktw',
//       use: { 
//         ...devices['Desktop Chrome'],
//         baseURL: 'http://dktw.cusc.vn',
//         viewport: { width: 1920, height: 1080 },
//         headless: true,
//       },
//     },

//     {
//       name: 'BaoGia',
//       testDir: './tests/baogia',
//       use: { 
//         ...devices['Desktop Chrome'],
//         baseURL: 'https://baogia.nentang.vn',
//         viewport: { width: 1920, height: 1080 },
//       },
//     },

//     {
//       name: 'CRM',
//       testDir: './tests/crm',
//       use: { 
//         ...devices['Desktop Chrome'],
//         baseURL: 'https://crm.nentang.vn',
//         viewport: { width: 1920, height: 1080 },
//       },
//     },

//     {
//       name: 'TriThuc',
//       testDir: './tests/trithuc',
//       use: { 
//         ...devices['Desktop Chrome'],
//         baseURL: 'https://trithuc.nentang.vn',
//         viewport: { width: 1920, height: 1080 },
//       },
//     },
//   ],
// });///bản lúc đầu chạy vs capcha =1





import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  globalSetup: require.resolve('./global-setup'),


  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: true,
    }],
  ],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    
  },

  projects: [
    // 🔥 DKTW – WEB THẬT CÓ CAPTCHA
    {
      name: 'DKTW',
      testDir: './tests/dktw',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://dktw.cusc.vn',
        viewport: { width: 1920, height: 1080 },
        storageState: 'auth/auth-dktw.json', // 🔥 QUAN TRỌNG NHẤT
        headless: true,
      },
    },

    // ===== CÁC PROJECT KHÁC (GIỮ NGUYÊN) =====
    {
      name: 'BaoGia',
      testDir: './tests/baogia',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://baogia.nentang.vn',
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'CRM',
      testDir: './tests/crm',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://crm.nentang.vn',
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'TriThuc',
      testDir: './tests/trithuc',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://trithuc.nentang.vn',
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});

