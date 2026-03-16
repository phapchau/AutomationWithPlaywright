import { test, expect } from '@playwright/test';
import { DanhMucSanPhamPage } from '../../pages/dktw/DanhMucSanPhamPage';

test.describe('DKTW - Danh mục sản phẩm', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/benhvien');
    await expect(page).not.toHaveURL(/login/);
  });

  // ================= TC801 =================

  test('TC801 - Thêm sản phẩm mới', async ({ page }) => {
    const sp = new DanhMucSanPhamPage(page);
    await sp.goto();

    const data = {
      // ten: `Thuốc test ${Date.now()}`,
      ten: `Thuốc test `,
      ma: `SP${Date.now()}`,
      loai: 'Thuốc viên',
      nhom: 'Thuốc gói',
      hoatChat: 'Paracetamol',
      donViTinh: 'Viên',
      nhaSanXuat: 'Công ty Cổ phần Dược phẩm Cửu Long (PHARIMEXCO)',
      nuocSanXuat: 'Việt Nam',
      nongDo: '500mg',
      quyCach: 'Hộp 10 viên',
      soKiemSoat: 'VD-1234',
      dienGiai: 'Test automation'
    };

    await sp.create(data);
    await expect(
  page.locator('.mantine-Notification-root')
).toContainText(/thành công/i);

  });

  // ================= TC802 =================

test('TC802 - Tìm kiếm theo tên sản phẩm', async ({ page }) => {

  const sp = new DanhMucSanPhamPage(page);
  await sp.goto();

  await sp.search('Diosmectit 3g');

  await sp.waitOverlayGone();

  const rows = sp.tableRows;

  await expect(rows).not.toHaveCount(0);

  await expect(rows.first()).toContainText('Diosmectit 3g');

});

  // ================= TC803 =================

 


 test('TC803 - Lọc theo nhà sản xuất', async ({ page }) => {

  const sp = new DanhMucSanPhamPage(page);
  await sp.goto();

  const nhaSanXuat =
    'Công ty Cổ phần Dược phẩm Cửu Long (PHARIMEXCO)';

  // chọn nhà sản xuất
  await sp.filterByNhaSanXuat(nhaSanXuat);

  // bấm tìm
  await sp.searchButton.click();

  // chờ bảng load xong
  await sp.waitOverlayGone();

  const rows = sp.tableRows;

  // dấu hiệu 1: bảng có dữ liệu
  await expect(rows.first()).toBeVisible();

  // dấu hiệu 2: trong bảng phải tồn tại ít nhất một dòng thuộc nhà sản xuất đó
  const matched = rows.filter({ hasText: nhaSanXuat });

  await expect(matched.first()).toBeVisible();

});
  // ================= TC804 =================

  test('TC804 - Lọc theo nhóm sản phẩm', async ({ page }) => {

  const sp = new DanhMucSanPhamPage(page);
  await sp.goto();

  const nhomSanPham = 'Thuốc gói';

  await sp.filterByNhomSanPham(nhomSanPham);
  await sp.searchButton.click();
  await sp.waitOverlayGone();

  await expect(sp.tableRows.first()).toContainText(nhomSanPham);

});

  // ================= TC805 =================

  test('TC805 - Sửa tên sản phẩm', async ({ page }) => {
    const sp = new DanhMucSanPhamPage(page);
    await sp.goto();

    const TEN_CU = 'Thuốc test';
    const TEN_MOI = `Probio `;

    await sp.updateTen(TEN_CU, TEN_MOI);

    await sp.search(TEN_MOI);

    await expect(sp.tableRows.first()).toContainText(TEN_MOI);
  });

  // ================= TC806 =================

  test('TC806 - Xóa sản phẩm', async ({ page }) => {
    const sp = new DanhMucSanPhamPage(page);
    await sp.goto();

    const TEN = 'SP Test';

    await sp.deleteByTen(TEN);

    await sp.search(TEN);

    await expect(
      page.getByText(/không tìm thấy|không có dữ liệu/i)
    ).toBeVisible();
  });

  // ================= TC807 =================

  
  test('TC807 - Không nhập tên sản phẩm', async ({ page }) => {

  const sp = new DanhMucSanPhamPage(page);
  await sp.goto();

  await sp.addButton.click();
  await sp.modal.waitFor({ state: 'visible' });

  // Không nhập tên sản phẩm

  await sp.maInput.fill('TEST01');

  await sp.selectOption(sp.loaiSanPhamSelect, 'Thuốc viên');
  await sp.selectOption(sp.nhomSanPhamModalSelect, 'Thuốc gói');
  await sp.selectOption(sp.donViTinhSelect, 'Gói');

  await sp.submitButton.click();

  // kiểm tra validation của tên sản phẩm
  await expect(sp.tenInput).toHaveAttribute('aria-invalid', 'true');

});

  // ================= TC808 =================

  test('TC808 - Không nhập mã sản phẩm', async ({ page }) => {
    const sp = new DanhMucSanPhamPage(page);
    await sp.goto();

    await sp.addButton.click();

    await sp.modal.waitFor({ state: 'visible' });

    await sp.tenInput.fill('Test thuốc');

    await sp.submitButton.click();

    await expect(sp.maInput).toHaveAttribute('aria-invalid', 'true');
  });

  // ================= TC809 =================

  test('TC809 - Hủy khi thêm sản phẩm', async ({ page }) => {
    const sp = new DanhMucSanPhamPage(page);
    await sp.goto();

    await sp.addButton.click();

    await expect(sp.modal).toBeVisible();

    await sp.cancelButton.click();

    await expect(sp.modal).toBeHidden();
  });

  // ================= TC810 =================

  test('TC810 - Tìm kiếm không tồn tại', async ({ page }) => {
    const sp = new DanhMucSanPhamPage(page);
    await sp.goto();

    await sp.search('Tìm kiếm không 0000');

    await expect(
      page.getByText(/không tìm thấy kết quả/i)
    ).toBeVisible();
  });

});