# 🚀 Quick Start - Thêm Test Cases cho dự án mới

## 📝 Tóm tắt nhanh

Framework đã setup sẵn cho 4 dự án:
- ✅ **DKTW** (đã có 21 test cases)
- 🆕 **BaoGia** (chưa có test)
- 🆕 **CRM** (chưa có test)
- 🆕 **TriThuc** (chưa có test)

---

## 🎯 Cách thêm test cho dự án mới

### Bước 1: Tạo Page Object

Tạo file `pages/<project>/LoginPage.ts`:

```typescript
import { Page, Locator, expect } from '@playwright/test';
import { CaptchaSolver } from '../../utils/captcha-solver';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // TODO: Inspect page và điền selector chính xác
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async login(username: string, password: string) {
    await this.page.goto('/');
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### Bước 2: Tạo Test Data

Tạo file `data/<project>/users.json`:

```json
{
  "validUsers": [
    {
      "username": "admin",
      "password": "password123",
      "role": "Admin"
    }
  ]
}
```

### Bước 3: Viết Test Cases

Tạo file `tests/<project>/login.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/<project>/LoginPage';
import users from '../../data/<project>/users.json';

test.describe('<Project> - Login Tests', () => {
  
  test('TC01 - Login thành công', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = users.validUsers[0];

    await loginPage.login(user.username, user.password);
    
    // Verify login success
    await expect(page).toHaveURL(/dashboard|home/);
  });

});
```

### Bước 4: Chạy Test

```bash
# Chạy test cho dự án cụ thể
npm test -- --project=BaoGia
npm test -- --project=CRM
npm test -- --project=TriThuc

# Hoặc chạy tất cả
npm test
```

---

## 📋 Template - 21 Test Cases chuẩn cho Login

Copy từ `tests/dktw/login.spec.ts` và điều chỉnh selector.

### Checklist Test Cases:

**Positive (3)**
- [ ] TC01: Login thành công
- [ ] TC02: Login với Remember Me
- [ ] TC03: Redirect đúng

**Negative (6)**
- [ ] TC05: Username sai
- [ ] TC06: Password sai
- [ ] TC07: Cả 2 sai
- [ ] TC08: Username trống
- [ ] TC09: Password trống
- [ ] TC10: Cả 2 trống
- [ ] TC11: Whitespace handling

**Security (3)**
- [ ] TC20: Password masking
- [ ] TC21: SQL Injection
- [ ] TC22: XSS protection

**UI/UX (4)**
- [ ] TC30: Element visibility
- [ ] TC31: Placeholder text
- [ ] TC39: Tab navigation
- [ ] TC40: Enter key submit

**Performance (2)**
- [ ] TC50: Page load time
- [ ] TC51: API response time

**Captcha (2)**
- [ ] TC100: Login với captcha
- [ ] TC101: Captcha field display

---

## 🔧 Troubleshooting

### ❓ Làm sao biết selector của element?

**Cách 1**: Dùng Playwright Inspector
```bash
npx playwright codegen <URL>
```

**Cách 2**: Dùng Chrome DevTools
1. F12 → Elements tab
2. Right click element → Copy → Copy selector

**Cách 3**: Dùng Playwright Test Generator
```bash
npx playwright test --debug
```

### ❓ Test fail vì selector không tìm thấy?

Thử các selector khác nhau:

```typescript
// By name attribute
page.locator('input[name="username"]')

// By ID
page.locator('#username')

// By placeholder
page.locator('input[placeholder="Email"]')

// By text
page.locator('text=Login')

// By role (accessible)
page.getByRole('textbox', { name: 'Username' })
page.getByRole('button', { name: 'Login' })
```

### ❓ Captcha xuất hiện thế nào?

Xem hướng dẫn chi tiết: [CAPTCHA_SOLUTIONS.md](CAPTCHA_SOLUTIONS.md)

**Giải pháp nhanh**: Yêu cầu Backend bypass captcha cho test environment.

---

## 📊 Xem Báo cáo

```bash
# Playwright HTML report (tự động mở)
npm test

# Allure Report (chuyên nghiệp)
npm run report:serve
```

---

## 🎓 Học thêm

### Test một trang hoàn chỉnh cần gì?

Xem: [TEST_CASES_GUIDE.md](TEST_CASES_GUIDE.md)

**Tóm tắt**:
- Minimum: 30-40 test cases
- Cover: Functional, Security, UI/UX, Performance
- Priority: Critical → High → Medium → Low

### Best Practices

1. **Một test một mục đích**: Không gộp quá nhiều assertion
2. **Sử dụng test.step()**: Dễ debug khi fail
3. **Data-driven**: Tách data ra file riêng
4. **Independent**: Test không phụ thuộc nhau
5. **Clean up**: Xóa data test sau khi chạy xong

---

## 🚀 CI/CD Integration

### GitHub Actions

Tạo file `.github/workflows/test.yml`:

```yaml
name: Automation Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: allure-results
          path: allure-results/
```

---

## 📞 Cần trợ giúp?

- 📖 [README.md](README.md) - Hướng dẫn tổng quan
- 📋 [TEST_CASES_GUIDE.md](TEST_CASES_GUIDE.md) - Các loại test case
- 🤖 [CAPTCHA_SOLUTIONS.md](CAPTCHA_SOLUTIONS.md) - Xử lý captcha
- 📊 [TEST_REPORT_SUMMARY.md](TEST_REPORT_SUMMARY.md) - Kết quả test mẫu

---

## ✅ Checklist hoàn chỉnh

Khi thêm test cho 1 dự án mới:

- [ ] Tạo Page Object trong `pages/<project>/`
- [ ] Tạo test data trong `data/<project>/`
- [ ] Viết test cases trong `tests/<project>/`
- [ ] Update `playwright.config.ts` nếu cần (đã có sẵn 4 projects)
- [ ] Chạy test: `npm test -- --project=<Project>`
- [ ] Xem báo cáo: `npm run report:serve`
- [ ] Commit code lên Git
- [ ] Setup CI/CD (optional nhưng khuyến khích)

**Thời gian ước tính**: 2-4 giờ cho 1 dự án mới (bao gồm inspect, viết test, debug)
