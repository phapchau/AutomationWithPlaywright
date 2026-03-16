import { test, expect } from '@playwright/test';
import { DanhMucNhomChuongBenhPage } from '../../pages/dktw/DanhMucNhomChuongBenhPage';

test.describe('DKTW - Danh mục nhóm chương bệnh', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/benhvien');
    await expect(page).not.toHaveURL(/login/);
  });



test('TC201 - Thêm nhóm chương bệnh', async ({ page }) => {

  const nhom = new DanhMucNhomChuongBenhPage(page);

  await nhom.goto();
  await nhom.waitOverlayGone();

  const unique = Date.now();

  const data = {
    chuongBenh: 'Khối U',
    stt: '319',
    maNhom: `N319`,
    ten: `Nhóm bệnh test `,
    tenEng: `Disease group test `,
    dienGiai: 'Automation test'
  };

  await nhom.create(data);

  await nhom.searchByTenNhom(data.ten);

  const row = nhom.tableRows.filter({ hasText: data.ten });

  await expect(row.first()).toBeVisible();

});



test('TC202 - Tìm theo mã bệnh ', async ({ page }) => {

  const nhom = new DanhMucNhomChuongBenhPage(page);

  await nhom.goto();
  await nhom.waitOverlayGone();

  const maBenh = 'A80';

  await nhom.searchByMaBenh(maBenh);

  const rows = nhom.tableRows;
  await expect(rows.first()).toBeVisible();

  const row = rows.filter({ hasText: maBenh });
  await expect(row.first()).toBeVisible();

});


test('TC203 - Tìm theo mã nhóm chương bệnh', async ({ page }) => {

  const nhom = new DanhMucNhomChuongBenhPage(page);

  await nhom.goto();
  await nhom.waitOverlayGone();

  const maNhom = 'N27';

  await nhom.searchByMaNhom(maNhom);

  const row = nhom.tableRows.filter({ hasText: maNhom });

  await expect(row.first()).toBeVisible();

});



test('TC204 - Tìm theo tên nhóm chương bệnh', async ({ page }) => {

  const nhom = new DanhMucNhomChuongBenhPage(page);

  await nhom.goto();
  await nhom.waitOverlayGone();

  const ten = 'Lị Amip';

  await nhom.searchByTenNhom(ten);

  const row = nhom.tableRows.filter({ hasText: ten });

  await expect(row.first()).toBeVisible();

});


test('TC207 - Tìm theo 3 điều kiện', async ({ page }) => {

  const nhom = new DanhMucNhomChuongBenhPage(page);

  await nhom.goto();
  await nhom.waitOverlayGone();

  const maBenh = 'A01';
  const maNhom = 'N2';
  const tenNhom = 'Thương hàn';

  // nhập 3 điều kiện
  await nhom.maBenhInput.fill(maBenh);
  await nhom.maNhomInput.fill(maNhom);
  await nhom.tenNhomInput.fill(tenNhom);

  await nhom.searchButton.click();
  await nhom.waitOverlayGone();

  const row = nhom.tableRows.filter({ hasText: maNhom });

  await expect(row.first()).toBeVisible();
  await expect(row.first()).toContainText(tenNhom);

});



test('TC208 - Cập nhật nhóm chương bệnh', async ({ page }) => {

  const nhom = new DanhMucNhomChuongBenhPage(page);

  await nhom.goto();
  await nhom.waitOverlayGone();

  const tenCu = 'Nhóm bệnh test';
  const tenMoi = 'Nhóm bệnh test updated';

  await nhom.updateTen(tenCu, tenMoi);

  await nhom.waitOverlayGone();

  await nhom.searchByTenNhom(tenMoi);

  const row = nhom.tableRows.filter({ hasText: tenMoi });

  await expect(row.first()).toBeVisible();

});


test('TC209 - Xóa nhóm chương bệnh', async ({ page }) => {

  const nhom = new DanhMucNhomChuongBenhPage(page);

  await nhom.goto();
  await nhom.waitOverlayGone();

  const ten = 'Nhóm Test';

  await nhom.deleteByTen(ten);

  await nhom.waitOverlayGone();

  await nhom.searchByTenNhom(ten);

  await expect(
    nhom.tableRows.filter({ hasText: ten })
  ).toHaveCount(0);

});


test('TC1009 - Tìm 3 điều kiện không có dữ liệu', async ({ page }) => {

  const nhom = new DanhMucNhomChuongBenhPage(page);

  await nhom.goto();
  await nhom.waitOverlayGone();

  await nhom.maBenhInput.fill('ZZZ');
  await nhom.maNhomInput.fill('ABC999');
  await nhom.tenNhomInput.fill('Không tồn tại');

  await nhom.searchButton.click();
  await nhom.waitOverlayGone();

  await expect(nhom.tableRows).toHaveCount(0);

});
});