import { Page, Locator, expect } from '@playwright/test';

export class DanhMucNhomChuongBenhPage {

  readonly page: Page;

  // ===== SEARCH =====
  readonly maBenhInput: Locator;
  readonly maNhomInput: Locator;
  readonly tenNhomInput: Locator;
  readonly searchButton: Locator;

  // ===== TABLE =====
  readonly table: Locator;
  readonly tableRows: Locator;

  // ===== BUTTON =====
  readonly addButton: Locator;

  // ===== MODAL =====
  readonly modal: Locator;

  readonly chuongBenhInput: Locator;
  readonly sttInput: Locator;
  readonly maNhomInputModal: Locator;
  readonly tenNhomInputModal: Locator;
  readonly tenTiengAnhInput: Locator;
  readonly dienGiaiInput: Locator;

  readonly submitButton: Locator;
  readonly updateButton: Locator;

  constructor(page: Page) {

    this.page = page;

    // SEARCH
    this.maBenhInput = page.getByPlaceholder('Tìm kiếm theo mã bệnh (ICD10)');
    this.maNhomInput = page.getByPlaceholder('Tìm kiếm theo mã chương bệnh');
    this.tenNhomInput = page.getByPlaceholder('Tìm kiếm theo tên nhóm chương bệnh');

    this.searchButton = page.getByRole('button', { name: /^tìm$/i });

    // TABLE
    this.table = page.locator('table');
    this.tableRows = this.table.locator('tbody tr');

    // BUTTON
    this.addButton = page.getByRole('button', { name: /thêm/i });

    // MODAL
    this.modal = page.getByRole('dialog');

    // this.chuongBenhInput = this.modal.getByLabel(/chương bệnh/i);
    // this.sttInput = this.modal.getByLabel(/số thứ tự nhóm chương bệnh/i);

    // this.maNhomInputModal = this.modal.getByLabel(/mã nhóm chương bệnh/i);
    // this.tenNhomInputModal = this.modal.getByLabel(/^tên nhóm chương bệnh/i);

    // this.tenTiengAnhInput = this.modal.getByLabel(/tên nhóm chương bệnh tiếng anh/i);

    // this.dienGiaiInput = this.modal.getByPlaceholder(/nhập diễn giải/i);
    this.chuongBenhInput = this.modal.getByPlaceholder('Nhập loại bệnh');

this.sttInput = this.modal.locator('[data-path="benhChuongNhomStt"]');

this.maNhomInputModal = this.modal.locator('[data-path="benhChuongNhomMa"]');

this.tenNhomInputModal = this.modal.locator('[data-path="benhChuongNhomTen"]');

this.tenTiengAnhInput = this.modal.locator('[data-path="benhChuongNhomTenEn"]');

this.dienGiaiInput = this.modal.getByPlaceholder('Nhập diễn giải nhóm chương bệnh');

    this.submitButton = this.modal.getByRole('button', { name: /^thêm$/i });
    this.updateButton = this.modal.getByRole('button', { name: /^cập nhật$/i });
  }

  async goto() {

    await this.page.goto(
      'http://dktw.cusc.vn/danhmuc/root/nhom-chuong-benh'
    );

  }

  async waitOverlayGone() {

    const overlay = this.page.locator('.mantine-LoadingOverlay-overlay');

    if (await overlay.count()) {

      await overlay.first().waitFor({ state: 'hidden' });

    }

  }

  // ================= SEARCH =================

  async searchByMaBenh(value: string) {

    await this.maBenhInput.fill(value);
    await this.searchButton.click();
    await this.waitOverlayGone();

  }

  async searchByMaNhom(value: string) {

    await this.maNhomInput.fill(value);
    await this.searchButton.click();
    await this.waitOverlayGone();

  }

//   async searchByTenNhom(value: string) {

//     await this.tenNhomInput.fill(value);
//     await this.searchButton.click();
//     await this.waitOverlayGone();

//   }

async searchByTenNhom(value: string) {

  await this.tenNhomInput.clear();
  await this.tenNhomInput.fill(value);

  await this.searchButton.click();

  await this.waitOverlayGone();

}


async selectOption(select: Locator, value: string) {

  await select.click();
  await select.fill(value);

  const option = this.page.getByRole('option', {
    name: new RegExp(value, 'i')
  });

  await expect(option).toBeVisible({ timeout: 10000 });

  await option.click();
}
  // ================= CREATE =================

//   async create(data: {
//   chuongBenh: string
//   stt: string
//   maNhom: string
//   ten: string
//   tenEng: string
//   dienGiai: string
// }) {

//   await this.addButton.click();
//   await this.modal.waitFor({ state: 'visible' });

// //   await this.chuongBenhInput.fill(data.chuongBenh);
// await this.selectOption(this.chuongBenhInput, data.chuongBenh);
//   await this.sttInput.fill(data.stt);
//   await this.maNhomInputModal.fill(data.maNhom);
//   await this.tenNhomInputModal.fill(data.ten);
//   await this.tenTiengAnhInput.fill(data.tenEng);
//   await this.dienGiaiInput.fill(data.dienGiai);

// await this.submitButton.click();

// await this.waitOverlayGone();

// const newRow = this.tableRows.filter({ hasText: data.maNhom });
// await expect(newRow.first()).toBeVisible({ timeout: 10000 });

//   // nếu muốn vẫn có thể kiểm tra notification (không bắt buộc)
//   const notification = this.page.locator('.mantine-Notification-root');
//   if (await notification.count()) {
//     await expect(notification.last()).toContainText(/thành công/i);
//   }
// }
async create(data: {
  chuongBenh: string
  stt: string
  maNhom: string
  ten: string
  tenEng: string
  dienGiai: string
}) {

  await this.addButton.click();
  await expect(this.modal).toBeVisible();

  await this.selectOption(this.chuongBenhInput, data.chuongBenh);
  await this.sttInput.fill(data.stt);
  await this.maNhomInputModal.fill(data.maNhom);
  await this.tenNhomInputModal.fill(data.ten);
  await this.tenTiengAnhInput.fill(data.tenEng);
  await this.dienGiaiInput.fill(data.dienGiai);

  await this.submitButton.click();

  await this.waitOverlayGone();

  const row = this.tableRows.filter({ hasText: data.maNhom });
  await expect(row.first()).toBeVisible({ timeout: 10000 });

  // đóng drawer
  await this.modal.getByRole('button').first().click();
  await expect(this.modal).toBeHidden();
}
  // ================= UPDATE =================

  async updateTen(oldName: string, newName: string) {

    await this.searchByTenNhom(oldName);

    const row = this.tableRows.filter({ hasText: oldName });

    await expect(row.first()).toBeVisible();

    await row.first().locator('button').last().click();

    await this.page.getByText('Cập nhật', { exact: true }).click();

    await this.modal.waitFor({ state: 'visible' });

    await this.tenNhomInputModal.fill('');
    await this.tenNhomInputModal.fill(newName);

    await this.updateButton.click();

  }

  // ================= DELETE =================

  async deleteByTen(name: string) {

    await this.searchByTenNhom(name);

    const row = this.tableRows.filter({ hasText: name });

    await expect(row.first()).toBeVisible();

    await row.first().locator('button').last().click();

    await this.page.getByText('Xóa', { exact: true }).click();

    await this.page.getByRole('button', { name: /^xóa$/i }).click();

    const notification = this.page.locator('.mantine-Notification-root').last();

    await expect(notification).toContainText(/thành công/i);

  }

}