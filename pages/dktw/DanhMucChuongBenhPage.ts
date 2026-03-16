import { Page, Locator, expect } from '@playwright/test';

export class DanhMucChuongBenhPage {

  readonly page: Page;

  // ===== SEARCH =====
  readonly maBenhInput: Locator;
  readonly maChuongInput: Locator;
  readonly tenChuongInput: Locator;

  readonly searchButton: Locator;
  readonly clearButton: Locator;

  // ===== TABLE =====
  readonly table: Locator;
  readonly tableRows: Locator;

  // ===== BUTTON =====
  readonly addButton: Locator;

  // ===== MODAL =====
  readonly modal: Locator;

  readonly sttInput: Locator;
  readonly maChuongBenhInput: Locator;
  readonly tenChuongBenhInput: Locator;
  readonly tenTiengAnhInput: Locator;
  readonly maBenhICDInput: Locator;
  readonly dienGiaiInput: Locator;

//   readonly submitButton: Locator;
readonly submitCreateButton: Locator;
readonly updateButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {

    this.page = page;

    // ===== SEARCH =====
    this.maBenhInput = page.getByPlaceholder('Tìm kiếm theo mã bệnh (ICD10)');
    this.maChuongInput = page.getByPlaceholder('Tìm kiếm theo mã chương bệnh');
    this.tenChuongInput = page.getByPlaceholder('Tìm kiếm theo tên chương bệnh');

    this.searchButton = page.getByRole('button', { name: /^tìm$/i });
    this.clearButton = page.locator('button').filter({ hasText: '×' });

    // ===== TABLE =====
    this.table = page.locator('table');
    this.tableRows = this.table.locator('tbody tr');

    // ===== BUTTON =====
    this.addButton = page.getByRole('button', { name: /thêm/i });

    // ===== MODAL =====
    this.modal = page.getByRole('dialog');

    this.sttInput = this.modal.getByLabel(/số thứ tự chương bệnh/i);
    this.maChuongBenhInput = this.modal.getByLabel(/mã chương bệnh/i);
    // this.tenChuongBenhInput = this.modal.getByLabel(/tên chương bệnh/i);
    // this.tenTiengAnhInput = this.modal.getByLabel(/tên chương bệnh tiếng anh/i);
    this.tenChuongBenhInput = this.modal.locator('[data-path="benhChuongTen"]');
this.tenTiengAnhInput = this.modal.locator('[data-path="benhChuongTenEn"]');
    this.maBenhICDInput = this.modal.getByLabel(/mã bệnh/i);
    this.dienGiaiInput = this.modal.getByPlaceholder(/nhập diễn giải/i);

    // this.submitButton = this.modal.getByRole('button', { name: /thêm/i });
    this.submitCreateButton = this.modal.getByRole('button', { name: /^thêm/i });
this.updateButton = this.modal.getByRole('button', { name: /^cập nhật/i });
    this.cancelButton = this.modal.getByRole('button', { name: /hủy/i });
  }

  async goto() {

    await this.page.goto(
      'http://dktw.cusc.vn/danhmuc/root/chuong-benh?page=1'
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

  async searchByMaChuong(value: string) {

    await this.maChuongInput.fill(value);
    await this.searchButton.click();
    await this.waitOverlayGone();

  }

  async searchByTenChuong(value: string) {

    await this.tenChuongInput.fill(value);
    await this.searchButton.click();
    await this.waitOverlayGone();

  }

  // ================= CREATE =================

  async create(data: {

    stt: string
    maChuong: string
    ten: string
    tenEng: string
    maBenh: string
    dienGiai: string

  }) {

    await this.addButton.click();

    await this.modal.waitFor({ state: 'visible' });

    await this.sttInput.fill(data.stt);
    await this.maChuongBenhInput.fill(data.maChuong);
    await this.tenChuongBenhInput.fill(data.ten);
    await this.tenTiengAnhInput.fill(data.tenEng);
    await this.maBenhICDInput.fill(data.maBenh);
    await this.dienGiaiInput.fill(data.dienGiai);

    // await this.submitButton.click();
    await this.submitCreateButton.click();

    const notification = this.page.locator('.mantine-Notification-root').last();

    await expect(notification).toContainText(/thành công/i);

    await expect(this.modal).toBeHidden();

  }

  // ================= UPDATE =================

 async updateTen(oldName: string, newName: string) {

  await this.searchByTenChuong(oldName);
  await this.waitOverlayGone();

  const row = this.tableRows.filter({ hasText: oldName });
  await expect(row.first()).toBeVisible();

  // mở menu hành động
  const actionBtn = row.first().locator('button').last();
  await expect(actionBtn).toBeVisible();
  await actionBtn.click();

  // chờ menu xuất hiện rồi chọn Cập nhật
  const updateOption = this.page.getByText('Cập nhật', { exact: true });
  await expect(updateOption).toBeVisible();
  await updateOption.click();

  // modal mở
  await this.modal.waitFor({ state: 'visible' });

  await this.tenChuongBenhInput.fill('');
  await this.tenChuongBenhInput.fill(newName);

  await this.updateButton.click();

  // chờ modal đóng để tránh flaky
  await expect(this.modal).toBeHidden();
}

  // ================= DELETE =================

  async deleteByTen(name: string) {

    await this.searchByTenChuong(name);

    const row = this.tableRows.first();

    await row.getByRole('button', { name: /hành động/i }).click();

    await this.page.getByText(/xóa/i).click();

    await this.page.getByRole('button', { name: /^xóa$/i }).click();

    const notification = this.page.locator('.mantine-Notification-root').last();

    await expect(notification).toContainText(/thành công/i);

  }

}