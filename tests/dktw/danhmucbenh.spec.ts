import { test, expect } from '@playwright/test';
import { DanhMucBenhPage } from '../../pages/dktw/DanhMucBenhPage';

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


test('TC502 - Tìm chính xác mã bệnh A01.0', async ({ page }) => {

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

});