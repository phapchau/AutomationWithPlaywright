# Automation Testing Framework

Hệ thống test tự động sử dụng **Playwright + TypeScript + Allure Report** theo mô hình **Page Object Model**.

## Cấu trúc thư mục

```
automation-test.nentang.vn/
├── config/                    # Biến môi trường (DEV, STAGING, PROD)
├── data/                      # Dữ liệu test (JSON, CSV)
│   ├── dktw/
│   ├── baogia/
│   └── crm/
├── pages/                     # Page Object Model
│   ├── common/                # Các trang chung (Login, Header, Footer)
│   ├── dktw/
│   ├── baogia/
│   └── crm/
├── tests/                     # Test Cases
│   ├── dktw/
│   ├── baogia/
│   └── crm/
├── utils/                     # Hàm hỗ trợ
├── playwright.config.ts       # Cấu hình chính
└── package.json
```

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Cài đặt browsers cho Playwright
npx playwright install
```

## Chạy Test

```bash
# Chạy tất cả test
npm test

# Chạy test cho dự án DKTW
npm run test:dktw

# Chạy test với UI (headed mode)
npm run test:headed

# Debug test
npm run test:debug
```

## Xem Báo cáo Allure

```bash
# Tạo và mở báo cáo Allure
npm run report:generate
npm run report:open

# Hoặc serve trực tiếp (nhanh hơn)
npm run report:serve
```

## Tính năng

✅ **Tự động chụp ảnh** khi test fail  
✅ **Tự động quay video** khi test fail  
✅ **Báo cáo Allure** chuyên nghiệp với biểu đồ, lịch sử  
✅ **Page Object Model** dễ bảo trì  
✅ **Multi-project** - Quản lý nhiều dự án cùng lúc  
✅ **TypeScript** - Type-safe, IntelliSense  

## Viết Test Case mới

1. Tạo Page Object trong `pages/<project>/`
2. Viết test case trong `tests/<project>/`
3. Chạy test với `npm test --project=<project>`
