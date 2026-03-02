// global-setup.ts
import { chromium } from '@playwright/test';

export default async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://dktw.cusc.vn');

  console.log(' Login thủ công + nhập CAPTCHA');
  //password 123456@Aa

  // chờ bạn login xong
  await page.waitForURL(/\/benhvien/, { timeout: 0 });

  // lưu session
  await context.storageState({ path: 'auth/auth-dktw.json' });

  await browser.close();
};
