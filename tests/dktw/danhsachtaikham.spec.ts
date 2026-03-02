







import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/dktw/LoginPage';
import { DanhSachHenTaiKhamPage } from '../../pages/dktw/DanhSachTaiKhamPage';
import { createCaptchaSolver } from '../../utils/captcha-solver';
import users from '../../data/dktw/users.json';

test.describe('DKTW  Danh sách bệnh nhân hẹn tái khám', () => {

  // =========================
  // ✅ LOGIN CHUNG – chạy trước MỖI TEST
  // =========================
//   test.beforeEach(async ({ page }) => {
//   const loginPage = new LoginPage(page);
//   const captchaSolver = createCaptchaSolver('bypass', { fixedValue: '1' });
//   const adminUser = users.validUsers[0];

//   await loginPage.login(
//     adminUser.username,
//     adminUser.password,
//     captchaSolver
//   );

//   // ✅ Chỉ cần đảm bảo không quay lại login
//   await expect(page).not.toHaveURL(/user\/login/, {
//     timeout: 20000,
//   });

//   // ✅ (OPTIONAL) chờ app shell nếu có
//   await page.waitForTimeout(500); // SPA settle
// });///bản 28/01

test.beforeEach(async ({ page }) => {
  // 👉 vào thẳng trang sau login
  await page.goto('/benhvien');

  // ✅ đảm bảo session hợp lệ
  await expect(page).not.toHaveURL(/user\/login/, {
    timeout: 15000,
  });
});




  test('TC700  Search theo Mã BN (input chung)', async ({ page }) => {
  const pageObj = new DanhSachHenTaiKhamPage(page);
  const MA_BN = '2601000200';

  await pageObj.goto();
  await pageObj.search(MA_BN);

  // ✅ chỉ có 1 dòng kết quả
  const rows = page.locator('tbody tr');
  await expect(rows).toHaveCount(1);

  // ✅ dòng đó chứa đúng mã BN
  await expect(rows.first()).toContainText(MA_BN);
});


  
test('TC701  Search theo Họ tên (input chung)', async ({ page }) => {
  const pageObj = new DanhSachHenTaiKhamPage(page);
  const HO_TEN = 'Hà Anh Tám';

  await pageObj.goto();
  await pageObj.search(HO_TEN);

  const rows = page.locator('tbody tr');

  // ✅ phải có ít nhất 1 kết quả
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);

  // ✅ có ÍT NHẤT 1 dòng chứa đúng họ tên
  await expect(
    rows.filter({ hasText: HO_TEN }).first()
  ).toBeVisible();
});




  

  test('TC702  Search theo SĐT (input chung)', async ({ page }) => {
  const pageObj = new DanhSachHenTaiKhamPage(page);
  const SDT = '0794561234';

  await pageObj.goto();
  await pageObj.search(SDT);

  const rows = page.locator('tbody tr');

  // ✅ chỉ được 1 kết quả
  await expect(rows).toHaveCount(1);

  // ✅ dòng đó chứa đúng SĐT
  await expect(rows.first()).toContainText(SDT);
});


  // =====================================================
  test('TC703  Search → Xóa bộ lọc → input trống', async ({ page }) => {
    const pageObj = new DanhSachHenTaiKhamPage(page);
    const KEYWORD = '0794561234';

    await pageObj.goto();
    await pageObj.search(KEYWORD);

    await pageObj.clearFilterByXAndReload();
    await pageObj.verifySearchInputEmpty();
  });

  // =====================================================
  test('TC704  Search ký tự đặc biệt → No data', async ({ page }) => {
    const pageObj = new DanhSachHenTaiKhamPage(page);

    await pageObj.goto();
    await pageObj.search('@@@###$$$%%%');
    await pageObj.verifyNoData();
  });

  // =====================================================
  test('TC705  Search SĐT có ký tự đặc biệt → No data', async ({ page }) => {
    const pageObj = new DanhSachHenTaiKhamPage(page);

    await pageObj.goto();
    await pageObj.search('0232323424@');
    await pageObj.verifyNoData();
  });

 
  test('TC706  Input trống → bấm Tìm → load danh sách mặc định', async ({ page }) => {
  const pageObj = new DanhSachHenTaiKhamPage(page);

  await pageObj.goto();

  // đảm bảo input trống
  await pageObj.fillSearch('');
  await pageObj.clickTim();

  const rows = page.locator('tbody tr');

  // ✅ danh sách mặc định phải có dữ liệu
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
});


  

  test('TC707  Search khoảng trắng → không crash', async ({ page }) => {
  const pageObj = new DanhSachHenTaiKhamPage(page);

  await pageObj.goto();

  // nhập toàn khoảng trắng
  await pageObj.search('     ');

  // ✅ vẫn ở đúng trang
  await expect(page).toHaveURL(/danh-sach-benh-nhan-hen-tai-kham/i);

  // ✅ danh sách vẫn hiển thị (không crash)
  const rows = page.locator('tbody tr');
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
});


  // =====================================================
  test('TC708  Search keyword không tồn tại → No data', async ({ page }) => {
    const pageObj = new DanhSachHenTaiKhamPage(page);

    await pageObj.goto();
    await pageObj.search('ZZZ_NOT_FOUND_999999');
    await pageObj.verifyNoData();
  });

  // =====================================================
  
  test('TC709  Search liên tiếp 2 keyword (A → B)', async ({ page }) => {
  const pageObj = new DanhSachHenTaiKhamPage(page);

  await pageObj.goto();

  // ===== SEARCH A (SĐT – unique) =====
  const SDT = '0794561234';
  await pageObj.search(SDT);

  let rows = page.locator('tbody tr');

  // A là unique → chỉ 1 kết quả
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText(SDT);

  // ===== SEARCH B (Họ tên – không unique) =====
  const HO_TEN = 'Nguyễn Văn Dương';
  await pageObj.search(HO_TEN);

  rows = page.locator('tbody tr');

  // B phải có ít nhất 1 kết quả
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);

  // ❌ KHÔNG còn dữ liệu của A
  await expect(page.getByText(SDT)).toHaveCount(0);

  // ✅ tất cả kết quả đều đúng họ tên B
  for (let i = 0; i < count; i++) {
    await expect(rows.nth(i)).toContainText(HO_TEN);
  }
});


  // =====================================================
 

  test('TC710  Nhấn Enter trong input search → chạy tìm kiếm', async ({ page }) => {
  const pageObj = new DanhSachHenTaiKhamPage(page);
  const MA_BN = '2601000143';

  await pageObj.goto();

  // chỉ fill input, KHÔNG click nút tìm
  await pageObj.fillSearch(MA_BN);

  // hành vi chính của test
  await pageObj.searchInput.press('Enter');

  const rows = page.locator('tbody tr');

  // ✅ Mã BN là unique → chỉ 1 kết quả
  await expect(rows).toHaveCount(1);

  // ✅ kết quả đúng mã BN
  await expect(rows.first()).toContainText(MA_BN);
});

//mới thêm vào chưa test
test('TC711 Search khoảng trắng dài → Không crash', async ({ page }) => {
  const pageObj = new DanhSachHenTaiKhamPage(page);

  await pageObj.goto();
  await pageObj.search('             ');

  await expect(page).toHaveURL(/tai-kham/i);
});


});
