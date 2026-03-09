import { test, expect } from '@playwright/test';
import { NhomSanPhamPage } from '../../pages/dktw/NhomSanPhamPage';


test.describe('DKTW - Danh mục nhóm sản phẩm', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/benhvien');
    await expect(page).not.toHaveURL(/user\/login/);
  });



test('TC701 - Thêm nhóm sản phẩm mới thành công ', async ({ page }) => {
    const nhom = new NhomSanPhamPage(page);
    await nhom.goto();

    const MA = 'NSP5';
    const TEN = 'Nhóm thuốc giảm đau số 3';
    const LOAI = 'Thuốc viên'; // phải đúng option trong combobox

    await nhom.create(MA, TEN, LOAI);

    // ✅ chỉ verify thêm thành công (không search)
    const notification = page.locator('.mantine-Notification-root');
    await expect(notification).toContainText(/thành công/i);
  });

test('TC702 - Sửa nhóm sản phẩm thành công', async ({ page }) => {
  const nhom = new NhomSanPhamPage(page);
  await nhom.goto();

  const MA = 'SK';
  const TEN_MOI = 'Thuốc giảm ho thế hệ mới 1';

  // Đợi table load
  await expect(nhom.table).toBeVisible();


  const row = nhom.tableRows.filter({
    hasText: MA
  });

  await expect(row).toHaveCount(1);

  await row
    .locator('button:has(svg.tabler-icon-edit)')
    .click();

  await nhom.modal.waitFor({ state: 'visible' });

  await nhom.tenInput.fill('');
  await nhom.tenInput.fill(TEN_MOI);

  await nhom.modal
    .getByRole('button', { name: /cập nhật/i })
    .click();

  const notification = page.locator('.mantine-Notification-root');
  await expect(notification).toContainText(/thành công/i);

  await nhom.modal.waitFor({ state: 'hidden' });

  await expect(
    nhom.tableRows.filter({ hasText: TEN_MOI })
  ).toHaveCount(1);
});




test('TC703 - Xóa nhóm sản phẩm thành công', async ({ page }) => {
  const nhom = new NhomSanPhamPage(page);
  await nhom.goto();

  const MA = 'NSP4'; // phải tồn tại trước khi test

  // Đợi table render
  await expect(nhom.table).toBeVisible();

  // 1️⃣ Tìm đúng row theo mã
  const row = nhom.tableRows.filter({
    hasText: MA,
  });

  await expect(row).toHaveCount(1);

  // 2️⃣ Click icon trash
  await row
    .locator('button:has(svg.tabler-icon-trash)')
    .click();

  // 3️⃣ Confirm popup
  await page
    .getByRole('button', { name: /xóa|xác nhận/i })
    .click();

  // 4️⃣ Verify thông báo thành công
  const notification = page.locator('.mantine-Notification-root');
  await expect(notification).toBeVisible({ timeout: 10000 });
  await expect(notification).toContainText(/thành công/i);

  // 5️⃣ Verify row không còn trong table
  await expect(
    nhom.tableRows.filter({ hasText: MA })
  ).toHaveCount(0);
});

test('TC704 - Thêm nhóm sản phẩm trùng mã', async ({ page }) => {
  const nhom = new NhomSanPhamPage(page);
  await nhom.goto();

  const MA = 'NSP1'; // đã tồn tại
  const LOAI = 'Thuốc viên'; // phải đúng option có sẵn

  await nhom.addButton.click();
  await nhom.modal.waitFor({ state: 'visible' });

  await nhom.maInput.fill(MA);
  await nhom.tenInput.fill('Test trùng');

  // 🔥 Chọn loại sản phẩm (mantine select)
  await nhom.loaiSelect.click();

  const dropdown = page.locator('.mantine-Select-dropdown');
  await dropdown.waitFor({ state: 'visible' });

  await dropdown.getByText(LOAI, { exact: true }).click();

  // Submit
  await nhom.modal
    .getByRole('button', { name: /^thêm$/i })
    .click();

  const notification = page.locator('.mantine-Notification-root');

  await expect(notification).toBeVisible({ timeout: 10000 });
  await expect(notification).toContainText(/thất bại|tồn tại|trùng/i);

  // Modal vẫn mở vì backend reject
  await expect(nhom.modal).toBeVisible();
});




test('TC705 - Không nhập mã nhóm sản phẩm', async ({ page }) => {
  const nhom = new NhomSanPhamPage(page);
  await nhom.goto();

  const LOAI = 'Thuốc viên';

  await nhom.addButton.click();
  await nhom.modal.waitFor({ state: 'visible' });

  // ❌ Không nhập mã
  await nhom.tenInput.fill('Thiếu mã');

  // ✅ Chọn loại sản phẩm để form hợp lệ các field khác
  await nhom.loaiSelect.click();

  const dropdown = page.locator('.mantine-Select-dropdown');
  await dropdown.waitFor({ state: 'visible' });
  await dropdown.getByText(LOAI, { exact: true }).click();

  // Submit
  await nhom.modal
    .getByRole('button', { name: /^thêm$/i })
    .click();

  // ✅ Verify chỉ lỗi ở mã
  await expect(nhom.maInput).toHaveAttribute('aria-invalid', 'true');

  // Modal vẫn mở
  await expect(nhom.modal).toBeVisible();
});


test('TC706 - Sửa nhóm sản phẩm với tên rỗng', async ({ page }) => {
  const nhom = new NhomSanPhamPage(page);
  await nhom.goto();

  const MA = 'SK';

  const row = nhom.tableRows.filter({ hasText: MA });
  await expect(row).toHaveCount(1);

  await row.locator('button:has(svg.tabler-icon-edit)').click();
  await nhom.modal.waitFor({ state: 'visible' });

  await nhom.tenInput.fill('');

  await nhom.modal
    .getByRole('button', { name: /cập nhật/i })
    .click();

  await expect(nhom.tenInput).toHaveAttribute('aria-invalid', 'true');
});



test('TC707 - Nhấn xóa nhưng không xác nhận', async ({ page }) => {
  const nhom = new NhomSanPhamPage(page);
  await nhom.goto();

  const MA = 'NSP3';

  const row = nhom.tableRows.filter({ hasText: MA });
  await expect(row).toHaveCount(1);

  await row
    .locator('button:has(svg.tabler-icon-trash)')
    .click();

  // bấm hủy
  await page.getByRole('button', { name: /hủy/i }).click();

  // row vẫn còn
  await expect(
    nhom.tableRows.filter({ hasText: MA })
  ).toHaveCount(1);
});




// test('TC708 - Mở và đóng modal thêm nhóm sản phẩm', async ({ page }) => {
//   const nhom = new NhomSanPhamPage(page);
//   await nhom.goto();

//   await nhom.addButton.click();
//   await expect(nhom.modal).toBeVisible();

//   await nhom.cancelButton.click();
//   await expect(nhom.modal).toBeHidden();
// });

});