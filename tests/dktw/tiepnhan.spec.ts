

// import { test, expect } from '@playwright/test';
// import { LoginPage } from '../../pages/dktw/LoginPage';
// import { TiepNhanPage } from '../../pages/dktw/TiepNhanPage';
// import { createCaptchaSolver } from '../../utils/captcha-solver';
// import { readExcel } from '../../utils/excelReader';
// import users from '../../data/dktw/users.json';



// const testData: any[] = readExcel('data/tiepnhan.xlsx');

// test.describe('DKTW  Tiếp nhận bệnh nhân', () => {
//   test.beforeEach(async ({ page }) => {
//     // 👉 vào trang sau khi đã login bằng storageState
//     await page.goto('/benhvien');

//     // ✅ đảm bảo session còn hiệu lực
//     await expect(page).not.toHaveURL(/user\/login/, {
//       timeout: 15000,
//     });

//     // (optional) chờ SPA ổn định
//     await page.waitForTimeout(300);
//   });

//  testData.forEach((data, index) => {
  
// // test('TC300 - Nhập đầy đủ thông tin và tiếp nhận thành công', async ({ page }) => {

// //   const tiepNhanPage = new TiepNhanPage(page);

// //   await tiepNhanPage.goto();

// //   const hoTen = `Auto ${Date.now()}`;
// //   const soCCCD = `09${Date.now()}`;

// //   await tiepNhanPage.fillRequiredFields({ hoTen });

// //   await tiepNhanPage.fillOptionalFields({
// //     soCCCD,
// //     ngheNghiep: 'Công nhân',
// //     noiLamViec: 'Công ty ABCX',
// //     trinhDoVanHoa: '12/12',
// //     diaChi: '123 Lê Lợi',
// //     ngayCap: '01/03/2020',
// //     noiCap: 'Công an Quận 1',
// //   });

// //   await tiepNhanPage.clickTiepNhan();

// //   // verify toast
// //   await tiepNhanPage.verifyCapNhatSuccessToast();

// //   // chờ UI render
// //   await page.waitForTimeout(1500);

// //   // verify bệnh nhân xuất hiện
// //   const benhNhanMoi = page.locator('span', {
// //     hasText: new RegExp(`${hoTen}.*tuổi`, 'i')
// //   }).first();

// //   await expect(benhNhanMoi).toBeVisible({ timeout: 20000 });

// // });

//   test(`TC300 - Tiếp nhận bệnh nhân nhập dầy đủ từ Excel ${index + 1}`, async ({ page }) => {

//     const tiepNhanPage = new TiepNhanPage(page);

//     await tiepNhanPage.goto();

//     await tiepNhanPage.fillRequiredFields({
//       hoTen: data.hoTen,
//     });

//     await tiepNhanPage.fillOptionalFields({
//       soCCCD: data.soCCCD,
//       ngheNghiep: data.ngheNghiep,
//       noiLamViec: data.noiLamViec,
//       diaChi: data.diaChi,
//       ngayCap: data.ngayCap,
//       noiCap: data.noiCap,
//     });

//     await tiepNhanPage.clickTiepNhan();

//     await tiepNhanPage.verifyCapNhatSuccessToast();

//   });



// // test(`TC301 - Nhập thông tin bắt buộc từ Excel ${index + 1}`, async ({ page }) => {

// //       const tiepNhanPage = new TiepNhanPage(page);

// //       await tiepNhanPage.goto();

// //       const hoTen = `${data.hoTen} ${Date.now()}`;

// //       // nhập các field bắt buộc
// //       await tiepNhanPage.fillRequiredFields({
// //         hoTen,
// //         sdt: data.sdt
// //       });

// //       // CCCD bắt buộc
// //       await page.locator('input[placeholder="Nhập số CCCD/CMND"]')
// //         .fill(data.soCCCD);

// //       // ngày cấp
// //       const ngayCap = page.locator(
// //         'input[data-path="benhnhan.benhnhanCmndNgaycap"]'
// //       );

// //       await ngayCap.fill(data.ngayCap);
// //       await ngayCap.press('Enter');

// //       // nơi cấp
// //       await page.locator(
// //         'input[data-path="benhnhan.benhnhanCmndNoicap"]'
// //       ).fill(data.noiCap);

// //       await tiepNhanPage.clickTiepNhan();

// //       await tiepNhanPage.verifyCapNhatSuccessToast();

// //       // verify bệnh nhân xuất hiện
// //       const benhNhanMoi = page.locator('span', {
// //         hasText: new RegExp(`${hoTen}.*tuổi`, 'i')
// //       }).first();

// //       await expect(benhNhanMoi).toBeVisible({ timeout: 20000 });

// //     });
 

//  });


//  testData.forEach((data, index) => {

//     test(`TC301 - Nhập các thông tin bắt buộc từ Excel ${index + 1}`, async ({ page }) => {

//       const tiepNhanPage = new TiepNhanPage(page);

//       const hoTen = `${data.hoTen} Required ${Date.now()}`;

//       await tiepNhanPage.fillRequiredFields({
//         hoTen
//       });

//       await page.locator('input[placeholder="Nhập số CCCD/CMND"]')
//         .fill(String(data.soCCCD));

//       const ngayCap = page.locator(
//         'input[data-path="benhnhan.benhnhanCmndNgaycap"]'
//       );

//       await ngayCap.fill(String(data.ngayCap));
//       await ngayCap.press('Enter');

//       await page.locator(
//         'input[data-path="benhnhan.benhnhanCmndNoicap"]'
//       ).fill(String(data.noiCap));

//       await tiepNhanPage.clickTiepNhan();

//       await tiepNhanPage.verifyCapNhatSuccessToast();

//     });

//   });


 
// // test('TC301 - Chỉ nhập thông tin bắt buộc', async ({ page }) => {

// //   const tiepNhanPage = new TiepNhanPage(page);

// //   await tiepNhanPage.goto();

// //   // tên duy nhất để tránh trùng dữ liệu
// //   const hoTen = `Auto Required ${Date.now()}`;

// //   // nhập trường bắt buộc
// //   await tiepNhanPage.fillRequiredFields({
// //     hoTen,
// //   });

// //   // bấm tiếp nhận
// //   await tiepNhanPage.clickTiepNhan();

// //   // 1️⃣ verify toast thành công
// //   await tiepNhanPage.verifyCapNhatSuccessToast();

// //   // 2️⃣ chờ UI cập nhật danh sách
// //   await page.waitForLoadState('networkidle');

// //   // 3️⃣ verify bệnh nhân xuất hiện trong danh sách
// //   const benhNhanMoi = page.locator('span', {
// //     hasText: new RegExp(`${hoTen}.*tuổi`, 'i')
// //   }).first();

// //   await expect(benhNhanMoi).toBeVisible({ timeout: 20000 });

// // });



// test('TC302 Không nhập họ tên → Không cho tiếp nhận', async ({ page }) => {
//   const tiepNhanPage = new TiepNhanPage(page);

//   await tiepNhanPage.goto();

//   await tiepNhanPage.ngaySinhInput.fill('01/12/2005');
//   await tiepNhanPage.sdtInput.fill('0901234567');
//   await tiepNhanPage.gioiTinhNam.check();

//   await tiepNhanPage.selectMantineByName(/Quốc tịch/i, 'Việt Nam');
//   await tiepNhanPage.selectMantineByName(/Tỉnh.*Thành/i, 'Thành phố Hồ Chí Minh');
//   await tiepNhanPage.selectMantineByName(/Phường.*Xã/i, 'Xã Bình Châu');
//   await tiepNhanPage.selectMantineByName(/Dân tộc/i, 'Kinh');
//   await tiepNhanPage.selectMantineByName(/Vào khoa/i, 'Gây mê hồi sức');
//   await tiepNhanPage.selectMantineByName(/Vào phòng/i, 'Buồng GMHS 1');

//   await tiepNhanPage.clickTiepNhan();

//   await expect(page).toHaveURL(/tiepnhan/i);

//   await expect(tiepNhanPage.hoTenInput)
//     .toHaveAttribute('aria-invalid', 'true');

//   const toast = page.locator(
//     'div[role="alert"].mantine-Notifications-notification'
//   );

//   await expect(toast).toHaveCount(0);
// });
  



// test('TC303 SĐT thiếu số → Không cho tiếp nhận', async ({ page }) => {
//   const tiepNhanPage = new TiepNhanPage(page);

//   await tiepNhanPage.goto();

//   await tiepNhanPage.hoTenInput.fill('Auto Test');
//   await tiepNhanPage.ngaySinhInput.fill('01/09/1997');
//   await tiepNhanPage.gioiTinhNam.check();

//   await tiepNhanPage.selectMantineByName(/Quốc tịch/i, 'Việt Nam');
//   await tiepNhanPage.selectMantineByName(/Tỉnh.*Thành/i, 'Thành phố Hồ Chí Minh');
//   await tiepNhanPage.selectMantineByName(/Phường.*Xã/i, 'Xã Bình Châu');
//   await tiepNhanPage.selectMantineByName(/Dân tộc/i, 'Kinh');
//   await tiepNhanPage.selectMantineByName(/Vào khoa/i, 'Gây mê hồi sức');
//   await tiepNhanPage.selectMantineByName(/Vào phòng/i, 'Buồng GMHS 1');

//   await tiepNhanPage.sdtInput.fill('090123');

//   await expect(tiepNhanPage.sdtInput)
//     .toHaveAttribute('aria-invalid', 'true');

//   await expect(tiepNhanPage.tiepNhanButton)
//     .toBeDisabled();
// });


 
// test('TC304 Nhập trùng số CCCD → Không cho tiếp nhận', async ({ page }) => {
//   const tiepNhanPage = new TiepNhanPage(page);

//   await tiepNhanPage.goto();

//   await tiepNhanPage.fillRequiredFields();

//   await tiepNhanPage.fillOptionalFields({
//     soCCCD: '089204018469',
//     ngheNghiep: 'Kỹ sư',
//   });

//   await tiepNhanPage.clickTiepNhan();

//   await expect(page).toHaveURL(/tiepnhan/i);

//   const errorToast = page.locator(
//     'div[role="alert"].mantine-Notifications-notification'
//   );

//   await expect(errorToast).toContainText(/cccd|tồn tại|trùng/i);
// });


//   test('TC305 - Tìm kiếm Mã BN và chọn cập nhật thông tin bệnh nhân, bấm hủy', async ({ page }) => {
//     const tiepNhanPage = new TiepNhanPage(page);

//     const MA_BN = '2603000001';

//     await tiepNhanPage.goto();

//     // await tiepNhanPage.searchMaBN(MA_BN);
//     await tiepNhanPage.searchByMaBN(MA_BN);
//     await tiepNhanPage.openHoSoByMaBN(MA_BN);
//     await tiepNhanPage.clickCapNhatThongTinBenhNhan();

//     await tiepNhanPage.clickHuyThaoTac();

//     await expect(
//       page.getByRole('button', { name: /cập nhật thông tin bệnh nhân/i })
//     ).toBeVisible({ timeout: 15000 });
//   });



//   test('TC306  Tìm Mã BN chọn cập nhật SĐT → lưu thành công', async ({ page }) => {
//     const tiepNhanPage = new TiepNhanPage(page);

//     const MA_BN = '2603000001';
//     const NEW_PHONE = '0901234567';

//     await tiepNhanPage.goto();

//     // await tiepNhanPage.searchMaBN(MA_BN);
//     await tiepNhanPage.searchByMaBN(MA_BN);
//     await tiepNhanPage.openHoSoByMaBN(MA_BN);
//     await tiepNhanPage.clickCapNhatThongTinBenhNhan();

//     await tiepNhanPage.updateSoDienThoai(NEW_PHONE);

//     await tiepNhanPage.clickLuuCapNhat();
//     await tiepNhanPage.verifyCapNhatSuccessToast();
//   });




//   test('TC307  Tìm Mã BN → mở hồ sơ → cập nhật SĐT → hủy thao tác', async ({ page }) => {
//     const tiepNhanPage = new TiepNhanPage(page);

//     const MA_BN = '2603000001';
//     const NEW_PHONE = '0901234567';

//     await tiepNhanPage.goto();

//     // await tiepNhanPage.searchMaBN(MA_BN);
//     await tiepNhanPage.searchByMaBN(MA_BN);
//     await tiepNhanPage.openHoSoByMaBN(MA_BN);
//     await tiepNhanPage.clickCapNhatThongTinBenhNhan();

//     await tiepNhanPage.updateSoDienThoai(NEW_PHONE);

//     await tiepNhanPage.clickHuyThaoTac();

//     await expect(
//       page.getByRole('button', { name: /cập nhật thông tin bệnh nhân/i })
//     ).toBeVisible({ timeout: 15000 });
//   });




//   test('TC308  Tìm kiếm hồ sơ theo CCCD (input chung)', async ({ page }) => {
//     const tiepNhanPage = new TiepNhanPage(page);

//     const CCCD = '089204018469'; // ✅ phải là CCCD có tồn tại

//     await tiepNhanPage.goto();

//     // await tiepNhanPage.searchMaBN(CCCD);
//     await tiepNhanPage.searchByKeyword(CCCD);

//     await expect(page.getByText(new RegExp(CCCD))).toBeVisible({ timeout: 15000 });
//   });



//   test('TC309  Tìm kiếm hồ sơ theo SĐT (input chung)', async ({ page }) => {
//     const tiepNhanPage = new TiepNhanPage(page);

//     const SDT = '0332872278'; // ✅ phải là SĐT có tồn tại

//     await tiepNhanPage.goto();

//     // await tiepNhanPage.searchMaBN(SDT);
//     await tiepNhanPage.searchByKeyword(SDT);

//     await expect(page.getByText(new RegExp(SDT))).toBeVisible({ timeout: 15000 });
//   });



//   test('TC310  Tìm kiếm hồ sơ theo Mã BN (input chung)', async ({ page }) => {
//   const tiepNhanPage = new TiepNhanPage(page);

//   const MA_BN = '2603000001'; // ✅ Mã BN có tồn tại

//   await tiepNhanPage.goto();

//   // 🔍 tìm bằng input chung
//   await tiepNhanPage.searchByMaBN(MA_BN);

//   // ✅ verify thấy hồ sơ
//   await expect(
//     page.getByText(new RegExp(`Mã BN:\\s*${MA_BN}`))
//   ).toBeVisible({ timeout: 15000 });
// });


 
// test('TC311 CCCD chứa chữ → Không cho tiếp nhận', async ({ page }) => {
//   const tiepNhanPage = new TiepNhanPage(page);

//   await tiepNhanPage.goto();

//   await tiepNhanPage.fillRequiredFields();

//   await tiepNhanPage.fillOptionalFields({
//     soCCCD: 'ABC123XYZ',
//   });

//   await tiepNhanPage.clickTiepNhan();

//   await expect(page).toHaveURL(/tiepnhan/i);

//   const toast = page.locator(
//     'div[role="alert"].mantine-Notifications-notification'
//   );

//   await expect(toast).toHaveCount(0);
// });


// test('TC312 SĐT thiếu số → Không cho tiếp nhận', async ({ page }) => {
//   const tiepNhanPage = new TiepNhanPage(page);

//   await tiepNhanPage.goto();

//   await tiepNhanPage.fillRequiredFields({
//     hoTen: 'Auto Fail',
//   });

//   await tiepNhanPage.sdtInput.fill('090123');

//   await tiepNhanPage.clickTiepNhan();

//   await expect(tiepNhanPage.sdtInput).toHaveAttribute(
//     'aria-invalid',
//     'true'
//   );
// });


// test('TC313 Không nhập ngày sinh → Không cho tiếp nhận', async ({ page }) => {
//   const tiepNhanPage = new TiepNhanPage(page);

//   await tiepNhanPage.goto();

//   await tiepNhanPage.hoTenInput.fill('Auto Fail');
//   await tiepNhanPage.sdtInput.fill('0901234567');

//   await tiepNhanPage.clickTiepNhan();

//   await expect(page).toHaveURL(/tiepnhan/);

//   await expect(
//     page.getByText(/ngày sinh.*bắt buộc/i)
//   ).toBeVisible();
// });


// test('TC314  Tra cứu bệnh nhân theo Mã bệnh nhân', async ({ page }) => {
//   const tiepNhanPage = new TiepNhanPage(page);
//   const MA_BN = '2603000001';

//   await tiepNhanPage.goto();

//   await tiepNhanPage.traCuuTheoMaBN(MA_BN);

//   // ✅ Business verify: form được fill
//   await tiepNhanPage.verifyTraCuuThanhCong();
// });


// test('TC315  Tra cứu Mã bệnh nhân không tồn tại', async ({ page }) => {
//   const tiepNhanPage = new TiepNhanPage(page);

//   await tiepNhanPage.goto();

//   await tiepNhanPage.traCuuTheoMaBN('9999999999');

//   // ❌ Form vẫn trống
//   await expect(tiepNhanPage.hoTenInput).toHaveValue('');
// });


// test('TC316  Tra cứu bệnh nhân theo CCCD/CMND', async ({ page }) => {
//   const tiepNhanPage = new TiepNhanPage(page);

//   await tiepNhanPage.goto();

//   await tiepNhanPage.traCuuTheoCCCD('089204018469');

//   // ✅ Verify form được load
//   await expect(tiepNhanPage.hoTenInput).not.toHaveValue('');

  
// });

// });







import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/dktw/LoginPage';
import { TiepNhanPage } from '../../pages/dktw/TiepNhanPage';
import { createCaptchaSolver } from '../../utils/captcha-solver';
import { readExcel } from '../../utils/excelReader';
import users from '../../data/dktw/users.json';

const testData: any[] = readExcel('data/tiepnhan.xlsx');

test.describe('DKTW Tiếp nhận bệnh nhân', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/benhvien');

    await expect(page).not.toHaveURL(/user\/login/, {
      timeout: 15000,
    });
  });

  // ===============================
  // TC300 - Data từ Excel (đầy đủ thông tin)
  // ===============================
  test.describe('TC300 - Tiếp nhận bệnh nhân đầy đủ thông tin từ Excel', () => {

    testData.forEach((data, index) => {

      test(`Nhập thông tin người ${index + 1}`, async ({ page }) => {

        const tiepNhanPage = new TiepNhanPage(page);

        await tiepNhanPage.goto();

        await tiepNhanPage.fillRequiredFields({
          hoTen: data.hoTen,
        });

        await tiepNhanPage.fillOptionalFields({
          soCCCD: data.soCCCD,
          ngheNghiep: data.ngheNghiep,
          noiLamViec: data.noiLamViec,
          diaChi: data.diaChi,
          ngayCap: data.ngayCap,
          noiCap: data.noiCap,
        });

        await tiepNhanPage.clickTiepNhan();
        await tiepNhanPage.verifyCapNhatSuccessToast();

      });

    });

  });


  // ===============================
  // TC301 - Chỉ nhập thông tin bắt buộc
  // ===============================
  test.describe('TC301 - Nhập thông tin bắt buộc từ Excel', () => {

  testData.forEach((data, index) => {

    test(`Nhập thông tin người ${index + 1}`, async ({ page }) => {

      const tiepNhanPage = new TiepNhanPage(page);

      await tiepNhanPage.goto();

      // const hoTen = `${data.hoTen} Required ${Date.now()}_${index}`;
      const hoTen = `${data.hoTen}`;

      // chỉ nhập các field bắt buộc
      await tiepNhanPage.fillRequiredFields({ hoTen });

      // tiếp nhận
      await tiepNhanPage.clickTiepNhan();

      // verify thành công
      await tiepNhanPage.verifyCapNhatSuccessToast();

    });

  });

});

  // ===============================
  // TC302 → TC313 Validation
  // ===============================

  test('TC302 Không nhập họ tên → Không cho tiếp nhận', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    await tiepNhanPage.goto();

    await tiepNhanPage.ngaySinhInput.fill('01/12/2005');
    await tiepNhanPage.sdtInput.fill('0901234567');
    await tiepNhanPage.gioiTinhNam.check();

    await tiepNhanPage.selectMantineByName(/Quốc tịch/i, 'Việt Nam');
    await tiepNhanPage.selectMantineByName(/Tỉnh.*Thành/i, 'Thành phố Hồ Chí Minh');
    await tiepNhanPage.selectMantineByName(/Phường.*Xã/i, 'Xã Bình Châu');
    await tiepNhanPage.selectMantineByName(/Dân tộc/i, 'Kinh');
    await tiepNhanPage.selectMantineByName(/Vào khoa/i, 'Gây mê hồi sức');
    await tiepNhanPage.selectMantineByName(/Vào phòng/i, 'Buồng GMHS 1');

    await tiepNhanPage.clickTiepNhan();

    await expect(tiepNhanPage.hoTenInput)
      .toHaveAttribute('aria-invalid', 'true');
  });


  test('TC303 SĐT thiếu số → Không cho tiếp nhận', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    await tiepNhanPage.goto();

    await tiepNhanPage.hoTenInput.fill('Auto Test');
    await tiepNhanPage.ngaySinhInput.fill('01/09/1997');
    await tiepNhanPage.gioiTinhNam.check();

    await tiepNhanPage.sdtInput.fill('090123');

    await expect(tiepNhanPage.sdtInput)
      .toHaveAttribute('aria-invalid', 'true');

    await expect(tiepNhanPage.tiepNhanButton)
      .toBeDisabled();
  });


  test('TC304 Nhập trùng số CCCD → Không cho tiếp nhận', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    await tiepNhanPage.goto();

    await tiepNhanPage.fillRequiredFields();

    await tiepNhanPage.fillOptionalFields({
      soCCCD: '089204018469',
      ngheNghiep: 'Kỹ sư',
    });

    await tiepNhanPage.clickTiepNhan();

    const errorToast = page.locator(
      'div[role="alert"].mantine-Notifications-notification'
    );

    await expect(errorToast).toContainText(/cccd|tồn tại|trùng/i);
  });


  // ===============================
  // TC305 → TC310 Search & Update
  // ===============================

  test('TC305 Tìm Mã BN → cập nhật → hủy', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);
    const MA_BN = '2603000001';

    await tiepNhanPage.goto();

    await tiepNhanPage.searchByMaBN(MA_BN);
    await tiepNhanPage.openHoSoByMaBN(MA_BN);
    await tiepNhanPage.clickCapNhatThongTinBenhNhan();

    await tiepNhanPage.clickHuyThaoTac();

    await expect(
      page.getByRole('button', { name: /cập nhật thông tin bệnh nhân/i })
    ).toBeVisible();
  });


  test('TC306 Cập nhật SĐT → lưu thành công', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    await tiepNhanPage.goto();

    await tiepNhanPage.searchByMaBN('2603000001');
    await tiepNhanPage.openHoSoByMaBN('2603000001');
    await tiepNhanPage.clickCapNhatThongTinBenhNhan();

    await tiepNhanPage.updateSoDienThoai('0901234567');

    await tiepNhanPage.clickLuuCapNhat();
    await tiepNhanPage.verifyCapNhatSuccessToast();
  });


  test('TC307 Cập nhật SĐT → hủy thao tác', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    await tiepNhanPage.goto();

    await tiepNhanPage.searchByMaBN('2603000001');
    await tiepNhanPage.openHoSoByMaBN('2603000001');
    await tiepNhanPage.clickCapNhatThongTinBenhNhan();

    await tiepNhanPage.updateSoDienThoai('0901234567');

    await tiepNhanPage.clickHuyThaoTac();
  });


  test('TC308 Tìm kiếm theo CCCD', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    await tiepNhanPage.goto();

    await tiepNhanPage.searchByKeyword('089204018469');

    await expect(page.getByText(/089204018469/)).toBeVisible();
  });


  test('TC309 Tìm kiếm theo SĐT', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    await tiepNhanPage.goto();

    await tiepNhanPage.searchByKeyword('0332872278');

    await expect(page.getByText(/0332872278/)).toBeVisible();
  });


  test('TC310 Tìm kiếm theo Mã BN', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    await tiepNhanPage.goto();

    await tiepNhanPage.searchByMaBN('2603000001');

    await expect(
      page.getByText(/Mã BN:\s*2603000001/)
    ).toBeVisible();
  });


  // ===============================
  // TC314 → TC316 Tra cứu
  // ===============================

  test('TC314 Tra cứu theo Mã BN', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    await tiepNhanPage.goto();

    await tiepNhanPage.traCuuTheoMaBN('2603000001');

    await tiepNhanPage.verifyTraCuuThanhCong();
  });


  test('TC315 Tra cứu Mã BN không tồn tại', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    await tiepNhanPage.goto();

    await tiepNhanPage.traCuuTheoMaBN('9999999999');

    await expect(tiepNhanPage.hoTenInput).toHaveValue('');
  });


  test('TC316 Tra cứu theo CCCD', async ({ page }) => {
    const tiepNhanPage = new TiepNhanPage(page);

    await tiepNhanPage.goto();

    await tiepNhanPage.traCuuTheoCCCD('089204018469');

    await expect(tiepNhanPage.hoTenInput).not.toHaveValue('');
  });

});