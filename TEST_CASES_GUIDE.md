# Hướng dẫn Test Cases chuẩn cho Automation Testing

## 📋 Tổng quan

Khi test một trang web, chúng ta cần cover nhiều khía cạnh khác nhau để đảm bảo chất lượng. Dưới đây là danh sách đầy đủ các loại test case theo best practice.

---

## 1. 🎯 FUNCTIONAL TESTING (Kiểm thử chức năng)

### A. Positive Test Cases (Happy Path)
Kiểm tra các tình huống đúng, user làm đúng quy trình.

**Ví dụ cho trang Login:**
- ✅ TC01: Đăng nhập thành công với tài khoản hợp lệ
- ✅ TC02: Đăng nhập với Remember Me được bật
- ✅ TC03: Đăng nhập sau khi đăng xuất
- ✅ TC04: Redirect đúng sau khi đăng nhập thành công

### B. Negative Test Cases (Unhappy Path)
Kiểm tra các tình huống sai, user nhập sai hoặc làm sai quy trình.

**Ví dụ cho trang Login:**
- ❌ TC05: Đăng nhập với username sai
- ❌ TC06: Đăng nhập với password sai
- ❌ TC07: Đăng nhập với cả username và password sai
- ❌ TC08: Đăng nhập với username để trống
- ❌ TC09: Đăng nhập với password để trống
- ❌ TC10: Đăng nhập với cả 2 field để trống
- ❌ TC11: Đăng nhập với username có khoảng trắng đầu/cuối
- ❌ TC12: Đăng nhập với password có khoảng trắng đầu/cuối
- ❌ TC13: Đăng nhập với username quá dài (> max length)
- ❌ TC14: Đăng nhập với tài khoản đã bị khóa
- ❌ TC15: Đăng nhập với tài khoản chưa kích hoạt

---

## 2. 🔒 SECURITY TESTING (Kiểm thử bảo mật)

- 🔐 TC20: Kiểm tra password không hiển thị dưới dạng plain text
- 🔐 TC21: Kiểm tra SQL Injection trong username field
- 🔐 TC22: Kiểm tra XSS (Cross-Site Scripting) trong input fields
- 🔐 TC23: Kiểm tra session timeout (hết hạn phiên đăng nhập)
- 🔐 TC24: Kiểm tra CSRF token có được validate không
- 🔐 TC25: Kiểm tra brute force attack (đăng nhập sai nhiều lần)
- 🔐 TC26: Kiểm tra captcha xuất hiện sau X lần đăng nhập sai
- 🔐 TC27: Kiểm tra không thể truy cập trang admin khi chưa đăng nhập
- 🔐 TC28: Kiểm tra password có bị lưu trong browser history không

---

## 3. 🎨 UI/UX TESTING (Kiểm thử giao diện)

### A. Layout & Design
- 🎨 TC30: Kiểm tra logo hiển thị đúng
- 🎨 TC31: Kiểm tra title trang đúng
- 🎨 TC32: Kiểm tra placeholder text của các input field
- 🎨 TC33: Kiểm tra label của các field
- 🎨 TC34: Kiểm tra button "Đăng nhập" có màu sắc, kích thước đúng

### B. Responsive Design
- 📱 TC35: Kiểm tra hiển thị trên Mobile (iPhone 13)
- 📱 TC36: Kiểm tra hiển thị trên Tablet (iPad)
- 📱 TC37: Kiểm tra hiển thị trên Desktop (1920x1080)
- 📱 TC38: Kiểm tra hiển thị trên màn hình 4K

### C. Accessibility
- ♿ TC39: Kiểm tra có thể điều hướng bằng Tab key
- ♿ TC40: Kiểm tra có thể submit form bằng Enter key
- ♿ TC41: Kiểm tra các field có aria-label cho screen reader
- ♿ TC42: Kiểm tra contrast ratio (tỷ lệ tương phản màu sắc)

---

## 4. ⚡ PERFORMANCE TESTING (Kiểm thử hiệu năng)

- ⚡ TC50: Thời gian load trang < 3 giây
- ⚡ TC51: Thời gian response API login < 2 giây
- ⚡ TC52: Kiểm tra trang không bị crash khi load 100 lần liên tiếp
- ⚡ TC53: Kiểm tra memory leak sau khi đăng nhập/đăng xuất nhiều lần
- ⚡ TC54: Kiểm tra lazy loading của images/resources

---

## 5. 🌐 COMPATIBILITY TESTING (Kiểm thử tương thích)

### A. Browser Compatibility
- 🌐 TC60: Test trên Chrome (latest)
- 🌐 TC61: Test trên Firefox (latest)
- 🌐 TC62: Test trên Safari (latest)
- 🌐 TC63: Test trên Edge (latest)

### B. OS Compatibility
- 💻 TC65: Test trên Windows 11
- 💻 TC66: Test trên macOS
- 💻 TC67: Test trên Linux (Ubuntu)
- 📱 TC68: Test trên iOS
- 📱 TC69: Test trên Android

---

## 6. 🔗 INTEGRATION TESTING (Kiểm thử tích hợp)

- 🔗 TC70: Kiểm tra đăng nhập qua Google OAuth
- 🔗 TC71: Kiểm tra đăng nhập qua Facebook
- 🔗 TC72: Kiểm tra đăng nhập qua SSO (Single Sign-On)
- 🔗 TC73: Kiểm tra API gọi đúng endpoint
- 🔗 TC74: Kiểm tra request/response format đúng chuẩn

---

## 7. 📊 DATA VALIDATION TESTING (Kiểm thử validate dữ liệu)

- 📊 TC80: Kiểm tra username chỉ chấp nhận ký tự hợp lệ
- 📊 TC81: Kiểm tra password có validate độ mạnh không
- 📊 TC82: Kiểm tra error message hiển thị đúng cho mỗi lỗi
- 📊 TC83: Kiểm tra trim whitespace tự động
- 📊 TC84: Kiểm tra case-sensitive cho username/password

---

## 8. 🔄 STATE MANAGEMENT TESTING

- 🔄 TC90: Kiểm tra user đã login thì redirect về dashboard
- 🔄 TC91: Kiểm tra session persistence (F5 vẫn giữ đăng nhập)
- 🔄 TC92: Kiểm tra logout xóa session đúng cách
- 🔄 TC93: Kiểm tra back button không cho quay lại sau logout

---

## 9. 🤖 CAPTCHA TESTING

- 🤖 TC100: Captcha hiển thị sau X lần đăng nhập sai
- 🤖 TC101: Đăng nhập thành công với captcha đúng
- 🤖 TC102: Đăng nhập thất bại với captcha sai
- 🤖 TC103: Kiểm tra refresh captcha hoạt động
- 🤖 TC104: Kiểm tra captcha timeout sau X phút

---

## 📝 Template Test Case

```typescript
test('TC[XX] - [Mô tả ngắn gọn]', async ({ page }) => {
  // Given: Setup điều kiện ban đầu
  
  // When: Thực hiện hành động
  
  // Then: Kiểm tra kết quả
  
  // Clean up: Dọn dẹp nếu cần
});
```

---

## 🎯 Ưu tiên Test Cases

### Priority 1 (Critical - Must have)
- Positive cases chính (đăng nhập thành công)
- Security critical (SQL injection, XSS)
- Performance critical (load time)

### Priority 2 (High - Should have)
- Negative cases phổ biến (sai username/password)
- UI/UX chính
- Browser compatibility (Chrome, Firefox, Safari)

### Priority 3 (Medium - Good to have)
- Edge cases
- Accessibility
- Less common browsers

### Priority 4 (Low - Nice to have)
- Extreme cases
- Stress testing

---

## 📊 Checklist cho 1 trang hoàn chỉnh

Khi test 1 trang bất kỳ, hãy đảm bảo cover:

- [ ] ✅ Ít nhất 5 positive test cases
- [ ] ❌ Ít nhất 10 negative test cases
- [ ] 🔒 Ít nhất 3 security test cases
- [ ] 🎨 Ít nhất 5 UI/UX test cases
- [ ] ⚡ Ít nhất 2 performance test cases
- [ ] 🌐 Test trên 3 browsers khác nhau
- [ ] 📱 Test responsive (mobile, tablet, desktop)
- [ ] ♿ Test accessibility cơ bản

**Tổng tối thiểu: ~30-40 test cases cho 1 trang**

---

## 🚀 Tips viết Test Cases hiệu quả

1. **Đặt tên rõ ràng**: Đọc tên test là biết nó test cái gì
2. **Một test một mục đích**: Không gộp nhiều assertion không liên quan
3. **Sử dụng test.step()**: Chia nhỏ các bước để dễ debug
4. **Data-driven testing**: Dùng loop cho các test giống nhau
5. **Prioritize**: Test critical path trước, edge case sau
6. **Independent**: Mỗi test phải chạy độc lập, không phụ thuộc test khác
7. **Cleanup**: Luôn dọn dẹp data sau khi test xong

---

## 📖 Tài liệu tham khảo

- ISTQB Test Case Design Techniques
- OWASP Testing Guide (Security)
- WCAG Guidelines (Accessibility)
- Web Performance Best Practices
