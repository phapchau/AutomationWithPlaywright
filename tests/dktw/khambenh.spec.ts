





import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/dktw/LoginPage';
import { KhamBenhPage } from '../../pages/dktw/KhamBenhPage';
import users from '../../data/dktw/users.json';

// test.describe('DKTW - Khám bệnh', () => {
//   test.beforeEach(async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     const adminUser = users.validUsers[0];

//     await loginPage.login(adminUser.username, adminUser.password);

//     // ✅ chờ login ổn định
//     await page.waitForURL((url) => !url.href.includes('/user/login'), {
//       timeout: 20000,
//     });

//     // await expect(page).not.toHaveURL(/user\/login/, { timeout: 20000 });
//   });

test.describe('DKTW - Khám bệnh', () => {
  test.beforeEach(async ({ page }) => {
    //  vào trang sau login
    await page.goto('/benhvien');

    // ✅ đảm bảo vẫn đăng nhập
    await expect(page).not.toHaveURL(/user\/login/, {
      timeout: 15000,
    });

    // (optional) chờ SPA ổn định
    await page.waitForTimeout(300);
  });


  test('TC400  Kiểm tra nghề nghiệp đã được lưu trong hồ sơ khám bệnh (theo Mã BN)', async ({ page }) => {
  const khamBenhPage = new KhamBenhPage(page);
  const MA_BN = '2603000001';

  // 1️⃣ Vào trang Khám bệnh
  await khamBenhPage.goto();

  // 2️⃣ Search Mã BN (input chung – đúng nghiệp vụ)
  await khamBenhPage.searchByMaBN(MA_BN);

  // 3️⃣ Mở hồ sơ đầu tiên tìm được
  await khamBenhPage.openFirstHoSo();

  // 4️⃣ Verify nghề nghiệp đã được lưu
  await khamBenhPage.verifyNgheNghiepExists();
});


 

  test('TC401  Kiểm tra HỌ TÊN được hiển thị trong hồ sơ khám bệnh', async ({ page }) => {
  const khamBenhPage = new KhamBenhPage(page);
  const MA_BN = '2603000001';

  // 1️⃣ Vào trang Khám bệnh
  await khamBenhPage.goto();

  // 2️⃣ Search theo Mã BN
  await khamBenhPage.searchByMaBN(MA_BN);

  // 3️⃣ Mở hồ sơ
  await khamBenhPage.openFirstHoSo();

  // 4️⃣ Verify họ tên hiển thị
  await khamBenhPage.verifyHoTenExists();
});





test('TC402  Danh sách chờ khám sắp xếp tăng dần theo Mã BN', async ({ page }) => {
  const khamBenhPage = new KhamBenhPage(page);

  await khamBenhPage.goto();

  // ✅ Đảm bảo đang ở tab Chờ khám
  await khamBenhPage.tabChoKham.click();

  // ✅ Chờ ít nhất 1 hồ sơ hiển thị
  const maBNLocator = page
    .locator('text=/Mã BN:\\s*\\d+/i')
    .locator(':visible');

  await expect(maBNLocator.first()).toBeVisible({ timeout: 15000 });

  const maBNTexts = await maBNLocator.allTextContents();

  // ✅ Phải có ít nhất 1 bệnh nhân
  expect(maBNTexts.length).toBeGreaterThan(0);

  // Convert sang số
  const maBNNumbers = maBNTexts.map(text => {
    const match = text.match(/\d+/);
    return match ? Number(match[0]) : 0;
  });

  // ✅ Nếu chỉ có 1 bệnh nhân → auto PASS (vì luôn sorted)
  if (maBNNumbers.length <= 1) return;

  // ✅ So sánh với mảng đã sort
  const sorted = [...maBNNumbers].sort((a, b) => a - b);

  expect(maBNNumbers).toEqual(sorted);
});



  test('TC403  Kiểm tra TUỔI hiển thị đúng định dạng trong hồ sơ khám bệnh', async ({ page }) => {
  const khamBenhPage = new KhamBenhPage(page);
  const MA_BN = '2603000001';

  // 1️⃣ Vào trang Khám bệnh
  await khamBenhPage.goto();

  // 2️⃣ Search Mã BN (input chung)
  await khamBenhPage.searchByMaBN(MA_BN);

  // 3️⃣ Mở hồ sơ tìm được
  await khamBenhPage.openFirstHoSo();

  // 4️⃣ Verify tuổi đúng định dạng
  await khamBenhPage.verifyTuoiFormat();
});






 test('TC404  Search theo Mã BN (input chung  cả Chờ khám & Đã khám)', async ({ page }) => {
    const khamBenhPage = new KhamBenhPage(page);
    const MA_BN = '2603000001'; // ✅ mã BN có tồn tại

    await khamBenhPage.goto();

    const foundIn = await khamBenhPage.searchByMaBN(MA_BN);

    // verify có kết quả
    await khamBenhPage.verifySearchHasResult();

    // log cho báo cáo
    // console.log(`✅ Mã BN ${MA_BN} tìm thấy ở tab: ${foundIn}`);
  });


  test('TC405  Search theo SĐT (input chung cả Chờ khám & Đã khám)', async ({ page }) => {
    const khamBenhPage = new KhamBenhPage(page);
    const SDT = '0901234567'; // ✅ SĐT có tồn tại

    await khamBenhPage.goto();

    const foundIn = await khamBenhPage.searchBySDT(SDT);

    // verify
    await khamBenhPage.verifySearchHasResult();
    await khamBenhPage.verifySDTExists(SDT);

    // console.log(`✅ SĐT ${SDT} tìm thấy ở tab: ${foundIn}`);
  });



test('TC406  Search theo CCCD (input chung  cả Chờ khám & Đã khám)', async ({ page }) => {
    const khamBenhPage = new KhamBenhPage(page);
    const CCCD = '089204018469'; // ✅ CCCD có tồn tại

    await khamBenhPage.goto();

    const foundIn = await khamBenhPage.searchByCCCD(CCCD);

    // verify
    await khamBenhPage.verifySearchHasResult();
    await khamBenhPage.verifyCCCDExists(CCCD);

    // console.log(`✅ CCCD ${CCCD} tìm thấy ở tab: ${foundIn}`);
  });

  // ==================================================
  // TC413 – Keyword không tồn tại
  // ==================================================
  test('TC407  Search keyword KHÔNG tồn tại → không có kết quả', async ({ page }) => {
    const khamBenhPage = new KhamBenhPage(page);
    const KEY_NOT_FOUND = 'ZZZ_NOT_EXIST_999';

    await khamBenhPage.goto();

    await expect(async () => {
      await khamBenhPage.searchInBothTabs(KEY_NOT_FOUND);
    }).rejects.toThrow(/Không tìm thấy bệnh nhân/);
  });
});
