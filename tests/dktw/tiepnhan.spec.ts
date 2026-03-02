

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/dktw/LoginPage';
import { TiepNhanPage } from '../../pages/dktw/TiepNhanPage';
import { createCaptchaSolver } from '../../utils/captcha-solver';
import users from '../../data/dktw/users.json';

// test.describe('DKTW  Tiếp nhận bệnh nhân', () => {
//   test.beforeEach(async ({ page }) => {
//     const loginPage = new LoginPage(page);

//     const captchaSolver = createCaptchaSolver('bypass', { fixedValue: '1' });
//     const adminUser = users.validUsers[0];

//     await loginPage.login(adminUser.username, adminUser.password, captchaSolver);
//     await expect(page).not.toHaveURL(/user\/login/, { timeout: 20000 });
//   });


test.describe('DKTW  Tiếp nhận bệnh nhân', () => {
  test.beforeEach(async ({ page }) => {
    // 👉 vào trang sau khi đã login bằng storageState
    await page.goto('/benhvien');

    // ✅ đảm bảo session còn hiệu lực
    await expect(page).not.toHaveURL(/user\/login/, {
      timeout: 15000,
    });

    // (optional) chờ SPA ổn định
    await page.waitForTimeout(300);
  });


  

// test('TC300 Nhập đầy đủ thông tin và tiếp nhận thành công', async ({ page }) => {
//   const tiepNhanPage = new TiepNhanPage(page);

//   await tiepNhanPage.goto();

//   const hoTen = 'Auto';
//   const soCCCD = `09${Date.now()}`;

//   await tiepNhanPage.fillRequiredFields({
//     hoTen,
//   });

//   await tiepNhanPage.fillOptionalFields({
//     soCCCD,
//     ngheNghiep: 'Công nhân',
//     noiLamViec: 'Công ty ABCX',
//     trinhDoVanHoa: '12/12',
//     diaChi: '123 Lê Lợi',
//     ngayCap: '01/03/2020',
//     noiCap: 'Công an Quận 1',
//   });

//   await tiepNhanPage.clickTiepNhan();

//   // ✅ 1️⃣ VERIFY TOAST THÀNH CÔNG (tín hiệu nghiệp vụ)
//   await tiepNhanPage.verifyCapNhatSuccessToast();

//   // ✅ 2️⃣ VERIFY bệnh nhân mới xuất hiện (KHÔNG phụ thuộc tuổi)
//   const benhNhanMoi = page
//   .locator('div')
//   .filter({
//     hasText: new RegExp(`${hoTen}.*tuổi`, 'i'),
//   })
//   .first();

// await expect(benhNhanMoi).toBeVisible({ timeout: 20000 });

// });


test('TC300 Nhập đầy đủ thông tin và tiếp nhận thành công', async ({ page }) => {
  const tiepNhanPage = new TiepNhanPage(page);

  await tiepNhanPage.goto();

  const hoTen = 'Auto '; // thêm timestamp tránh trùng
  const soCCCD = `09${Date.now()}`;

  await tiepNhanPage.fillRequiredFields({
    hoTen,
  });

  await tiepNhanPage.fillOptionalFields({
    soCCCD,
    ngheNghiep: 'Công nhân',
    noiLamViec: 'Công ty ABCX',
    trinhDoVanHoa: '12/12',
    diaChi: '123 Lê Lợi',
    ngayCap: '01/03/2020',
    noiCap: 'Công an Quận 1',
  });

  await tiepNhanPage.clickTiepNhan();

  // ✅ 1. Verify toast thành công
  await tiepNhanPage.verifyCapNhatSuccessToast();

  // ✅ 2. Chờ danh sách reload xong (ổn định hơn)
  await page.waitForLoadState('networkidle');

  // ✅ 3. Verify theo tên (KHÔNG phụ thuộc tuổi)
  const benhNhanMoi = page.getByText(hoTen, { exact: false }).first();

  await expect(benhNhanMoi).toBeVisible({ timeout: 20000 });
});



//   test('TC301 Chỉ nhập thông tin bắt buộc', async ({ page }) => {
//   const tiepNhanPage = new TiepNhanPage(page);

//   await tiepNhanPage.goto();

//   const hoTen = `Auto Test`;

//   await tiepNhanPage.fillRequiredFields({
//     hoTen,
//   });

//   await tiepNhanPage.clickTiepNhan();

//   // ✅ 1️⃣ Verify nghiệp vụ thành công
//   await tiepNhanPage.verifyCapNhatSuccessToast();

//   // ✅ 2️⃣ Verify bệnh nhân mới xuất hiện
//   await expect(
//     page.locator('div').filter({
//       hasText: new RegExp(`${hoTen}.*tuổi`, 'i'),
//     }).first()
//   ).toBeVisible({ timeout: 20000 });
// });

test('TC301 Chỉ nhập thông tin bắt buộc', async ({ page }) => {
  const tiepNhanPage = new TiepNhanPage(page);

  await tiepNhanPage.goto();

  const hoTen = `Auto Test`;

  await tiepNhanPage.fillRequiredFields({ hoTen });

  await tiepNhanPage.clickTiepNhan();

  // ✅ Verify toast thành công
  await tiepNhanPage.verifyCapNhatSuccessToast();

  await page.waitForLoadState('networkidle');

  // 🔥 Match đúng format danh sách: "Tên -"
  await expect(
    page.getByText(new RegExp(`^${hoTen}\\s*-`, 'i'))
  ).toBeVisible({ timeout: 20000 });
});


//   test('TC302  Không nhập họ tên → Không cho tiếp nhận', async ({ page }) => {
//     const tiepNhanPage = new TiepNhanPage(page);

//     await tiepNhanPage.goto();

//     // ❌ không nhập họ tên
//     await tiepNhanPage.ngaySinhInput.fill('01/01/2000');
//     await tiepNhanPage.sdtInput.fill('0901234567');
//     await tiepNhanPage.gioiTinhNam.check();

//     await tiepNhanPage.selectMantineByName(/Quốc tịch/i, 'Việt Nam');
//     await tiepNhanPage.selectMantineByName(/Tỉnh.*Thành/i, 'Thành phố Hồ Chí Minh');
//     await tiepNhanPage.selectMantineByName(/Phường.*Xã/i, 'Xã Bình Châu');
//     await tiepNhanPage.selectMantineByName(/Dân tộc/i, 'Kinh');
//     await tiepNhanPage.selectMantineByName(/Vào khoa/i, 'Gây mê hồi sức');
//     await tiepNhanPage.selectMantineByName(/Vào phòng/i, 'Buồng GMHS 1');

//     await tiepNhanPage.clickTiepNhan();

//     // ✅ vẫn ở trang tiếp nhận => FAIL đúng
//     await expect(page).toHaveURL(/\/benhvien\/tiepnhan/);


//     // ✅ 2️⃣ Hiển thị lỗi validation tại Họ tên
//   await expect(
//     page.getByText(/họ tên.*(bắt buộc|vui lòng)/i)
//   ).toBeVisible();

//   // ❌ 3️⃣ Không có toast thành công
//   // const toast = page.locator(
//   //   'div[role="alert"].mantine-Notifications-notification'
//   // );
//   // await expect(toast).not.toContainText(/thành công/i);
//   // Không có toast thành công
// const toast = page.locator(
//   'div[role="alert"].mantine-Notifications-notification'
// );

// await expect(toast).toHaveCount(0);
//   });

test('TC302 Không nhập họ tên → Không cho tiếp nhận', async ({ page }) => {
  const tiepNhanPage = new TiepNhanPage(page);

  await tiepNhanPage.goto();

  // ❌ Không nhập họ tên
  await tiepNhanPage.ngaySinhInput.fill('01/01/2000');
  await tiepNhanPage.sdtInput.fill('0901234567');
  await tiepNhanPage.gioiTinhNam.check();

  await tiepNhanPage.selectMantineByName(/Quốc tịch/i, 'Việt Nam');
  await tiepNhanPage.selectMantineByName(/Tỉnh.*Thành/i, 'Thành phố Hồ Chí Minh');
  await tiepNhanPage.selectMantineByName(/Phường.*Xã/i, 'Xã Bình Châu');
  await tiepNhanPage.selectMantineByName(/Dân tộc/i, 'Kinh');
  await tiepNhanPage.selectMantineByName(/Vào khoa/i, 'Gây mê hồi sức');
  await tiepNhanPage.selectMantineByName(/Vào phòng/i, 'Buồng GMHS 1');

  await tiepNhanPage.clickTiepNhan();

  // ✅ 1️⃣ Vẫn ở trang tiếp nhận (không redirect)
  await expect(page).toHaveURL(/tiepnhan/i);

  // ✅ 2️⃣ Input họ tên bị invalid (validation hoạt động)
  await expect(tiepNhanPage.hoTenInput)
    .toHaveAttribute('aria-invalid', 'true');

  // ✅ 3️⃣ Không có toast thành công
  await expect(
    page.getByText(/thành công/i)
  ).toHaveCount(0);
});
  

//   test('TC303  Nhập sai định dạng SĐT → hiển thị lỗi và không cho tiếp nhận', async ({ page }) => {
//   const tiepNhanPage = new TiepNhanPage(page);

//   await tiepNhanPage.goto();

//   // ✅ nhập các field bắt buộc KHÁC
//   await tiepNhanPage.hoTenInput.fill('Auto Test');
//   await tiepNhanPage.ngaySinhInput.fill('01/09/1997');
//   await tiepNhanPage.gioiTinhNam.check();

//   await tiepNhanPage.selectMantineByName(/Quốc tịch/i, 'Việt Nam');
//   await tiepNhanPage.selectMantineByName(/Tỉnh.*Thành/i, 'Thành phố Hồ Chí Minh');
//   await tiepNhanPage.selectMantineByName(/Phường.*Xã/i, 'Xã Bình Châu');
//   await tiepNhanPage.selectMantineByName(/Dân tộc/i, 'Kinh');
//   await tiepNhanPage.selectMantineByName(/Vào khoa/i, 'Gây mê hồi sức');
//   await tiepNhanPage.selectMantineByName(/Vào phòng/i, 'Buồng GMHS 1');

//   // ❌ nhập SĐT sai (type chứ KHÔNG fill)
//   await tiepNhanPage.sdtInput.click();
//   await tiepNhanPage.sdtInput.type('09abc@@@', { delay: 50 });
  


//   // ✅ ASSERT CHÍNH: input SĐT bị invalid
//   await expect(tiepNhanPage.sdtInput).toHaveAttribute(
//     'aria-invalid',
//     'true'
//   );

//   // ✅ nút Tiếp nhận bị disable
//   await expect(tiepNhanPage.tiepNhanButton).toBeDisabled();

//   // ❌ click cũng KHÔNG cho submit
//   await tiepNhanPage.clickTiepNhan();

//   // ❌ không có toast thành công
//   // const toast = page.locator(
//   //   'div[role="alert"].mantine-Notifications-notification'
//   // );
//   // await expect(toast).not.toContainText(/thành công/i);
//   await expect(
//   page.locator('div[role="alert"].mantine-Notifications-notification')
// ).toHaveCount(0);
// });

test('TC303 SĐT thiếu số → Không cho tiếp nhận', async ({ page }) => {
  const tiepNhanPage = new TiepNhanPage(page);

  await tiepNhanPage.goto();

  // Nhập đầy đủ field hợp lệ
  await tiepNhanPage.hoTenInput.fill('Auto Test');
  await tiepNhanPage.ngaySinhInput.fill('01/09/1997');
  await tiepNhanPage.gioiTinhNam.check();

  await tiepNhanPage.selectMantineByName(/Quốc tịch/i, 'Việt Nam');
  await tiepNhanPage.selectMantineByName(/Tỉnh.*Thành/i, 'Thành phố Hồ Chí Minh');
  await tiepNhanPage.selectMantineByName(/Phường.*Xã/i, 'Xã Bình Châu');
  await tiepNhanPage.selectMantineByName(/Dân tộc/i, 'Kinh');
  await tiepNhanPage.selectMantineByName(/Vào khoa/i, 'Gây mê hồi sức');
  await tiepNhanPage.selectMantineByName(/Vào phòng/i, 'Buồng GMHS 1');

  // ❌ Nhập thiếu số điện thoại
  await tiepNhanPage.sdtInput.fill('090123');

  await tiepNhanPage.clickTiepNhan();

  // ✅ 1️⃣ Vẫn ở trang tiếp nhận (không redirect)
  await expect(page).toHaveURL(/tiepnhan/i);

  // ✅ 2️⃣ Field SĐT bị invalid (validation hoạt động)
  await expect(tiepNhanPage.sdtInput)
    .toHaveAttribute('aria-invalid', 'true');

  // ✅ 3️⃣ Không có toast thành công
  await expect(
    page.getByText(/thành công/i)
  ).toHaveCount(0);
});


  // test('TC304  Nhập trùng số CCCD (không cho tiếp nhận)', async ({ page }) => {
  //   const tiepNhanPage = new TiepNhanPage(page);

  //   await tiepNhanPage.goto();

  //   await tiepNhanPage.fillRequiredFields();
  //   await tiepNhanPage.fillOptionalFields({
  //     soCCCD: '091769998055484', // CCCD trùng
  //     ngheNghiep: 'Kỹ sư',
  //   });

  //   await tiepNhanPage.clickTiepNhan();

  //   await expect(page).toHaveURL(/\/benhvien\/tiepnhan/);


  //   // ✅ 2️⃣ Hiển thị thông báo lỗi trùng CCCD (toast lỗi)
  // const errorToast = page.locator(
  //   'div[role="alert"].mantine-Notifications-notification'
  // );

  // await expect(errorToast).toContainText(/cccd|đã tồn tại|trùng/i);

  // // ❌ 3️⃣ KHÔNG có toast thành công
  // await expect(errorToast).not.toContainText(/thành công/i);
  // });

 test('TC304 Nhập trùng số CCCD → Không cho tiếp nhận', async ({ page }) => {
  const tiepNhanPage = new TiepNhanPage(page);

  await tiepNhanPage.goto();

  await tiepNhanPage.fillRequiredFields();

  await tiepNhanPage.fillOptionalFields({
    soCCCD: '091769998055484', // CCCD đã tồn tại
    ngheNghiep: 'Kỹ sư',
  });

  await tiepNhanPage.clickTiepNhan();

  // ✅ 1️⃣ Vẫn ở trang tiếp nhận (không redirect)
  await expect(page).toHaveURL(/tiepnhan/i);

  // ✅ 2️⃣ Có toast lỗi chứa nội dung trùng CCCD
  const errorToast = page.getByRole('alert').filter({
    hasText: /cccd|đã tồn tại|trùng/i,
  });

  await expect(errorToast).toBeVisible();

  // ✅ 3️⃣ Không có toast thành công
  await expect(
    page.getByText(/thành công/i)
  ).toHaveCount(0);
});


  test('TC305 - Tìm kiếm Mã BN và chọn cập nhật thông tin bệnh nhân, bấm hủy', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    const MA_BN = '2602000020';

    await tiepNhanPage.goto();

    // await tiepNhanPage.searchMaBN(MA_BN);
    await tiepNhanPage.searchByMaBN(MA_BN);
    await tiepNhanPage.openHoSoByMaBN(MA_BN);
    await tiepNhanPage.clickCapNhatThongTinBenhNhan();

    await tiepNhanPage.clickHuyThaoTac();

    await expect(
      page.getByRole('button', { name: /cập nhật thông tin bệnh nhân/i })
    ).toBeVisible({ timeout: 15000 });
  });

//   test('TC305 - Tìm Mã BN → Cập nhật thông tin → Bấm Hủy', async ({ page }) => {
//   const tiepNhanPage = new TiepNhanPage(page);

//   const MA_BN = '2602000001';

//   await tiepNhanPage.goto();

//   await tiepNhanPage.searchByMaBN(MA_BN);
//   await tiepNhanPage.openHoSoByMaBN(MA_BN);

//   // ✅ Đảm bảo đã mở hồ sơ
//   await expect(
//     page.getByText(new RegExp(MA_BN))
//   ).toBeVisible();

//   await tiepNhanPage.clickCapNhatThongTinBenhNhan();

//   // ✅ Đảm bảo đang ở chế độ cập nhật (form edit mở)
//   await expect(
//     tiepNhanPage.hoTenInput
//   ).toBeEditable();

//   await tiepNhanPage.clickHuyThaoTac();

//   // ✅ 1️⃣ Không còn editable nữa
//   await expect(
//     tiepNhanPage.hoTenInput
//   ).not.toBeEditable();

//   // ✅ 2️⃣ Nút "Cập nhật thông tin bệnh nhân" xuất hiện lại
//   await expect(
//     page.getByRole('button', { name: /cập nhật thông tin bệnh nhân/i })
//   ).toBeVisible();

//   // ✅ 3️⃣ Không có toast thành công
//   await expect(
//     page.getByText(/thành công/i)
//   ).toHaveCount(0);
// });


  test('TC306  Tìm Mã BN chọn cập nhật SĐT → lưu thành công', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    const MA_BN = '2602000020';
    const NEW_PHONE = '0901234567';

    await tiepNhanPage.goto();

    // await tiepNhanPage.searchMaBN(MA_BN);
    await tiepNhanPage.searchByMaBN(MA_BN);
    await tiepNhanPage.openHoSoByMaBN(MA_BN);
    await tiepNhanPage.clickCapNhatThongTinBenhNhan();

    await tiepNhanPage.updateSoDienThoai(NEW_PHONE);

    await tiepNhanPage.clickLuuCapNhat();
    await tiepNhanPage.verifyCapNhatSuccessToast();
  });




  test('TC307  Tìm Mã BN → mở hồ sơ → cập nhật SĐT → hủy thao tác', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    const MA_BN = '2602000020';
    const NEW_PHONE = '0901234567';

    await tiepNhanPage.goto();

    // await tiepNhanPage.searchMaBN(MA_BN);
    await tiepNhanPage.searchByMaBN(MA_BN);
    await tiepNhanPage.openHoSoByMaBN(MA_BN);
    await tiepNhanPage.clickCapNhatThongTinBenhNhan();

    await tiepNhanPage.updateSoDienThoai(NEW_PHONE);

    await tiepNhanPage.clickHuyThaoTac();

    await expect(
      page.getByRole('button', { name: /cập nhật thông tin bệnh nhân/i })
    ).toBeVisible({ timeout: 15000 });
  });




  test('TC308  Tìm kiếm hồ sơ theo CCCD (input chung)', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    const CCCD = ' 091772006570079'; // ✅ phải là CCCD có tồn tại

    await tiepNhanPage.goto();

    // await tiepNhanPage.searchMaBN(CCCD);
    await tiepNhanPage.searchByKeyword(CCCD);

    await expect(page.getByText(new RegExp(CCCD))).toBeVisible({ timeout: 15000 });
  });



  test('TC309  Tìm kiếm hồ sơ theo SĐT (input chung)', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    const SDT = '0901234567'; // ✅ phải là SĐT có tồn tại

    await tiepNhanPage.goto();

    // await tiepNhanPage.searchMaBN(SDT);
    await tiepNhanPage.searchByKeyword(SDT);

    await expect(page.getByText(new RegExp(SDT))).toBeVisible({ timeout: 15000 });
  });



  test('TC310  Tìm kiếm hồ sơ theo Mã BN (input chung)', async ({ page }) => {
  const tiepNhanPage = new TiepNhanPage(page);

  const MA_BN = '2602000020'; // ✅ Mã BN có tồn tại

  await tiepNhanPage.goto();

  // 🔍 tìm bằng input chung
  await tiepNhanPage.searchByMaBN(MA_BN);

  // ✅ verify thấy hồ sơ
  await expect(
    page.getByText(new RegExp(`Mã BN:\\s*${MA_BN}`))
  ).toBeVisible({ timeout: 15000 });
});


 //mới thêm chưa test
test('TC311 CCCD chứa chữ → Fail', async ({ page }) => {
  const tiepNhanPage = new TiepNhanPage(page);

  await tiepNhanPage.goto();

  await tiepNhanPage.fillRequiredFields();

  await tiepNhanPage.fillOptionalFields({
    soCCCD: 'ABC123XYZ',
  });

  await tiepNhanPage.clickTiepNhan();

  const toast = page.locator('[role="alert"]');

  await expect(toast).not.toContainText(/thành công/i);
});


test('TC312 SĐT thiếu số → Không cho tiếp nhận', async ({ page }) => {
  const tiepNhanPage = new TiepNhanPage(page);

  await tiepNhanPage.goto();

  await tiepNhanPage.fillRequiredFields({
    hoTen: 'Auto Fail',
  });

  await tiepNhanPage.sdtInput.fill('090123');

  await tiepNhanPage.clickTiepNhan();

  await expect(tiepNhanPage.sdtInput).toHaveAttribute(
    'aria-invalid',
    'true'
  );
});


test('TC313 Không nhập ngày sinh → Không cho tiếp nhận', async ({ page }) => {
  const tiepNhanPage = new TiepNhanPage(page);

  await tiepNhanPage.goto();

  await tiepNhanPage.hoTenInput.fill('Auto Fail');
  await tiepNhanPage.sdtInput.fill('0901234567');

  await tiepNhanPage.clickTiepNhan();

  await expect(page).toHaveURL(/tiepnhan/);

  await expect(
    page.getByText(/ngày sinh.*bắt buộc/i)
  ).toBeVisible();
});


test('TC314  Tra cứu bệnh nhân theo Mã bệnh nhân', async ({ page }) => {
  const tiepNhanPage = new TiepNhanPage(page);
  const MA_BN = '2602000001';

  await tiepNhanPage.goto();

  await tiepNhanPage.traCuuTheoMaBN(MA_BN);

  // ✅ Business verify: form được fill
  await tiepNhanPage.verifyTraCuuThanhCong();
});


test('TC315  Tra cứu Mã bệnh nhân không tồn tại', async ({ page }) => {
  const tiepNhanPage = new TiepNhanPage(page);

  await tiepNhanPage.goto();

  await tiepNhanPage.traCuuTheoMaBN('9999999999');

  // ❌ Form vẫn trống
  await expect(tiepNhanPage.hoTenInput).toHaveValue('');
});


test('TC316  Tra cứu bệnh nhân theo CCCD/CMND', async ({ page }) => {
  const tiepNhanPage = new TiepNhanPage(page);

  await tiepNhanPage.goto();

  await tiepNhanPage.traCuuTheoCCCD('091222111859');

  // ✅ Verify form được load
  await expect(tiepNhanPage.hoTenInput).not.toHaveValue('');

  
});

});


