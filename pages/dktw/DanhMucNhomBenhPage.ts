import { Page, Locator, expect } from '@playwright/test';

export class DanhMucNhomBenhPage {

  readonly page: Page;

  // search
  readonly maNhomInput: Locator;
  readonly tenNhomInput: Locator;
  readonly searchButton: Locator;

  // table
  readonly tableRows: Locator;

  // create
  readonly addButton: Locator;
  readonly modal: Locator;

  readonly loaiBenhInput: Locator;
  readonly sttInput: Locator;
  readonly maNhomInputModal: Locator;
  readonly tenNhomInputModal: Locator;
  readonly tenEngInput: Locator;
  readonly dienGiaiInput: Locator;

  readonly submitButton: Locator;
  readonly updateButton: Locator;

  constructor(page: Page) {

    this.page = page;

    this.maNhomInput = page.getByPlaceholder('Tìm kiếm theo mã nhóm bệnh');
    this.tenNhomInput = page.getByPlaceholder('Tìm kiếm theo tên nhóm bệnh');

    this.searchButton = page.getByRole('button', { name: 'Tìm' });

    this.tableRows = page.locator('table tbody tr');

    this.addButton = page.getByRole('button', { name: 'Thêm' });

    this.modal = page.getByRole('dialog');

    this.loaiBenhInput = this.modal.getByPlaceholder('Nhập loại bệnh');

this.sttInput = this.modal.locator('[data-path="benhNhomStt"]');

this.maNhomInputModal = this.modal.locator('[data-path="benhNhomMa"]');

this.tenNhomInputModal = this.modal.locator('[data-path="benhNhomTen"]');

this.tenEngInput = this.modal.locator('[data-path="benhNhomTenEn"]');

this.dienGiaiInput = this.modal.getByPlaceholder('Nhập diễn giải nhóm bệnh');
    this.submitButton = this.modal.getByRole('button', { name: /^thêm$/i });

    this.updateButton = this.modal.getByRole('button', { name: /cập nhật/i });
  }

  async goto() {
    await this.page.goto(
      'http://dktw.cusc.vn/danhmuc/root/nhom-benh?page=1'
    );
  }

  async waitOverlayGone() {
    const overlay = this.page.locator('.mantine-LoadingOverlay-overlay');

    if (await overlay.count()) {
      await overlay.first().waitFor({ state: 'hidden' });
    }
  }

  // ================= SEARCH =================

  async searchByMaNhom(value: string) {

    await this.maNhomInput.fill(value);

    await this.searchButton.click();

    await this.waitOverlayGone();
  }

  async searchByTenNhom(value: string) {

    await this.tenNhomInput.fill(value);

    await this.searchButton.click();

    await this.waitOverlayGone();
  }

  // ================= SELECT OPTION =================

  async selectOption(select: Locator, value: string) {

    await select.click();

    await select.fill(value);

    const option = this.page.getByRole('option', {
      name: new RegExp(value, 'i')
    });

    await expect(option).toBeVisible();

    await option.click();
  }

  // ================= CREATE =================

  async create(data: {

    loaiBenh: string
    stt: string
    maNhom: string
    ten: string
    tenEng: string
    dienGiai: string

  }) {

    await this.addButton.click();

await expect(this.modal).toBeVisible();

await this.selectOption(this.loaiBenhInput, data.loaiBenh);

await this.sttInput.fill(data.stt);

await this.maNhomInputModal.fill(data.maNhom);

await this.tenNhomInputModal.fill(data.ten);

await this.tenEngInput.fill(data.tenEng);

await this.dienGiaiInput.fill(data.dienGiai);

await this.submitButton.click();

    await this.waitOverlayGone();
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

    await this.waitOverlayGone();
  }

  // ================= DELETE =================

  async deleteByTen(name: string) {

    await this.searchByTenNhom(name);

    const row = this.tableRows.filter({ hasText: name });

    await expect(row.first()).toBeVisible();

    await row.first().locator('button').last().click();

    await this.page.getByText('Xóa', { exact: true }).click();

    await this.page.getByRole('button', { name: /^xóa$/i }).click();

    await this.waitOverlayGone();
  }

}