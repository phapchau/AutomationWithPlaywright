/**
 * Captcha Solver Utility
 * Hỗ trợ nhiều phương thức giải captcha cho automation testing
 */

import { Page } from '@playwright/test';

export type CaptchaStrategy = 'bypass' | 'fixed-value' | '2captcha' | 'manual';

export interface CaptchaConfig {
  strategy: CaptchaStrategy;
  fixedValue?: string;
  apiKey?: string; // Cho 2captcha service
  timeout?: number;
}

export class CaptchaSolver {
  private config: CaptchaConfig;

  constructor(strategy: CaptchaStrategy = 'bypass', apiKey?: string) {
    this.config = {
      strategy,
      fixedValue: '1', // Default value for testing
      apiKey,
      timeout: 30000,
    };
  }

  /**
   * Giải captcha dựa trên strategy được chọn
   */
  async solve(page: Page, captchaSelector: string): Promise<string> {
    switch (this.config.strategy) {
      case 'bypass':
        return this.bypassCaptcha();
      
      case 'fixed-value':
        return this.useFixedValue();
      
      case '2captcha':
        return await this.use2Captcha(page);
      
      case 'manual':
        return await this.manualSolve(page, captchaSelector);
      
      default:
        throw new Error(`Unknown captcha strategy: ${this.config.strategy}`);
    }
  }

  /**
   * Strategy 1: Bypass - Backend cho phép giá trị đặc biệt
   * Yêu cầu: Backend phải config để accept giá trị 'bypass', 'test', '1', etc.
   */
  private bypassCaptcha(): string {
    console.log('🔓 Sử dụng bypass captcha (test environment)');
    return this.config.fixedValue || '1';
  }

  /**
   * Strategy 2: Fixed Value - Nhập giá trị cố định
   * Sử dụng khi biết trước captcha value (ví dụ: 1, test123)
   */
  private useFixedValue(): string {
    console.log(`🔢 Sử dụng fixed captcha value: ${this.config.fixedValue}`);
    return this.config.fixedValue || '1';
  }

  /**
   * Strategy 3: 2Captcha Service
   * Sử dụng dịch vụ giải captcha tự động (tốn phí)
   * Docs: https://2captcha.com/2captcha-api
   */
  private async use2Captcha(page: Page): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('2Captcha API key is required');
    }

    console.log('🤖 Gọi 2Captcha service để giải captcha...');

    try {
      // Lấy site key từ page (cho reCAPTCHA)
      const siteKey = await page.evaluate(() => {
        const element = document.querySelector('[data-sitekey]');
        return element?.getAttribute('data-sitekey');
      });

      if (!siteKey) {
        throw new Error('Không tìm thấy reCAPTCHA site key');
      }

      // Gọi API 2captcha (cần install axios)
      // const response = await this.call2CaptchaAPI(siteKey, page.url());
      // return response.token;

      // Placeholder - bạn cần implement call API thực tế
      console.warn('⚠️ 2Captcha integration chưa hoàn chỉnh. Vui lòng implement call2CaptchaAPI()');
      return '1'; // Fallback
    } catch (error) {
      console.error('❌ Lỗi khi gọi 2Captcha:', error);
      return '1'; // Fallback
    }
  }

  /**
   * Strategy 4: Manual - Pause và đợi người dùng nhập tay
   * Sử dụng khi debug hoặc test một vài trường hợp đặc biệt
   */
  private async manualSolve(page: Page, captchaSelector: string): Promise<string> {
    console.log('⏸️ Tạm dừng để bạn nhập captcha thủ công...');
    console.log(`👉 Nhập vào field: ${captchaSelector}`);
    
    // Pause và đợi 60 giây để user nhập tay
    await page.pause(); // Hoặc waitForTimeout(60000)
    
    // Lấy giá trị sau khi user nhập
    const value = await page.inputValue(captchaSelector);
    return value;
  }

  /**
   * Helper: Fill captcha vào field
   */
  async fillCaptcha(page: Page, captchaSelector: string): Promise<void> {
    const captchaValue = await this.solve(page, captchaSelector);
    
    console.log(`✍️ Điền captcha: ${captchaValue}`);
    await page.fill(captchaSelector, captchaValue);
  }

  /**
   * Helper: Verify captcha field tồn tại
   */
  async isCaptchaRequired(page: Page, captchaSelector: string): Promise<boolean> {
    try {
      const isVisible = await page.locator(captchaSelector).isVisible({ timeout: 2000 });
      console.log(isVisible ? '🔐 Captcha được yêu cầu' : '✅ Không cần captcha');
      return isVisible;
    } catch {
      return false;
    }
  }
}

/**
 * Factory function để tạo solver dễ dàng
 */
export function createCaptchaSolver(
  strategy: CaptchaStrategy = 'bypass',
  options?: { apiKey?: string; fixedValue?: string }
): CaptchaSolver {
  const solver = new CaptchaSolver(strategy, options?.apiKey);
  
  if (options?.fixedValue) {
    solver['config'].fixedValue = options.fixedValue;
  }
  
  return solver;
}

/**
 * Environment-based solver
 * Tự động chọn strategy dựa trên môi trường
 */
export function getEnvironmentSolver(): CaptchaSolver {
  const env = process.env.NODE_ENV || 'test';
  
  switch (env) {
    case 'test':
    case 'development':
      console.log('🧪 Test environment - Sử dụng bypass captcha');
      return new CaptchaSolver('bypass');
    
    case 'staging':
      console.log('🎭 Staging environment - Sử dụng fixed value');
      return new CaptchaSolver('fixed-value');
    
    case 'production':
      const apiKey = process.env.CAPTCHA_API_KEY;
      if (apiKey) {
        console.log('🏭 Production environment - Sử dụng 2captcha service');
        return new CaptchaSolver('2captcha', apiKey);
      }
      console.warn('⚠️ Production nhưng không có API key - Fallback về bypass');
      return new CaptchaSolver('bypass');
    
    default:
      return new CaptchaSolver('bypass');
  }
}
