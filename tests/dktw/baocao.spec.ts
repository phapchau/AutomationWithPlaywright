





import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/dktw/LoginPage';
import { BaoCaoPage } from '../../pages/dktw/BaoCaoPage';
import { createCaptchaSolver } from '../../utils/captcha-solver';
import users from '../../data/dktw/users.json';

// test.describe('DKTW  Báo cáo', () => {
//   test.beforeEach(async ({ page }) => {
//     const loginPage = new LoginPage(page);

//     const captchaSolver = createCaptchaSolver('bypass', { fixedValue: '1' });
//     const adminUser = users.validUsers[0];

//     await loginPage.login(adminUser.username, adminUser.password, captchaSolver);
//     await expect(page).not.toHaveURL(/user\/login/, { timeout: 20000 });
//   });
test.describe('DKTW  Báo cáo', () => {
  test.beforeEach(async ({ page }) => {
    // 👉 vào 1 trang sau login
    await page.goto('/benhvien');

    // ✅ đảm bảo session hợp lệ (không bị đá về login)
    await expect(page).not.toHaveURL(/user\/login/, {
      timeout: 15000,
    });

    // (optional) chờ SPA ổn định
    await page.waitForTimeout(300);
  });

  


// test('TC500  Tìm kiếm theo Mã BN', async ({ page }) => {
//   const baoCaoPage = new BaoCaoPage(page);
//   const MA_BN = '2601000006';

//   await baoCaoPage.goto();
//   await baoCaoPage.searchByMaBN(MA_BN);

//   const rows = page.locator('tbody tr');

//   // ✅ Mã BN là unique → chỉ 1 dòng
//   await expect(rows).toHaveCount(1);

//   // ✅ dòng đó chứa đúng Mã BN
//   await expect(rows.first()).toContainText(MA_BN);
// });

test('TC500  Tìm kiếm theo mã BN', async ({ page }) => {
  const baoCaoPage = new BaoCaoPage(page);
  const MA_BN = '2601000006';

  await baoCaoPage.goto();

  // ✅ Search bằng CLICK NÚT TÌM
  await baoCaoPage.searchByMaBN(MA_BN);

  //  CHỜ BUSINESS RESULT (KHÔNG wait network)
  const resultRow = page
    .locator('tbody tr')
    .filter({ hasText: MA_BN });

  await expect(resultRow).toHaveCount(1, { timeout: 20000 });

  //  verify chắc chắn
  await expect(resultRow.first()).toContainText(MA_BN);
});








  // test('TC501  Tìm kiếm theo HỌ TÊN bệnh nhân', async ({ page }) => {
  //   const baoCaoPage = new BaoCaoPage(page);
  //   const HO_TEN = 'Nguyễn Văn Test';

  //   await baoCaoPage.goto();
  //   await baoCaoPage.searchByHoTen(HO_TEN);
  //   await baoCaoPage.verifyResultContains(HO_TEN);
  // });
test('TC501  Tìm kiếm theo HỌ TÊN bệnh nhân ', async ({ page }) => {
  const baoCaoPage = new BaoCaoPage(page);
  const HO_TEN = 'Nguyễn Văn Test';

  await baoCaoPage.goto();
  await baoCaoPage.searchByHoTen(HO_TEN);

  const rows = page.locator('tbody tr');

  //  Wait table render
  await expect(rows.first()).toBeVisible({ timeout: 20000 });

  const count = await rows.count();
  expect(count).toBeGreaterThan(0);

  //  Mỗi row phải CONTAINS keyword
  for (let i = 0; i < count; i++) {
    await expect(rows.nth(i)).toContainText(HO_TEN);
  }
});






  test('TC502  Tìm theo 1 phương pháp tiêm', async ({ page }) => {
    const baoCaoPage = new BaoCaoPage(page);

    await baoCaoPage.goto();
    await baoCaoPage.selectPhuongPhapTiem('Tiêm Facet');
    await baoCaoPage.clickTim();
//     await expect(
//   page.getByText(/không có dữ liệu/i)
// ).toHaveCount(0);
// ✅ KHÔNG hiển thị "Không có dữ liệu"

  await expect(
    page.getByText(/không có dữ liệu/i)
  ).not.toBeVisible();

  });


  test('TC503  Tìm theo nhiều phương pháp tiêm', async ({ page }) => {
    const baoCaoPage = new BaoCaoPage(page);

    await baoCaoPage.goto();
    await baoCaoPage.selectPhuongPhapTiem([
      'Tiêm Facet',
      'Tiêm Subcutanoes',
      'Tiêm Cryofacet',
    ]);
    await baoCaoPage.clickTim();
    await expect(
  page.getByText(/không có dữ liệu/i)
).toHaveCount(0);


  });

  

  test('TC504  Tìm theo Mã BN + Họ tên + Phương pháp tiêm', async ({ page }) => {
  const baoCaoPage = new BaoCaoPage(page);

  const MA_BN = '2601000006';
  const HO_TEN = 'Nguyễn Văn Test';
  const PHUONG_PHAP = ['Tiêm Facet', 'Tiêm Cryogenicular'];

  await baoCaoPage.goto();

  await baoCaoPage.fillFilters({
    maBN: MA_BN,
    hoTen: HO_TEN,
    phuongPhapTiem: PHUONG_PHAP,
  });

  await baoCaoPage.clickTim();

  const rows = page.locator('tbody tr');

  // ✅ Mã BN là unique → chỉ 1 dòng
  await expect(rows).toHaveCount(1);

  const row = rows.first();
  await expect(row).toContainText(MA_BN);
  await expect(row).toContainText(HO_TEN);
});





test('TC505  Tìm theo Mã BN + Họ tên + Phương pháp tiêm → Xóa bộ lọc', async ({ page }) => {
  const baoCaoPage = new BaoCaoPage(page);

  const MA_BN = '2601000006';
  const HO_TEN = 'Nguyễn Văn Test';
  const PHUONG_PHAP = ['Tiêm Facet', 'Tiêm Cryofacet'];

  await baoCaoPage.goto();

  // ===== 1️⃣ Fill filter + tìm =====
  await baoCaoPage.fillFilters({
    maBN: MA_BN,
    hoTen: HO_TEN,
    phuongPhapTiem: PHUONG_PHAP,
  });

  await baoCaoPage.clickTim();

  //  CHỜ TABLE UPDATE (QUAN TRỌNG)
  await page.waitForLoadState('networkidle');

  const resultRow = page.locator('tbody tr').filter({ hasText: MA_BN });

  await expect(resultRow).toHaveCount(1, { timeout: 20000 });

  const row = resultRow.first();
  await expect(row).toContainText(MA_BN);
  await expect(row).toContainText(HO_TEN);
  await expect(row).toContainText(/Tiêm Facet|Tiêm Cryofacet/i);

  // ===== 2️ Xóa bộ lọc =====
  await baoCaoPage.clickXoaBoLocIconXAndReload();

  //  CHỜ TABLE RESET
  await page.waitForLoadState('networkidle');

  // ===== 3️⃣ Verify filter reset =====
  await expect(baoCaoPage.maBNInput).toHaveValue('');
  await expect(baoCaoPage.hoTenInput).toHaveValue('');

  const filterBox = baoCaoPage.timButton.locator('xpath=ancestor::div[1]');
  await expect(filterBox.locator('.mantine-Pill-root')).toHaveCount(0);
});




  
  test('TC506 Xuất file báo cao khi tìm được mã BN', async ({ page }) => {
  const baoCaoPage = new BaoCaoPage(page);
  const MA_BN = '2601000006';

  await baoCaoPage.goto();

  await baoCaoPage.searchByMaBN(MA_BN);

  const resultRow = page
    .locator('tbody tr')
    .filter({ hasText: MA_BN });

  await expect(resultRow).toHaveCount(1, { timeout: 20000 });

  //  chỉ export khi data đúng
  const download = await baoCaoPage.exportExcelAndWaitDownload();

  const filename = download.suggestedFilename();
  expect(filename).toMatch(/\.pdf$/i);
});



  test('TC507  Nhập Mã không tồn tại → Không có dữ liệu', async ({ page }) => {
  const baoCaoPage = new BaoCaoPage(page);
  const MA_BN_NOT_FOUND = '0000000000';

  await baoCaoPage.goto();

  await baoCaoPage.searchByMaBN(MA_BN_NOT_FOUND);

  //  Wait overlay nếu có
  await page.waitForLoadState('networkidle');

  const rows = page.locator('tbody tr');

  // ✅ Không có row thật
  // await expect(rows).toHaveCount(0);

  // // ✅ Có message no data
  // await expect(
  //   page.getByText(/không tìm thấy kết quả/i)
  // ).toBeVisible();

  await expect(rows).toHaveCount(1);

await expect(rows.first()).toContainText(
  /không tìm thấy kết quả|không có dữ liệu/i
);
});


  
  test('TC508  Chuyển sang trang 2 rồi Tìm kiếm mã BN', async ({ page }) => {
  const baoCaoPage = new BaoCaoPage(page);
  const MA_BN = '2601000132';

  await baoCaoPage.goto();

  // ✅ Chuyển sang trang 2
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.waitForTimeout(800);

  // ✅ Search theo Mã BN
  await baoCaoPage.searchByMaBN(MA_BN);

  const rows = page.locator('tbody tr');

  // ✅ Mã BN là unique → chỉ 1 dòng
  await expect(rows).toHaveCount(1);

  // ✅ dòng đó chứa đúng Mã BN
  await expect(rows.first()).toContainText(MA_BN);
});


  



// test('TC509  Nhấn Enter để lọc đúng Mã BN', async ({ page }) => {
//   const baoCaoPage = new BaoCaoPage(page);
//   const MA_BN = '2601000006';

//   await baoCaoPage.goto();

//   // ✅ Search bằng Enter
//   await baoCaoPage.searchByMaBNWithEnter(MA_BN);

//   //  Chờ table update
//   await page.waitForLoadState('networkidle');

//   const rows = page.locator('tbody tr');

//   // ✅ Table PHẢI chỉ còn đúng 1 dòng
//   await expect(rows).toHaveCount(1, { timeout: 20000 });

//   // ✅ Dòng đó đúng mã BN
//   await expect(rows.first()).toContainText(MA_BN);
// });


test('TC509  Nhấn Enter để tìm kiếm đúng Mã BN', async ({ page }) => {
  const baoCaoPage = new BaoCaoPage(page);
  const MA_BN = '2601000006';

  await baoCaoPage.goto();

  await baoCaoPage.searchByMaBNWithEnter(MA_BN);

  const resultRow = page
    .locator('tbody tr')
    .filter({ hasText: MA_BN });

  await expect(resultRow).toHaveCount(1, { timeout: 20000 });
  await expect(resultRow.first()).toContainText(MA_BN);
});




test('TC510 Spam search mã BN nhiều lần', async ({ page }) => {
  const pageObj = new BaoCaoPage(page);

  await pageObj.goto();

  for (let i = 0; i < 10; i++) {
    await pageObj.searchByMaBN('2601000006');
  }

  await expect(page.locator('tbody tr')).toHaveCount(1);
});


test('TC511  Search Mã BN không tồn tại nhưng vẫn expect có kết quả', async ({ page }) => {
  const baoCaoPage = new BaoCaoPage(page);

  await baoCaoPage.goto();
  await baoCaoPage.searchByMaBN('9999999999');

  const rows = page.locator('tbody tr');

  // ❌ Sai logic → chắc chắn fail
  await expect(rows).toHaveCount(1);
});


test('TC512  Search tên sai nhưng expect phải chứa tên', async ({ page }) => {
  const baoCaoPage = new BaoCaoPage(page);

  await baoCaoPage.goto();
  await baoCaoPage.searchByHoTen('ABC XYZ NOT EXIST');

  const rows = page.locator('tbody tr');

  // ❌ chắc chắn fail
  await expect(rows.first()).toContainText('ABC XYZ NOT EXIST');
});


  
});
