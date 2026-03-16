import { Page, Locator, expect } from '@playwright/test';

export class DanhMucLoaiBenhPage {

  readonly page: Page;

  readonly addButton: Locator;
  readonly tableRows: Locator;

  readonly maLoaiInput: Locator;
  readonly tenLoaiInput: Locator;
  readonly searchButton: Locator;

  readonly modal: Locator;

  readonly sttInput: Locator;
  readonly maLoaiInputModal: Locator;
  readonly tenLoaiInputModal: Locator;
  readonly tenTiengAnhInput: Locator;
  readonly dienGiaiInput: Locator;

  readonly submitButton: Locator;
  readonly updateButton: Locator;

  constructor(page: Page) {

    this.page = page;

    this.addButton = page.getByRole('button', { name: /thêm/i });

    this.tableRows = page.locator('table tbody tr');

    // search
    this.maLoaiInput = page.getByPlaceholder('Tìm kiếm theo mã loại bệnh');
    this.tenLoaiInput = page.getByPlaceholder('Tìm kiếm theo tên loại bệnh');

    this.searchButton = page.getByRole('button', { name: /^tìm$/i });

    // modal
    this.modal = page.getByRole('dialog');

    this.sttInput = this.modal.locator('input[type="text"]').first();

    this.maLoaiInputModal = this.modal.getByPlaceholder('Nhập tên loại bệnh').first();

    this.tenLoaiInputModal = this.modal.getByPlaceholder('Nhập tên loại bệnh').nth(1);

    this.tenTiengAnhInput = this.modal.getByPlaceholder('Nhập tên loại bệnh').nth(2);

    this.dienGiaiInput = this.modal.getByPlaceholder('Nhập diễn giải loại bệnh');

    this.submitButton = this.modal.getByRole('button', { name: /^thêm$/i });

    this.updateButton = this.modal.getByRole('button', { name: /^cập nhật$/i });

  }

  async goto() {

    await this.page.goto(
      'http://dktw.cusc.vn/danhmuc/root/loai-benh?page=1'
    );

  }

  async waitOverlayGone() {

    const overlay = this.page.locator('.mantine-LoadingOverlay-overlay');

    if (await overlay.count()) {

      await overlay.first().waitFor({ state: 'hidden' });

    }

  }

  // ================= SEARCH =================

  async searchByMaLoai(value: string) {

    await this.maLoaiInput.fill(value);

    await this.searchButton.click();

    await this.waitOverlayGone();

  }

  async searchByTenLoai(value: string) {

    await this.tenLoaiInput.fill(value);

    await this.searchButton.click();

    await this.waitOverlayGone();

  }

  // ================= CREATE =================

  async create(data: {

    stt: string
    maLoai: string
    ten: string
    tenEng: string
    dienGiai: string

  }) {

    await this.addButton.click();

    await expect(this.modal).toBeVisible();

    await this.sttInput.fill(data.stt);

    await this.maLoaiInputModal.fill(data.maLoai);

    await this.tenLoaiInputModal.fill(data.ten);

    await this.tenTiengAnhInput.fill(data.tenEng);

    await this.dienGiaiInput.fill(data.dienGiai);

    await this.submitButton.click();

    await this.waitOverlayGone();

    const row = this.tableRows.filter({ hasText: data.maLoai });

    await expect(row.first()).toBeVisible({ timeout: 10000 });

  }

  // ================= UPDATE =================

  async updateTen(oldName: string, newName: string) {

    await this.searchByTenLoai(oldName);

    const row = this.tableRows.filter({ hasText: oldName });

    await expect(row.first()).toBeVisible();

    await row.first().locator('button').last().click();

    await this.page.getByText('Cập nhật', { exact: true }).click();

    await expect(this.modal).toBeVisible();

    await this.tenLoaiInputModal.fill('');

    await this.tenLoaiInputModal.fill(newName);

    await this.updateButton.click();

    await this.waitOverlayGone();

  }

  // ================= DELETE =================

  async deleteByTen(name: string) {

    await this.searchByTenLoai(name);

    const row = this.tableRows.filter({ hasText: name });

    await expect(row.first()).toBeVisible();

    await row.first().locator('button').last().click();

    await this.page.getByText('Xóa', { exact: true }).click();

    await this.page.getByRole('button', { name: /^xóa$/i }).click();

    const notification = this.page.locator('.mantine-Notification-root').last();

    await expect(notification).toContainText(/thành công/i);

  }

}