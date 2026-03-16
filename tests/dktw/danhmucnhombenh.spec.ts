import { test, expect } from '@playwright/test';
import { DanhMucNhomBenhPage } from '../../pages/dktw/DanhMucNhomBenhPage';

test.describe('DKTW - Danh mục nhóm bệnh', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/benhvien');
    await expect(page).not.toHaveURL(/login/);
  });


test('TC401 - Thêm nhóm bệnh', async ({ page }) => {

  const nhom = new DanhMucNhomBenhPage(page);

  await nhom.goto();
  await nhom.waitOverlayGone();

  const unique = Date.now();

  const data = {

    loaiBenh: 'Bệnh nhiễm trùng và ký sinh trùng',

    stt: '271',

    maNhom: `271`,

    ten: `Bệnh hô hấp `,

    tenEng: `Disease group `,

    dienGiai: 'Automation test'

  };

  await nhom.create(data);

  await nhom.searchByTenNhom(data.ten);

  const row = nhom.tableRows.filter({ hasText: data.ten });

  await expect(row.first()).toBeVisible();

});


// test('TC402 - Tìm theo mã nhóm bệnh', async ({ page }) => {

//   const nhom = new DanhMucNhomBenhPage(page);

//   await nhom.goto();
//   await nhom.waitOverlayGone();

//   const ma = '233';

//   await nhom.searchByMaNhom(ma);

//   const row = nhom.tableRows.filter({ hasText: ma });

//   await expect(row.first()).toBeVisible();

// });



test('TC402 - Tìm theo mã nhóm bệnh', async ({ page }) => {

  const nhom = new DanhMucNhomBenhPage(page);

  await nhom.goto();
  await nhom.waitOverlayGone();

  const keyword = '10';

  await nhom.searchByMaNhom(keyword);

  const rows = nhom.tableRows.filter({ hasText: keyword });

  const count = await rows.count();

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {

    const rowText = await rows.nth(i).textContent();

    expect(rowText).toContain(keyword);

  }

});


test('TC403 - Tìm theo tên nhóm bệnh', async ({ page }) => {

  const nhom = new DanhMucNhomBenhPage(page);

  await nhom.goto();
  await nhom.waitOverlayGone();

  const keyword = 'Bệnh do vi trùng khác';

  await nhom.searchByTenNhom(keyword);

  const rows = nhom.tableRows.filter({ hasText: keyword });

  await expect(rows.first()).toBeVisible();

});


test('TC404 - Tìm không có dữ liệu', async ({ page }) => {

  const nhom = new DanhMucNhomBenhPage(page);

  await nhom.goto();
  await nhom.waitOverlayGone();

  const keyword = 'XYZ_Khong_Ton_Tai';

  await nhom.searchByTenNhom(keyword);

  const rows = nhom.tableRows.filter({ hasText: keyword });

  await expect(rows).toHaveCount(0);

});


test('TC405 - Cập nhật nhóm bệnh', async ({ page }) => {

  const nhom = new DanhMucNhomBenhPage(page);

  await nhom.goto();
  await nhom.waitOverlayGone();

  const tenCu = 'Bệnh hô hấp';
  const tenMoi = `Bệnh hô hấp updated`;

  await nhom.updateTen(tenCu, tenMoi);

  await nhom.searchByTenNhom(tenMoi);

  const row = nhom.tableRows.filter({ hasText: tenMoi });

  await expect(row.first()).toBeVisible();

});



test('TC406 - Xóa nhóm bệnh', async ({ page }) => {

  const nhom = new DanhMucNhomBenhPage(page);

  await nhom.goto();
  await nhom.waitOverlayGone();

  const ten = 'Bệnh hô hấp 1';

  await nhom.deleteByTen(ten);

  await nhom.searchByTenNhom(ten);

  const row = nhom.tableRows.filter({ hasText: ten });

  await expect(row).toHaveCount(0);

});


test('TC407 - Không nhập mã nhóm bệnh', async ({ page }) => {

  const nhom = new DanhMucNhomBenhPage(page);

  await nhom.goto();

  await nhom.addButton.click();
  await expect(nhom.modal).toBeVisible();

  await nhom.tenNhomInputModal.fill('Test nhóm bệnh');
  await nhom.tenEngInput.fill('Disease group test');

  await nhom.submitButton.click();

  await expect(nhom.maNhomInputModal)
    .toHaveAttribute('aria-invalid', 'true');

});


test('TC408 - Không nhập tên nhóm bệnh', async ({ page }) => {

  const nhom = new DanhMucNhomBenhPage(page);

  await nhom.goto();

  await nhom.addButton.click();

  await expect(nhom.modal).toBeVisible();

  await nhom.maNhomInputModal.fill('277');
  await nhom.tenEngInput.fill('Disease group test');

  await nhom.submitButton.click();

  await expect(nhom.tenNhomInputModal)
    .toHaveAttribute('aria-invalid', 'true');

});


test('TC409 - Không nhập tên tiếng anh', async ({ page }) => {

  const nhom = new DanhMucNhomBenhPage(page);

  await nhom.goto();

  await nhom.addButton.click();

  await expect(nhom.modal).toBeVisible();

  await nhom.maNhomInputModal.fill('278');
  await nhom.tenNhomInputModal.fill('Nhóm bệnh test');

  await nhom.submitButton.click();

  await expect(nhom.tenEngInput)
    .toHaveAttribute('aria-invalid', 'true');

});



test('TC410 - Thêm trùng mã nhóm bệnh', async ({ page }) => {

  const nhom = new DanhMucNhomBenhPage(page);

  await nhom.goto();

  const data = {
    loaiBenh: 'Bệnh nhiễm trùng và ký sinh trùng',
    stt: '1',
    maNhom: '3',
    ten: 'Test duplicate',
    tenEng: 'Duplicate test',
    dienGiai: 'Automation'
  };

  await nhom.create(data);

  const notification = page.locator('.mantine-Notification-root');

  await expect(notification.last()).toContainText(/tồn tại|được sử dụng/i);

});

test('TC411 - Hủy thêm nhóm bệnh', async ({ page }) => {

  const nhom = new DanhMucNhomBenhPage(page);

  await nhom.goto();

  await nhom.addButton.click();

  await expect(nhom.modal).toBeVisible();

  await page.getByRole('button', { name: /hủy/i }).click();

  await expect(nhom.modal).toBeHidden();

});


test('TC412 - Reset tìm kiếm', async ({ page }) => {

  const nhom = new DanhMucNhomBenhPage(page);

  await nhom.goto();

  await nhom.searchByTenNhom('U ác tính của xương và sụn');

  await page.getByRole('button').nth(1).click();

  await nhom.waitOverlayGone();

  await expect(nhom.tableRows.first()).toBeVisible();

});
});