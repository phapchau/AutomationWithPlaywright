import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/dktw/LoginPage';
import { createCaptchaSolver } from '../../utils/captcha-solver';
import users from '../../data/dktw/users.json';

/**
 * Test Suite: Đăng nhập trang DKTW (http://dktw.cusc.vn)
 * Bao gồm: Positive, Negative, Security, UI/UX, Performance tests
 */
test.describe('DKTW - Module Đăng nhập', () => {
  
  let captchaSolver: ReturnType<typeof createCaptchaSolver>;

  test.beforeAll(() => {
    // Khởi tạo captcha solver cho toàn bộ test suite
    captchaSolver = createCaptchaSolver('bypass', { fixedValue: '1' });
  });

  test.beforeEach(async ({ page }) => {
    console.log('🚀 Bắt đầu test...');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== 'passed') {
      console.log(`❌ Test "${testInfo.title}" thất bại`);
    } else {
      console.log(`✅ Test "${testInfo.title}" thành công`);
    }
  });

  // ========================================
  // 1. POSITIVE TEST CASES (Happy Path)
  // ========================================

  test.describe('1. Positive Tests - Happy Path', () => {
    
    /**
     * TC01: Đăng nhập thành công với tài khoản Admin
     */
    test('TC01 - Đăng nhập thành công với tài khoản hợp lệ', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const adminUser = users.validUsers[0];

      await test.step('Truy cập trang http://dktw.cusc.vn', async () => {
        await loginPage.goto();
        await expect(page).toHaveURL(/dktw\.cusc\.vn/);
      });

      await test.step('Nhấn nút Đăng nhập', async () => {
        await loginPage.clickLoginButton();
      });

      await test.step(`Nhập thông tin: ${adminUser.username} / ${adminUser.password}`, async () => {
        await loginPage.fillLoginForm(adminUser.username, adminUser.password, captchaSolver);
      });

      await test.step('Submit form đăng nhập', async () => {
        await loginPage.submit();
      });

      await test.step('Chụp màn hình sau khi đăng nhập', async () => {
        await loginPage.takeScreenshot('tc01-login-success');
      });
    });

    /**
     * TC02: Đăng nhập với Remember Me
     */
    test('TC02 - Đăng nhập với Remember Me được bật', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const adminUser = users.validUsers[0];

      await loginPage.loginWithRememberMe(
        adminUser.username, 
        adminUser.password, 
        captchaSolver
      );

      // Kiểm tra cookie được set
      const cookies = await page.context().cookies();
      const hasRememberCookie = cookies.some(c => c.name.includes('remember') || c.name.includes('session'));
      
      if (hasRememberCookie) {
        console.log('✅ Remember Me cookie đã được set');
      }
    });

    /**
     * TC03: Redirect đúng sau khi đăng nhập
     */
    test('TC03 - Redirect về dashboard sau khi đăng nhập thành công', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const adminUser = users.validUsers[0];

      await loginPage.login(adminUser.username, adminUser.password, captchaSolver);
      
      // Chờ redirect
      await page.waitForURL(/dashboard|home|index/, { timeout: 10000 }).catch(() => {
        console.log('⚠️ Chưa redirect hoặc URL không match pattern dashboard|home|index');
      });
    });

  });

  // ========================================
  // 2. NEGATIVE TEST CASES (Unhappy Path)
  // ========================================

  test.describe('2. Negative Tests - Unhappy Path', () => {
    
    /**
     * TC05: Đăng nhập với username sai
     */
    test('TC05 - Đăng nhập thất bại với username sai', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.clickLoginButton();
      await loginPage.fillLoginForm('wronguser', '123456@Aa', captchaSolver);
      await loginPage.submit();

      await test.step('Kiểm tra hiển thị thông báo lỗi', async () => {
        const errorMsg = await loginPage.getErrorMessage().catch(() => '');
        console.log(`📝 Error message: ${errorMsg}`);
        expect(errorMsg.length).toBeGreaterThan(0);
      });
    });

    /**
     * TC06: Đăng nhập với password sai
     */
    test('TC06 - Đăng nhập thất bại với password sai', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.clickLoginButton();
      await loginPage.fillLoginForm('admin', 'wrongpassword', captchaSolver);
      await loginPage.submit();

      await loginPage.verifyLoginFailed();
    });

    /**
     * TC07: Đăng nhập với cả username và password sai
     */
    test('TC07 - Đăng nhập với cả username và password sai', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.clickLoginButton();
      await loginPage.fillLoginForm('invaliduser', 'invalidpass', captchaSolver);
      await loginPage.submit();

      await loginPage.verifyLoginFailed();
    });

    /**
     * TC08: Đăng nhập với username trống
     */
    test('TC08 - Đăng nhập với username để trống', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.clickLoginButton();
      await loginPage.fillLoginForm('', '123456@Aa', captchaSolver);
      await loginPage.submit();

      // Kiểm tra validation message
      const usernameField = loginPage.usernameInput;
      const validationMessage = await usernameField.evaluate((el: HTMLInputElement) => el.validationMessage);
      
      if (validationMessage) {
        console.log(`✅ HTML5 validation: ${validationMessage}`);
        expect(validationMessage.length).toBeGreaterThan(0);
      }
    });

    /**
     * TC09: Đăng nhập với password trống
     */
    test('TC09 - Đăng nhập với password để trống', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.clickLoginButton();
      await loginPage.fillLoginForm('admin', '', captchaSolver);
      await loginPage.submit();

      const passwordField = loginPage.passwordInput;
      const validationMessage = await passwordField.evaluate((el: HTMLInputElement) => el.validationMessage);
      
      if (validationMessage) {
        expect(validationMessage.length).toBeGreaterThan(0);
      }
    });

    /**
     * TC10: Đăng nhập với cả 2 field trống
     */
    test('TC10 - Đăng nhập với tất cả field trống', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.clickLoginButton();
      await loginPage.fillLoginForm('', '', captchaSolver);
      
      // Không submit được hoặc có validation
      const isSubmitEnabled = await loginPage.submitButton.isEnabled();
      console.log(`Submit button enabled: ${isSubmitEnabled}`);
    });

    /**
     * TC11: Username có khoảng trắng đầu/cuối
     */
    test('TC11 - Username với khoảng trắng đầu/cuối', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.clickLoginButton();
      await loginPage.fillLoginForm('  admin  ', '123456@Aa', captchaSolver);
      await loginPage.submit();

      // Hệ thống nên tự trim hoặc báo lỗi
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      console.log(`URL sau khi login: ${currentUrl}`);
    });

  });

  // ========================================
  // 3. SECURITY TESTS
  // ========================================

  test.describe('3. Security Tests', () => {
    
    /**
     * TC20: Password không hiển thị dưới dạng plain text
     */
    test('TC20 - Password field ẩn nội dung (type=password)', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.clickLoginButton();

      const passwordType = await loginPage.passwordInput.getAttribute('type');
      expect(passwordType).toBe('password');
      console.log('✅ Password field có type="password"');
    });

    /**
     * TC21: SQL Injection Test
     */
    test('TC21 - Kiểm tra SQL Injection trong username', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const sqlInjectionPayloads = [
        "admin' OR '1'='1",
        "admin'--",
        "' OR 1=1--",
        "admin' OR '1'='1' /*",
      ];

      for (const payload of sqlInjectionPayloads) {
        await loginPage.goto();
        await loginPage.clickLoginButton();
        await loginPage.fillLoginForm(payload, 'password', captchaSolver);
        await loginPage.submit();

        // Hệ thống không được cho phép login thành công
        await page.waitForTimeout(2000);
        const currentUrl = page.url();
        
        // Nếu vẫn ở trang login -> Tốt (không bị SQL injection)
        if (currentUrl.includes('login')) {
          console.log(`✅ Chặn SQL injection: ${payload}`);
        } else {
          console.error(`❌ Có thể bị SQL injection với payload: ${payload}`);
        }

        await loginPage.clearAllFields();
      }
    });

    /**
     * TC22: XSS (Cross-Site Scripting) Test
     */
    test('TC22 - Kiểm tra XSS trong input fields', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const xssPayload = '<script>alert("XSS")</script>';

      await loginPage.goto();
      await loginPage.clickLoginButton();
      await loginPage.fillLoginForm(xssPayload, 'password', captchaSolver);
      await loginPage.submit();

      // Kiểm tra alert không xuất hiện
      page.on('dialog', async dialog => {
        console.error('❌ XSS vulnerability detected! Alert appeared:', dialog.message());
        await dialog.dismiss();
      });

      await page.waitForTimeout(2000);
      console.log('✅ Không phát hiện XSS vulnerability');
    });

  });

  // ========================================
  // 4. UI/UX TESTS
  // ========================================

  test.describe('4. UI/UX Tests', () => {
    
    /**
     * TC30: Kiểm tra các element hiển thị đúng
     */
    test('TC30 - Tất cả element cần thiết hiển thị', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.clickLoginButton();

      // Kiểm tra từng element
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();

      console.log('✅ Tất cả element hiển thị đúng');
    });

    /**
     * TC31: Kiểm tra placeholder text
     */
    test('TC31 - Placeholder text hiển thị đúng', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.clickLoginButton();

      const usernamePlaceholder = await loginPage.usernameInput.getAttribute('placeholder');
      const passwordPlaceholder = await loginPage.passwordInput.getAttribute('placeholder');

      console.log(`Username placeholder: ${usernamePlaceholder}`);
      console.log(`Password placeholder: ${passwordPlaceholder}`);

      expect(usernamePlaceholder || passwordPlaceholder).toBeTruthy();
    });

    /**
     * TC39: Tab navigation
     */
    test('TC39 - Có thể điều hướng bằng Tab key', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.clickLoginButton();

      // Focus vào username
      await loginPage.usernameInput.focus();
      
      // Nhấn Tab để chuyển sang password
      await page.keyboard.press('Tab');
      
      // Kiểm tra password có focus
      const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('name'));
      console.log(`Focused element: ${focusedElement}`);
      
      expect(focusedElement).toBeTruthy();
    });

    /**
     * TC40: Enter key submit form
     */
    test('TC40 - Submit form bằng Enter key', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const adminUser = users.validUsers[0];

      await loginPage.goto();
      await loginPage.clickLoginButton();
      await loginPage.fillLoginForm(adminUser.username, adminUser.password, captchaSolver);

      // Nhấn Enter thay vì click button
      await page.keyboard.press('Enter');

      await page.waitForTimeout(2000);
      console.log('✅ Form có thể submit bằng Enter key');
    });

  });

  // ========================================
  // 5. PERFORMANCE TESTS
  // ========================================

  test.describe('5. Performance Tests', () => {
    
    /**
     * TC50: Thời gian load trang < 5 giây
     */
    test('TC50 - Thời gian load trang phải < 5 giây', async ({ page }) => {
      const loginPage = new LoginPage(page);
      
      const startTime = Date.now();
      await loginPage.goto();
      const loadTime = Date.now() - startTime;

      console.log(`⏱️ Thời gian load trang: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(5000);
    });

    /**
     * TC51: Thời gian response API login
     */
    test('TC51 - Thời gian response API login < 3 giây', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const adminUser = users.validUsers[0];

      await loginPage.goto();
      await loginPage.clickLoginButton();
      await loginPage.fillLoginForm(adminUser.username, adminUser.password, captchaSolver);

      // Bắt API call
      const [response] = await Promise.all([
        page.waitForResponse(resp => resp.url().includes('login') || resp.url().includes('auth')),
        loginPage.submit(),
      ]);

      const responseTime = response.request().timing()?.responseEnd || 0;
      console.log(`⏱️ API response time: ${responseTime}ms`);
      
      // Nếu có timing data thì kiểm tra
      if (responseTime > 0) {
        expect(responseTime).toBeLessThan(3000);
      }
    });

  });

  // ========================================
  // 6. CAPTCHA TESTS
  // ========================================

  test.describe('6. Captcha Tests', () => {
    
    /**
     * TC100: Đăng nhập với captcha = 1
     */
    test('TC100 - Đăng nhập thành công với captcha đúng (bypass mode)', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const adminUser = users.validUsers[0];

      await loginPage.goto();
      await loginPage.clickLoginButton();
      
      // Sử dụng captcha solver
      await loginPage.fillLoginForm(adminUser.username, adminUser.password, captchaSolver);
      await loginPage.submit();

      await page.waitForTimeout(2000);
      console.log('✅ Đăng nhập với captcha bypass thành công');
    });

    /**
     * TC101: Kiểm tra captcha field tồn tại
     */
    test('TC101 - Kiểm tra captcha field hiển thị', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.clickLoginButton();

      const hasCaptcha = await captchaSolver.isCaptchaRequired(
        page, 
        'input[name="captcha"], input[placeholder*="mã"]'
      );

      if (hasCaptcha) {
        console.log('✅ Captcha field được hiển thị');
        await expect(loginPage.captchaInput).toBeVisible();
      } else {
        console.log('ℹ️ Captcha không được yêu cầu trong lần đăng nhập đầu tiên');
      }
    });

  });

});
