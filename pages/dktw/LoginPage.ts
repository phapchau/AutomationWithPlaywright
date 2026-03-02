import { Page, Locator, expect } from '@playwright/test';
import { CaptchaSolver } from '../../utils/captcha-solver';

/**
 * Page Object cho trang Login của DKTW
 * URL: http://dktw.cusc.vn
 */
export class LoginPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly captchaInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Locators - Đã cập nhật dựa trên trang thực tế
    this.loginButton = page.locator('text=đăng nhập').first();
    this.usernameInput = page.locator('input[name="username"], input[type="text"]').first();
    this.passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    this.captchaInput = page.locator('input[name="captcha"], input[placeholder*="mã"]').first();
    this.submitButton = page.locator('button[type="submit"], button:has-text("Đăng nhập")').first();
    this.errorMessage = page.locator('.error, .alert-danger, [role="alert"]');
    this.successMessage = page.locator('.success, .alert-success');
    this.rememberMeCheckbox = page.locator('input[type="checkbox"][name="remember"]');
  }

  /**
   * Truy cập trang chủ
   */
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Nhấn nút "Đăng nhập" ở trang chủ
   */
  async clickLoginButton() {
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Điền thông tin đăng nhập (với hoặc không có captcha)
   */
  async fillLoginForm(username: string, password: string, captchaSolver?: CaptchaSolver) {
    await this.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    
    // Kiểm tra và xử lý captcha nếu có
    // if (captchaSolver) {
    //   const hasCaptcha = await captchaSolver.isCaptchaRequired(this.page, 'input[name="captcha"], input[placeholder*="mã"]');
    //   if (hasCaptcha) {
    //     await captchaSolver.fillCaptcha(this.page, 'input[name="captcha"], input[placeholder*="mã"]');
    //   }
    // }




  // ✅ CAPTCHA THỰC TẾ (Material UI)
  const captchaLocator = this.page.locator('input[placeholder*="Mã xác nhận"]');

  await captchaLocator.waitFor({
    state: 'visible',
    timeout: 10000,
  });

  console.log('🧩 Điền mã xác nhận captcha = 1');
  await captchaLocator.fill('1');

  console.log(
    '✅ Captcha value:',
    await captchaLocator.inputValue()
  );


  }

  /**
   * Nhấn nút Submit để đăng nhập
   */
  async submit() {
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Quy trình đăng nhập hoàn chỉnh
   */
  async login(username: string, password: string, captchaSolver?: CaptchaSolver) {
    await this.goto();
    await this.clickLoginButton();
    await this.fillLoginForm(username, password, captchaSolver);
    await this.submit();
  }

  /**
   * Đăng nhập với Remember Me
   */
  async loginWithRememberMe(username: string, password: string, captchaSolver?: CaptchaSolver) {
    await this.goto();
    await this.clickLoginButton();
    await this.fillLoginForm(username, password, captchaSolver);
    
    // Check "Remember Me"
    const isChecked = await this.rememberMeCheckbox.isChecked();
    if (!isChecked) {
      await this.rememberMeCheckbox.check();
    }
    
    await this.submit();
  }

  /**
   * Kiểm tra đăng nhập thành công
   * (Có thể cần điều chỉnh selector dựa trên trang thực tế)
   */
  async verifyLoginSuccess() {
    // Chờ redirect hoặc element xuất hiện sau khi đăng nhập thành công
    await expect(this.page).not.toHaveURL(/login/, { timeout: 10000 });
    
    // Kiểm tra không có thông báo lỗi
    await expect(this.errorMessage).not.toBeVisible();
  }

  


  /**
   * Kiểm tra đăng nhập thất bại
   */
  async verifyLoginFailed() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  /**
   * Lấy nội dung error message
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }





  /**
   * Kiểm tra field có hiển thị không
   */
  async isFieldVisible(fieldName: 'username' | 'password' | 'captcha' | 'submit'): Promise<boolean> {
    const locatorMap = {
      username: this.usernameInput,
      password: this.passwordInput,
      captcha: this.captchaInput,
      submit: this.submitButton,
    };
    
    return await locatorMap[fieldName].isVisible();
  }

  /**
   * Clear all input fields
   */
  async clearAllFields() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
    
    const hasCaptcha = await this.captchaInput.isVisible().catch(() => false);
    if (hasCaptcha) {
      await this.captchaInput.clear();
    }
  }

  /**
   * Chụp màn hình với tên tùy chỉnh
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `screenshots/dktw/${name}.png`,
      fullPage: true 
    });
  }
}
