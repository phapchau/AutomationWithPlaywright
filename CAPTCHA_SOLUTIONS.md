# 🤖 Giải pháp xử lý CAPTCHA trong Automation Testing

## Vấn đề

CAPTCHA được thiết kế để **chặn bot**, nên việc automation test gặp captcha là điều tất yếu. Tuy nhiên, có nhiều cách để giải quyết vấn đề này trong môi trường testing.

---

## ✅ Giải pháp

### 1. 🎯 **Test Environment Bypass** (Khuyến nghị - Best Practice)

**Cách làm:** Yêu cầu team Backend tắt captcha cho môi trường test/staging.

**Implementation:**
```typescript
// Backend thêm config
if (process.env.NODE_ENV === 'test' || process.env.BYPASS_CAPTCHA === 'true') {
  // Skip captcha validation
  return true;
}
```

**Hoặc:** Backend cho phép bypass captcha với giá trị đặc biệt:
```typescript
// Trong test, nhập captcha = "bypass" hoặc "test123"
await page.fill('#captcha', 'bypass');
```

**Ưu điểm:**
- ✅ Nhanh, ổn định, không tốn tiền
- ✅ Không phụ thuộc service bên ngoài
- ✅ Best practice trong industry

**Nhược điểm:**
- ⚠️ Cần sự hỗ trợ từ Backend team

---

### 2. 🔑 **Whitelisted Test Account**

**Cách làm:** Tạo tài khoản test đặc biệt không yêu cầu captcha.

```typescript
// Backend check
if (user.isTestAccount || user.roles.includes('test-automation')) {
  skipCaptcha = true;
}
```

**Ưu điểm:**
- ✅ Đơn giản, dễ implement
- ✅ Không ảnh hưởng production

---

### 3. 🌐 **IP Whitelist**

**Cách làm:** Máy chạy CI/CD có IP cố định được whitelist.

```typescript
// Backend check
const allowedIPs = ['192.168.1.100', '10.0.0.50'];
if (allowedIPs.includes(requestIP)) {
  skipCaptcha = true;
}
```

**Ưu điểm:**
- ✅ Tự động, không cần can thiệp vào code test

---

### 4. 💰 **Captcha Solving Services** (Tốn phí)

Sử dụng dịch vụ bên thứ 3 để giải captcha tự động.

**Các dịch vụ phổ biến:**
- [2Captcha](https://2captcha.com/) - $2.99/1000 captchas
- [Anti-Captcha](https://anti-captcha.com/)
- [DeathByCaptcha](https://www.deathbycaptcha.com/)

**Cách sử dụng:**
```typescript
import axios from 'axios';

async function solve2Captcha(siteKey: string, pageUrl: string) {
  // Gửi request đến 2captcha
  const response = await axios.post('http://2captcha.com/in.php', {
    key: 'YOUR_API_KEY',
    method: 'userrecaptcha',
    googlekey: siteKey,
    pageurl: pageUrl,
  });
  
  const captchaId = response.data.split('|')[1];
  
  // Chờ giải (15-30 giây)
  await page.waitForTimeout(20000);
  
  // Lấy kết quả
  const result = await axios.get(`http://2captcha.com/res.php?key=YOUR_API_KEY&action=get&id=${captchaId}`);
  return result.data.split('|')[1]; // Token
}
```

**Ưu điểm:**
- ✅ Hoạt động với mọi loại captcha (reCAPTCHA, hCaptcha, image captcha...)
- ✅ Không cần can thiệp Backend

**Nhược điểm:**
- ❌ Tốn tiền
- ❌ Chậm (15-30s/captcha)
- ❌ Không ổn định 100%

---

### 5. 🧠 **OCR + Machine Learning** (Advanced)

Sử dụng Tesseract OCR hoặc ML model tự train để nhận diện captcha.

**Ví dụ với Tesseract:**
```typescript
import Tesseract from 'tesseract.js';

async function solveCaptcha(imagePath: string) {
  const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
  return text.trim();
}
```

**Ưu điểm:**
- ✅ Miễn phí
- ✅ Nhanh (nếu captcha đơn giản)

**Nhược điểm:**
- ❌ Chỉ hoạt động với captcha đơn giản
- ❌ Tỉ lệ chính xác thấp với captcha phức tạp

---

### 6. 🎭 **Mock API Response**

Intercept network request và trả về response giả.

```typescript
// Playwright có thể intercept và mock API
await page.route('**/api/verify-captcha', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ success: true }),
  });
});
```

**Ưu điểm:**
- ✅ Hoàn toàn kiểm soát
- ✅ Nhanh

**Nhược điểm:**
- ❌ Không test được flow captcha thật
- ❌ Cần biết structure của API

---

## 🎯 **Khuyến nghị cho dự án của bạn**

Dựa vào tình hình thực tế:

### Môi trường Test/Staging:
**→ Sử dụng Option 1 hoặc 2** (Test Environment Bypass hoặc Test Account)

**Lý do:**
- Nhanh, ổn định, miễn phí
- Không cần test captcha trong môi trường test (captcha là third-party service)
- Focus vào test business logic, không phải test Google reCAPTCHA

### Môi trường Production (E2E Testing):
**→ Sử dụng Option 4** (2Captcha Service)

**Lý do:**
- Cần test flow thực tế
- Chấp nhận chi phí để đảm bảo chất lượng

---

## 📝 Implementation cho dự án DKTW

File đã được tạo: `utils/captcha-solver.ts`

Bạn có thể sử dụng như sau:

```typescript
import { CaptchaSolver } from '../../utils/captcha-solver';

// Trong test
const solver = new CaptchaSolver('bypass'); // Hoặc '2captcha' nếu có API key
await loginPage.solveCaptcha(solver);
```

---

## ❓ FAQ

**Q: Tại sao không viết code để "click vào ảnh có xe buýt"?**  
A: reCAPTCHA v3 không cần user interaction, nó phân tích behavior. Automation tool sẽ luôn bị detect.

**Q: Có cách nào 100% miễn phí và ổn định không?**  
A: Có - Yêu cầu Backend bypass captcha cho test environment. Đây là cách mà 99% công ty làm.

**Q: Có cần test captcha không?**  
A: Không. Captcha là dịch vụ của Google/hCaptcha, đã được test kỹ. Bạn chỉ cần test business logic của mình.

---

## 🔗 Tài liệu tham khảo

- [Playwright Route API](https://playwright.dev/docs/network)
- [2Captcha API Documentation](https://2captcha.com/2captcha-api)
- [Best Practices for Testing with CAPTCHA](https://testautomationpatterns.org/wiki/index.php/CAPTCHA)
