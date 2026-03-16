import { test, expect } from '@playwright/test';
import { DanhMucLoaiSanPhamPage } from '../../pages/dktw/DanhMucLoaiSanPhamPage';

test.describe('DKTW - Danh mục loại sản phẩm', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/benhvien');
    await expect(page).not.toHaveURL(/user\/login/);
  });






// test('TC601 - Thêm loại sản phẩm mới ', async ({ page }) => {
//   const dm = new DanhMucLoaiSanPhamPage(page);
//   await dm.goto();

//   // ⚠ Dùng unique để không phụ thuộc DB
//   const MA = `PF`;
//   const TEN = 'Thuốc Kê đơn ';

//   await dm.create(MA, TEN);
// });


test('TC601 - Thêm loại sản phẩm mới', async ({ page }) => {
  const dm = new DanhMucLoaiSanPhamPage(page);
  await dm.goto();

  // 🔥 luôn unique
  const MA = `PF_${Date.now()}`;
  const TEN = 'Thuốc kê đơn';

  await dm.create(MA, TEN);
});



test('TC602 - Tìm kiếm theo tên có sản phẩm', async ({ page }) => {
  const dm = new DanhMucLoaiSanPhamPage(page);
  await dm.goto();

  await dm.search('Thuốc ống');

  await expect(dm.tableRows.first()).toContainText('Thuốc ống');
});



test('TC603 - Tìm sản phẩm rồi sửa sản phẩm', async ({ page }) => {
  const dm = new DanhMucLoaiSanPhamPage(page);
  await dm.goto();

  const TEN_CU = 'Thuốc ho';     // tên đang tồn tại
  const TEN_MOI = 'Thuốc tiêu';

  // 1️⃣ Tìm theo tên hiện tại (đúng với UI: search theo tên)
  await dm.search(TEN_CU);

  const row = dm.tableRows.first();
  await expect(row).toBeVisible();

  // 2️⃣ Click nút Sửa (icon edit)
  await row
    .locator('button:has(svg.tabler-icon-edit)')
    .click();

  await dm.modal.waitFor({ state: 'visible' });

  // 3️⃣ Sửa tên
  await dm.tenInput.fill('');
  await dm.tenInput.fill(TEN_MOI);

  // 4️⃣ Click Cập nhật
  await dm.modal
    .getByRole('button', { name: /cập nhật/i })
    .click();

  // 5️⃣ Verify thông báo thành công
  const notification = page.locator('.mantine-Notification-root');
  await expect(notification).toContainText(/thành công/i);

  await dm.modal.waitFor({ state: 'hidden' });
  await dm.waitOverlayGone();

  // 6️⃣ 🔥 Search lại theo tên mới (vì filter cũ không còn match)
  await dm.search(TEN_MOI);

  await expect(dm.tableRows.first()).toContainText(TEN_MOI);
});
  


test('TC604 - Xóa sản phẩm thành công', async ({ page }) => {
  const dm = new DanhMucLoaiSanPhamPage(page);
  await dm.goto();

  const TEN = 'Thuốc đau';

  // 1️⃣ Search trước để chắc chắn tồn tại
  await dm.search(TEN);

  await expect(dm.tableRows.first()).toContainText(TEN);

  // 2️⃣ Xóa
  await dm.deleteByTen(TEN);

  // 🔥 QUAN TRỌNG: chờ overlay biến mất
  await dm.waitOverlayGone();

  // 3️⃣ Search lại
  await dm.search(TEN);

  // 4️⃣ Verify trong TABLE chứ không verify toàn page
  await expect(dm.tableRows.first())
    .toContainText(/không tìm thấy|không có dữ liệu/i);
});



test('TC605 - Thêm loại sản phẩm trùng mã', async ({ page }) => {
  const dm = new DanhMucLoaiSanPhamPage(page);
  await dm.goto();

  const MA = 'TV'; // chắc chắn tồn tại
  const TEN = 'Test trùng';

  await dm.addButton.click();
  await dm.modal.waitFor({ state: 'visible' });

  await dm.maInput.fill(MA);
  await dm.tenInput.fill(TEN);

  await dm.submitButton.click();

  const notification = page.locator('.mantine-Notification-root');
  await expect(notification).toContainText(/thất bại|tồn tại|trùng/i);

  await expect(dm.modal).toBeVisible();
});


test('TC606 - Không nhập mã loại sản phẩm', async ({ page }) => {
  const dm = new DanhMucLoaiSanPhamPage(page);
  await dm.goto();

  await dm.addButton.click();
  await dm.modal.waitFor({ state: 'visible' });

  await dm.tenInput.fill('Thiếu mã');

  await dm.submitButton.click();

  await expect(dm.maInput).toHaveAttribute('aria-invalid', 'true');
  await expect(dm.modal).toBeVisible();
});



test('TC607 - Không nhập tên loại sản phẩm', async ({ page }) => {
  const dm = new DanhMucLoaiSanPhamPage(page);
  await dm.goto();

  await dm.addButton.click();
  await dm.modal.waitFor({ state: 'visible' });

  await dm.maInput.fill('AUTO01');

  await dm.submitButton.click();

  await expect(dm.tenInput).toHaveAttribute('aria-invalid', 'true');
  await expect(dm.modal).toBeVisible();
});




test('TC608 - Tìm kiếm không tồn tại', async ({ page }) => {
  const dm = new DanhMucLoaiSanPhamPage(page);
  await dm.goto();

  await dm.search('Không tồn tại xyz');

  await expect(
    page.getByText(/không tìm thấy kết quả/i)
  ).toBeVisible();
});



test('TC609 - Hủy khi thêm loại sản phẩm', async ({ page }) => {
  const dm = new DanhMucLoaiSanPhamPage(page);
  await dm.goto();

  await dm.addButton.click();
  await expect(dm.modal).toBeVisible();

  await dm.cancelButton.click();
  await expect(dm.modal).toBeHidden();
});






test('TC611 - Sửa khi không nhập diễn giải', async ({ page }) => {
  const dm = new DanhMucLoaiSanPhamPage(page);
  await dm.goto();

  await dm.search('Thuốc viên');

  const row = dm.tableRows.first();
  await row.locator('button:has(svg.tabler-icon-edit)').click();

  await dm.modal.waitFor({ state: 'visible' });

  

  await dm.modal
    .getByRole('button', { name: /cập nhật/i })
    .click();

  await expect(
    page.getByText(/cannot be null/i)
  ).toBeVisible();
});


});