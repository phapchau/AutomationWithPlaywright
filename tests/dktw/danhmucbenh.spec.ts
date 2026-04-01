import { test, expect } from '@playwright/test';
import { DanhMucBenhPage } from '../../pages/dktw/DanhMucBenhPage';
import { readExcel } from '../../utils/excelReader';


const testData: any[] = readExcel('data/benh.xlsx','ThemBenh');
const testData1: any[] = readExcel('data/benh.xlsx','CapNhatBenh');
const testData2: any[] = readExcel('data/benh.xlsx','TimKiemBenh');
const testData3: any[] = readExcel('data/benh.xlsx','XoaBenh');
// const testData: any[] = readExcel('data/benh_testcases_full.xlsx');
let lastCreatedName = '';

test.describe('DKTW - Danh mục bệnh', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/benhvien');
    await expect(page).not.toHaveURL(/login/);
  });


test('TC501 - Thêm bệnh', async ({ page }) => {

  const benh = new DanhMucBenhPage(page);

  await benh.goto();
  await benh.waitOverlayGone();

  const unique = Date.now();

  const data = {
    stt: '101',
    ma: `A22.03`,
    ten: `Bệnh test 1`,
    tenEng: `Disease test `,
    nhomChuong: 'Tả',
    nhom: 'Nhiễm khuẩn đường ruột',
    dienGiai: 'Automation test'
  };

  await benh.create(data);

  await benh.searchByTenBenh(data.ten);

  const row = benh.tableRows.filter({ hasText: data.ten });

  await expect(row.first()).toBeVisible();

});




test('TC502 - Tìm kiếm mã bệnh ', async ({ page }) => {

  const benh = new DanhMucBenhPage(page);

  await benh.goto();
  await benh.waitOverlayGone();

  const keyword = 'A01.0';

  await benh.searchByMaBenh(keyword);

  const maCells = benh.tableRows.locator('td:nth-child(2)');

  const values = (await maCells.allTextContents())
    .map(v => v.trim())
    .filter(v => v.length > 0);

  const exactMatches = values.filter(v => v === keyword);

  expect(exactMatches.length).toBe(1);

});



test('TC503 - Tìm theo tên bệnh', async ({ page }) => {

  const benh = new DanhMucBenhPage(page);

  await benh.goto();
  await benh.waitOverlayGone();

  const keyword = 'Bệnh tả';

  await benh.searchByTenBenh(keyword);

  const rows = benh.tableRows.filter({ hasText: keyword });

  await expect(rows.first()).toBeVisible();

});


test('TC504 - Lọc theo nhóm chương bệnh', async ({ page }) => {

  const benh = new DanhMucBenhPage(page);

  await benh.goto();
  await benh.waitOverlayGone();

  await benh.selectOption(benh.nhomChuongBenhSelect, 'Lị Amip');

  await benh.searchButton.click();

  await benh.waitOverlayGone();

  const rows = benh.tableRows.filter({ hasText: 'Lị Amip' });

  await expect(rows.first()).toBeVisible();

});



test('TC505 - Lọc theo nhóm bệnh', async ({ page }) => {

  const benh = new DanhMucBenhPage(page);

  await benh.goto();
  await benh.waitOverlayGone();

  await benh.nhomBenhSelect.click();
  await benh.nhomBenhSelect.fill('Bệnh nấm');

  await page.getByRole('option', { name: /Bệnh nấm/i }).click();

  await benh.searchButton.click();
  await benh.waitOverlayGone();

  const rows = benh.tableRows.filter({ hasText: 'Bệnh nấm' });

  await expect(rows.first()).toBeVisible();

});



test('TC506 - Tìm không có dữ liệu', async ({ page }) => {

  const benh = new DanhMucBenhPage(page);

  await benh.goto();
  await benh.waitOverlayGone();

  const keyword = 'XYZ_KHONG_TON_TAI';

  await benh.searchByTenBenh(keyword);

  const rows = benh.tableRows;

  const count = await rows.count();

  expect(count).toBe(0);

});


test('TC507 - Không nhập mã bệnh', async ({ page }) => {

  const benh = new DanhMucBenhPage(page);

  await benh.goto();

  await benh.addButton.click();

  await expect(benh.modal).toBeVisible();

  await benh.tenBenhInputModal.fill('Bệnh test');

  await benh.tenBenhEngInput.fill('Disease test');

  await benh.submitButton.click();

  await expect(benh.maBenhInputModal)
    .toHaveAttribute('aria-invalid', 'true');

});


test('TC508 - Không nhập tên bệnh', async ({ page }) => {

  const benh = new DanhMucBenhPage(page);

  await benh.goto();

  await benh.addButton.click();

  await expect(benh.modal).toBeVisible();

  await benh.maBenhInputModal.fill('BTEST');

  await benh.tenBenhEngInput.fill('Disease test');

  await benh.submitButton.click();

  await expect(benh.tenBenhInputModal)
    .toHaveAttribute('aria-invalid', 'true');

});



test('TC509 - Cập nhật bệnh', async ({ page }) => {

  const benh = new DanhMucBenhPage(page);

  await benh.goto();

  await benh.updateTen(
    'Bệnh test',
    'Bệnh test update'
  );

});



test('TC510 - Xóa bệnh', async ({ page }) => {

  const benh = new DanhMucBenhPage(page);

  await benh.goto();

  await benh.deleteByTen('Bệnh test update');

});


test('TC511 - Tìm bệnh theo nhiều điều kiện', async ({ page }) => {

  const benh = new DanhMucBenhPage(page);

  await benh.goto();
  await benh.waitOverlayGone();

  await benh.maBenhInput.fill('E00');
  await benh.tenBenhInput.fill('hội chứng thiếu');

  await benh.nhomBenhSelect.click();
  await benh.nhomBenhSelect.fill('Bệnh tuyến giáp');
  await page.getByRole('option', { name: /Bệnh tuyến giáp/i }).click();

  await benh.searchButton.click();
  await benh.waitOverlayGone();

  // tìm trực tiếp ô trong bảng chứa mã bệnh E00
  const maBenhCell = page.locator('table tbody td', {
    hasText: 'E00'
  });

  await expect(maBenhCell.first()).toBeVisible();

});



test.describe('TC512 - Thêm bệnh từ Excel', () => {

  testData.forEach((data, index) => {

    test(`Thêm bệnh thứ ${index + 1}`, async ({ page }) => {

      const benh = new DanhMucBenhPage(page);

      await benh.goto();
      await benh.waitOverlayGone();

      const newData = {
        stt: data.stt,
        ma: `${data.ma}`,
        ten: `${data.ten}`,
        tenEng: data.tenEng,
        nhomChuong: data.nhomChuong,
        nhom: data.nhom,
        dienGiai: data.dienGiai
      };

      await benh.create(newData);

      await benh.searchByTenBenh(newData.ten);

      const row = benh.tableRows.filter({ hasText: newData.ten });

      await expect(row.first()).toBeVisible();

    });

  });

});




test.describe('TC513 - Cập nhật bệnh', () => {

  testData1.forEach((data: any, index: number) => {

    test(`Cập nhật bệnh thứ ${index + 1}`, async ({ page }) => {

      const benh = new DanhMucBenhPage(page);

      await benh.goto();
      await benh.waitOverlayGone();

      // ⚠️ fix undefined + trim an toàn
      const oldName = (data.tenCu || '').toString().trim();
      const newName = (data.tenMoi || '').toString().trim();

      // nếu thiếu data thì skip test (tránh fail bẩn)
      test.skip(!oldName || !newName, 'Thiếu dữ liệu update');

      await benh.updateTen(oldName, newName);

      if ((data.expected || '').toLowerCase() === 'success') {

        await benh.searchByTenBenh(newName);

        const row = benh.tableRows.filter({ hasText: newName });
        await expect(row.first()).toBeVisible();

      } else {

        await benh.verifyErrorMessage();

      }

    });

  });

});
// test.describe('TC513 - Cập nhật bệnh từ Excel', () => {

//   testData.forEach((data, index) => {

//     test(`${data.tcId || index} - Update ${index}`, async ({ page }) => {

//       const action = (data.action || '').trim().toLowerCase();

//       if (action !== 'update') return;

//       const benh = new DanhMucBenhPage(page);

//       await benh.goto();
//       await benh.waitOverlayGone();

//       const oldName =
//         data.ten && data.ten.trim() !== ''
//           ? data.ten
//           : lastCreatedName;

//       if (!oldName) {
//         console.log('⚠️ Không có data để update');
//         return;
//       }

//       const newName =
//         data.tenMoi && data.tenMoi.trim() !== ''
//           ? data.tenMoi
//           : `${oldName}_updated`;

//       await benh.updateTen(oldName, newName);

//       if (data.expected === 'success') {

//         lastCreatedName = newName;

//         await benh.searchByTenBenh(newName);

//         const row = benh.tableRows.filter({ hasText: newName });
//         await expect(row.first()).toBeVisible();
//       }

//     });

//   });

// });



test.describe('TC514 - Tìm kiếm bệnh', () => {

  testData2.forEach((data: any, index: number) => {

    test(`Tìm kiếm bệnh thứ ${index + 1}`, async ({ page }) => {

      const benh = new DanhMucBenhPage(page);

      await benh.goto();
      await benh.waitOverlayGone();

      // xử lý data an toàn
      const keyword = (data.keyword || '').toString().trim();

      // skip nếu thiếu dữ liệu
      test.skip(!keyword, 'Thiếu keyword tìm kiếm');

      await benh.searchByTenBenh(keyword);

      const row = benh.tableRows.filter({ hasText: keyword });

      if ((data.expected || '').toLowerCase() === 'found') {

        await expect(row.first()).toBeVisible();

      } else {

        await expect(row).toHaveCount(0);

      }

    });

  });

});


// test.describe('TC514 - Xóa bệnh từ Excel', () => {

//   testData.forEach((data, index) => {

//     test(`${data.tcId || index} - Delete ${index}`, async ({ page }) => {

//       const action = (data.action || '').trim().toLowerCase();

//       if (action !== 'delete') return;

//       const benh = new DanhMucBenhPage(page);

//       await benh.goto();
//       await benh.waitOverlayGone();

//       const name =
//         data.ten && data.ten.trim() !== ''
//           ? data.ten
//           : lastCreatedName;

//       if (!name) {
//         console.log('⚠️ Không có data để delete');
//         return;
//       }

//       await benh.deleteByTen(name);

//       if (data.expected === 'success') {

//         const row = benh.tableRows.filter({ hasText: name });
//         await expect(row).toHaveCount(0);
//       }

//     });

//   });

// });

test.describe('TC515 - Xóa bệnh', () => {

  testData3.forEach((data: any, index: number) => {

    test(`Xóa bệnh thứ ${index + 1}`, async ({ page }) => {

      const benh = new DanhMucBenhPage(page);

      await benh.goto();
      await benh.waitOverlayGone();

      // xử lý data an toàn
      const name = (data.ten || '').toString().trim();

      // nếu thiếu data thì skip
      test.skip(!name, 'Thiếu dữ liệu delete');

      await benh.deleteByTen(name);

      if ((data.expected || '').toLowerCase() === 'success') {

        // verify đã xóa
        await benh.searchByTenBenh(name);

        const row = benh.tableRows.filter({ hasText: name });
        await expect(row).toHaveCount(0);

      } else {

        // verify lỗi
        await benh.verifyErrorMessage();

      }

    });

  });

});













// test.describe('CRUD Danh mục bệnh từ Excel', () => {

//   testData.forEach((data, index) => {

//     test(`${data.tcId} - ${data.action}`, async ({ page }) => {

//       const benh = new DanhMucBenhPage(page);

//       await page.goto('/benhvien');
//       await expect(page).not.toHaveURL(/login/);

//       await benh.goto();
//       await benh.waitOverlayGone();

//       const action = (data.action || '').toLowerCase();

//       // ================= CREATE =================
//       if (action === 'create') {

//         await benh.create({
//           stt: data.stt,
//           ma: data.ma,
//           ten: data.ten,
//           tenEng: data.tenEng,
//           nhomChuong: data.nhomChuong,
//           nhom: data.nhom,
//           dienGiai: data.dienGiai
//         });

//         // verify
//         if (data.expected === 'success') {
//           await benh.searchByTenBenh(data.ten);

//           const row = benh.tableRows.filter({ hasText: data.ten });
//           await expect(row.first()).toBeVisible();
//         }

//       }

//       // ================= SEARCH =================
//       else if (action === 'search') {

//         if (data.searchMa) {
//           await benh.searchByMaBenh(data.searchMa);
//         }

//         if (data.searchTen) {
//           await benh.searchByTenBenh(data.searchTen);
//         }

//         if (data.expected === 'found') {
//           await expect(benh.tableRows.first()).toBeVisible();
//         } else {
//           await expect(benh.tableRows).toHaveCount(0);
//         }

//       }

//       // ================= UPDATE =================
//       else if (action === 'update') {

//         // ⚠️ vì updateTen yêu cầu phải có data
//         await benh.create({
//           stt: data.stt || '1',
//           ma: `AUTO_${Date.now()}`,
//           ten: data.ten,
//           tenEng: data.tenEng || '',
//           nhomChuong: data.nhomChuong,
//           nhom: data.nhom,
//           dienGiai: data.dienGiai || ''
//         });

//         await benh.updateTen(data.ten, data.tenMoi);

//         if (data.expected === 'success') {
//           await benh.searchByTenBenh(data.tenMoi);

//           const row = benh.tableRows.filter({ hasText: data.tenMoi });
//           await expect(row.first()).toBeVisible();
//         }

//       }

//       // ================= DELETE =================
//       else if (action === 'delete') {

//         // ⚠️ phải tạo trước
//         await benh.create({
//           stt: data.stt || '1',
//           ma: `AUTO_${Date.now()}`,
//           ten: data.ten,
//           tenEng: data.tenEng || '',
//           nhomChuong: data.nhomChuong,
//           nhom: data.nhom,
//           dienGiai: data.dienGiai || ''
//         });

//         await benh.deleteByTen(data.ten);

//         if (data.expected === 'success') {
//           const row = benh.tableRows.filter({ hasText: data.ten });
//           await expect(row).toHaveCount(0);
//         }

//       }

//     });

//   });

// });

});




