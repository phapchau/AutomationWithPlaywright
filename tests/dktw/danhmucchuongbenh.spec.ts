import { test, expect } from '@playwright/test';
import { DanhMucChuongBenhPage } from '../../pages/dktw/DanhMucChuongBenhPage';

test.describe('DKTW - Danh mục chương bệnh', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/benhvien');
    await expect(page).not.toHaveURL(/login/);
  });



test('TC901 - Thêm chương bệnh mới', async ({ page }) => {

  const chuong = new DanhMucChuongBenhPage(page);

  await chuong.goto();
  await chuong.waitOverlayGone();

  const unique = Date.now();

  const data = {
    stt: '29',
    maChuong: `C${unique}`,
    ten: `Bệnh xương khớp `,
    tenEng: `joint bone test `,
    maBenh: 'X01-B98',
    dienGiai: 'Automation test'
  };

  await chuong.create(data);

  await chuong.waitOverlayGone();

  await chuong.searchByTenChuong(data.ten);

  const row = chuong.tableRows.filter({ hasText: data.maChuong });

  await expect(row.first()).toBeVisible();
  await expect(row.first()).toContainText(data.ten);

});



test('TC902 - Tìm kiếm theo mã bệnh ', async ({ page }) => {

  const chuong = new DanhMucChuongBenhPage(page);

  await chuong.goto();
  await chuong.waitOverlayGone();

  const maBenh = 'F00-F99';

  await chuong.searchByMaBenh(maBenh);

  const rows = chuong.tableRows;

  await expect(rows.first()).toBeVisible();

  const row = rows.filter({ hasText: maBenh });

  await expect(row.first()).toBeVisible();

});
  


test('TC903 - Tìm kiếm theo mã chương bệnh', async ({ page }) => {

  const chuong = new DanhMucChuongBenhPage(page);

  await chuong.goto();
  await chuong.waitOverlayGone();

  const maChuong = 'C4';

  await chuong.searchByMaChuong(maChuong);

  const rows = chuong.tableRows;

  await expect(rows.first()).toBeVisible();

  const row = rows.filter({ hasText: maChuong });

  await expect(row.first()).toBeVisible();

});



test('TC904 - Tìm kiếm theo tên chương bệnh', async ({ page }) => {

  const chuong = new DanhMucChuongBenhPage(page);

  await chuong.goto();
  await chuong.waitOverlayGone();

  const ten = 'Khối U';

  await chuong.searchByTenChuong(ten);

  const rows = chuong.tableRows;

  await expect(rows.first()).toBeVisible();

  const row = rows.filter({ hasText: ten });

  await expect(row.first()).toBeVisible();

});


test('TC905 - Tìm kiếm không có dữ liệu', async ({ page }) => {

  const chuong = new DanhMucChuongBenhPage(page);

  await chuong.goto();
  await chuong.waitOverlayGone();

  const keyword = 'XYZ-KhongTonTai';

  await chuong.searchByTenChuong(keyword);

  const rows = chuong.tableRows;

  await expect(rows).toHaveCount(0);

});



test('TC906 - Tìm kiếm theo nhiều điều kiện', async ({ page }) => {

  const chuong = new DanhMucChuongBenhPage(page);

  await chuong.goto();
  await chuong.waitOverlayGone();

  const maBenh = 'C00-D48';
  const maChuong = 'C2';
  const tenChuong = 'Khối U';

  // nhập 3 điều kiện
  await chuong.maBenhInput.fill(maBenh);
  await chuong.maChuongInput.fill(maChuong);
  await chuong.tenChuongInput.fill(tenChuong);

  await chuong.searchButton.click();
  await chuong.waitOverlayGone();

  const row = chuong.tableRows.filter({
    hasText: maChuong
  });

  await expect(row.first()).toBeVisible();
  await expect(row.first()).toContainText(tenChuong);
});



test('TC907 - Cập nhật chương bệnh', async ({ page }) => {

  const chuong = new DanhMucChuongBenhPage(page);

  await chuong.goto();
  await chuong.waitOverlayGone();

  const tenCu = 'Bệnh xương khớp';
  const tenMoi = 'Bệnh xương khớp updated';

  // tìm đúng bản ghi
  await chuong.searchByTenChuong(tenCu);

  const row = chuong.tableRows.filter({ hasText: tenCu });

  await expect(row.first()).toBeVisible();

  // cập nhật
  await chuong.updateTen(tenCu, tenMoi);

  await chuong.waitOverlayGone();

  // xác nhận cập nhật
  await chuong.searchByTenChuong(tenMoi);

  const updatedRow = chuong.tableRows.filter({ hasText: tenMoi });

  await expect(updatedRow.first()).toBeVisible();

});


test('TC908 - Xóa chương bệnh', async ({ page }) => {

  const chuong = new DanhMucChuongBenhPage(page);

  await chuong.goto();
  await chuong.waitOverlayGone();

  const tenChuong = 'Bệnh bạch cầu';

  // tìm đúng bản ghi
  await chuong.searchByTenChuong(tenChuong);
  await chuong.waitOverlayGone();

  const row = chuong.tableRows.filter({ hasText: tenChuong });

  await expect(row.first()).toBeVisible();

  // mở menu hành động
  const actionBtn = row.first().locator('button').last();
  await expect(actionBtn).toBeVisible();
  await actionBtn.click();

  // chọn Xóa
  const deleteOption = page.getByText('Xóa', { exact: true });
  await expect(deleteOption).toBeVisible();
  await deleteOption.click();

  // xác nhận xóa
  const confirmDelete = page.getByRole('button', { name: /^xóa$/i });
  await expect(confirmDelete).toBeVisible();
  await confirmDelete.click();

  // chờ bảng cập nhật
  await chuong.waitOverlayGone();

  // tìm lại để xác nhận đã xóa
  await chuong.searchByTenChuong(tenChuong);

  await expect(chuong.tableRows.filter({ hasText: tenChuong })).toHaveCount(0);

});

});