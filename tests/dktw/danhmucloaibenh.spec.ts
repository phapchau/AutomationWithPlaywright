import { test, expect } from '@playwright/test';
import { DanhMucLoaiBenhPage } from '../../pages/dktw/DanhMucLoaiBenhPage';

test.describe('DKTW - Danh mục loại bệnh', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/benhvien');
    await expect(page).not.toHaveURL(/login/);
  });



test('TC301 - Thêm loại bệnh', async ({ page }) => {
    const loai = new DanhMucLoaiBenhPage(page);
    await loai.goto();
    await loai.waitOverlayGone();

    const unique = Date.now();

    const data = {
      stt: '20',
      maLoai: `34`,
      ten: `Bệnh bạch cầu `,
      tenEng: `Disease type test `,
      dienGiai: 'Automation test'
    };

    await loai.create(data);

    // tìm lại để xác nhận
    await loai.searchByMaLoai(data.maLoai);

    const row = loai.tableRows.filter({ hasText: data.maLoai });
    await expect(row.first()).toBeVisible();
  });

test('TC302 - Tìm theo mã loại bệnh', async ({ page }) => {

  const loai = new DanhMucLoaiBenhPage(page);

  await loai.goto();

  await loai.searchByMaLoai('5');

  await expect(loai.tableRows.first()).toBeVisible();

});


// test('TC303 - Tìm theo tên loại bệnh', async ({ page }) => {

//   const loai = new DanhMucLoaiBenhPage(page);

//   await loai.goto();

//   await loai.searchByTenLoai('Bệnh hệ tuần hoàn');

//   const row = loai.tableRows.filter({ hasText: 'Bệnh hệ tuần hoàn' });

//   await expect(row.first()).toBeVisible();

// });

  test('TC303 - Tìm theo tên loại bệnh', async ({ page }) => {
    const loai = new DanhMucLoaiBenhPage(page);
    await loai.goto();

    const keyword = 'Bệnh hệ tuần hoàn';

    await loai.searchByTenLoai(keyword);

    const row = loai.tableRows.filter({ hasText: keyword });
    await expect(row.first()).toBeVisible();
  });


// test('TC304 - Cập nhật loại bệnh', async ({ page }) => {

//   const loai = new DanhMucLoaiBenhPage(page);

//   await loai.goto();

//   await loai.updateTen('Bệnh bạch cầu', 'Bệnh bạch cầu updated');

// });


  test('TC304 - Cập nhật tên loại bệnh', async ({ page }) => {
    const loai = new DanhMucLoaiBenhPage(page);
    await loai.goto();

    const tenCu = 'Bệnh bạch cầu';
    const tenMoi = 'Bệnh bạch cầu updated';

    await loai.updateTen(tenCu, tenMoi);

    await loai.searchByTenLoai(tenMoi);

    const row = loai.tableRows.filter({ hasText: tenMoi });
    await expect(row.first()).toBeVisible();
  });


// test('TC305 - Xóa loại bệnh', async ({ page }) => {

//   const loai = new DanhMucLoaiBenhPage(page);

//   await loai.goto();

//   await loai.deleteByTen('Bệnh test');

// });
test('TC305 - Xóa loại bệnh', async ({ page }) => {
    const loai = new DanhMucLoaiBenhPage(page);
    await loai.goto();

    const ten = 'Bệnh bạch cầu 1';

    await loai.deleteByTen(ten);

    await loai.searchByTenLoai(ten);

    await expect(loai.tableRows.filter({ hasText: ten })).toHaveCount(0);
  });



//  test('TC306 - Tìm không có dữ liệu', async ({ page }) => {
//     const loai = new DanhMucLoaiBenhPage(page);
//     await loai.goto();

//     const keyword = 'XYZ_Khong_Ton_Tai';

//     await loai.searchByTenLoai(keyword);

//     await expect(loai.tableRows).toHaveCount(0);
//   });

test('TC306 - Tìm không có dữ liệu', async ({ page }) => {

  const loai = new DanhMucLoaiBenhPage(page);

  await loai.goto();
  await loai.waitOverlayGone();

  const keyword = 'XYZ_Khong_Ton_Tai';

  await loai.searchByTenLoai(keyword);

  const row = loai.tableRows.filter({ hasText: keyword });

  await expect(row).toHaveCount(0);

});


 test('TC307 - Không nhập mã loại bệnh', async ({ page }) => {

  const loai = new DanhMucLoaiBenhPage(page);

  await loai.goto();

  await loai.addButton.click();
  await expect(loai.modal).toBeVisible();

  await loai.sttInput.fill('28');

  // bỏ trống mã loại bệnh
  await loai.tenLoaiInputModal.fill('Test loại bệnh');

  await loai.tenTiengAnhInput.fill('Disease type test');

  await loai.submitButton.click();

  // kiểm tra validation của mã loại bệnh
  await expect(loai.maLoaiInputModal)
    .toHaveAttribute('aria-invalid', 'true');

});



test('TC308 - Không nhập tên loại bệnh', async ({ page }) => {

  const loai = new DanhMucLoaiBenhPage(page);

  await loai.goto();

  await loai.addButton.click();
  await loai.sttInput.fill('29');

  await loai.maLoaiInputModal.fill('29');

  await loai.submitButton.click();

  await expect(loai.tenLoaiInputModal).toHaveAttribute('aria-invalid', 'true');

});


test('TC309 - Không cho phép trùng mã loại bệnh', async ({ page }) => {

  const loai = new DanhMucLoaiBenhPage(page);

  await loai.goto();

  const data = {
    stt: '30',
    maLoai: '3',  // mã đã tồn tại
    ten: 'Test duplicate',
    tenEng: 'Duplicate test',
    dienGiai: 'Automation'
  };

  await loai.addButton.click();

  await loai.sttInput.fill(data.stt);
  await loai.maLoaiInputModal.fill(data.maLoai);
  await loai.tenLoaiInputModal.fill(data.ten);
  await loai.tenTiengAnhInput.fill(data.tenEng);

  await loai.submitButton.click();

  const notification = page.locator('.mantine-Notification-root');

  await expect(notification.last()).toContainText(/tồn tại|sử dụng/i);

});


test('TC310 - Tìm theo mã và tên loại bệnh', async ({ page }) => {

  const loai = new DanhMucLoaiBenhPage(page);

  await loai.goto();

  await loai.maLoaiInput.fill('3');
  await loai.tenLoaiInput.fill('Bệnh máu');

  await loai.searchButton.click();

  await loai.waitOverlayGone();

  const row = loai.tableRows.filter({ hasText: '3' });

  await expect(row.first()).toBeVisible();

});


test('TC311 - Reset tìm kiếm', async ({ page }) => {

  const loai = new DanhMucLoaiBenhPage(page);

  await loai.goto();

  await loai.searchByTenLoai('Bệnh của hệ thần kinh');

  await page.getByRole('button').nth(1).click(); // nút X

  await expect(loai.tableRows.first()).toBeVisible();

});
});