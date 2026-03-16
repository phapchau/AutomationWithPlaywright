import { Page, Locator, expect } from '@playwright/test';

export class DanhMucBenhPage {

  readonly page: Page;

  // search
  readonly maBenhInput: Locator;
  readonly tenBenhInput: Locator;
  readonly nhomChuongBenhSelect: Locator;
  readonly nhomBenhSelect: Locator;
  readonly searchButton: Locator;

  // table
  readonly tableRows: Locator;

  // modal
  readonly modal: Locator;
  readonly addButton: Locator;

  readonly sttInput: Locator;
  readonly maBenhInputModal: Locator;
  readonly tenBenhInputModal: Locator;
  readonly tenBenhEngInput: Locator;

  readonly nhomChuongBenhInput: Locator;
  readonly nhomBenhInput: Locator;

  readonly benhTruyenCheckbox: Locator;
  readonly benhManCheckbox: Locator;
  readonly benhNgoaiCheckbox: Locator;

  readonly dienGiaiInput: Locator;

  readonly submitButton: Locator;
  readonly updateButton: Locator;

  constructor(page: Page) {

    this.page = page;

    this.maBenhInput = page.getByPlaceholder('Tìm kiếm theo mã bệnh');
    this.tenBenhInput = page.getByPlaceholder('Tìm kiếm theo tên bệnh');

    this.nhomChuongBenhSelect = page.getByText('Tất cả').first();
    this.nhomBenhSelect = page.getByText('Tất cả').nth(1);

    this.searchButton = page.getByRole('button', { name: 'Tìm' });

    this.tableRows = page.locator('table tbody tr');

    this.addButton = page.getByRole('button', { name: 'Thêm' });

    this.modal = page.getByRole('dialog');

    this.nhomChuongBenhSelect =
  page.getByPlaceholder('Nhập nhóm chương bệnh');

this.nhomBenhSelect =
  page.getByPlaceholder('Nhập nhóm bệnh');

    this.sttInput = this.modal.getByLabel(/Số thứ tự bệnh/i);
    this.maBenhInputModal = this.modal.getByPlaceholder('Nhập mã bệnh');

    // this.tenBenhInputModal = this.modal.getByPlaceholder('Nhập tên bệnh');
    // this.tenBenhEngInput = this.modal.getByPlaceholder('Nhập tên bệnh tiếng anh');
    this.tenBenhInputModal =
  this.modal.locator('[data-path="benhTen"]');

this.tenBenhEngInput =
  this.modal.locator('[data-path="benhTenEn"]');

    this.nhomChuongBenhInput = this.modal.getByPlaceholder('Chọn nhóm chương bệnh');
    this.nhomBenhInput = this.modal.getByPlaceholder('Chọn nhóm bệnh');

    this.benhTruyenCheckbox = this.modal.getByLabel('Bệnh truyền nhiễm');
    this.benhManCheckbox = this.modal.getByLabel('Bệnh mãn tính');
    this.benhNgoaiCheckbox = this.modal.getByLabel('Bệnh ngoài định suất');

    this.dienGiaiInput = this.modal.getByPlaceholder('Nhập diễn giải bệnh');

    this.submitButton = this.modal.getByRole('button', { name: /^thêm$/i });
    this.updateButton = this.modal.getByRole('button', { name: /cập nhật/i });
  }

  async goto() {

    await this.page.goto(
      'http://dktw.cusc.vn/danhmuc/root/benh?dmBenhNhomId=-1&dmBenhChuongNhomId=-1&page=1'
    );

  }

  async waitOverlayGone() {

    const overlay = this.page.locator('.mantine-LoadingOverlay-overlay');

    if (await overlay.count()) {
      await overlay.first().waitFor({ state: 'hidden' });
    }

  }

  // ================= SEARCH =================

  async searchByMaBenh(ma: string) {

    await this.maBenhInput.fill(ma);

    await this.searchButton.click();

    await this.waitOverlayGone();

  }

  async searchByTenBenh(ten: string) {

    await this.tenBenhInput.fill(ten);

    await this.searchButton.click();

    await this.waitOverlayGone();

  }


// async selectOption(select: Locator, value: string) {

//   await select.click();

//   // mở dropdown
//   await select.press('ArrowDown');

//   const option = this.page
//     .locator('.mantine-Select-item')
//     .filter({ hasText: value })
//     .first();

//   await option.waitFor({ state: 'visible' });

//   await option.click();

// }
async selectOption(select: Locator, value: string) {

  await select.click();

  await select.fill(value.slice(0, 3));

  const option = this.page
    .locator('[data-combobox-option]')
    .filter({ hasText: value })
    .first();

  await option.waitFor({ state: 'visible', timeout: 15000 });

  await option.click();

}
  // ================= CREATE =================

  async create(data: {

    stt: string
    ma: string
    ten: string
    tenEng: string
    nhomChuong: string
    nhom: string
    dienGiai: string

  }) {

    await this.addButton.click();

    await this.modal.waitFor({ state: 'visible' });

    await this.sttInput.fill(data.stt);

    await this.maBenhInputModal.fill(data.ma);

    await this.tenBenhInputModal.fill(data.ten);

    await this.tenBenhEngInput.fill(data.tenEng);

    await this.nhomChuongBenhInput.fill(data.nhomChuong);
    await this.page.getByRole('option', { name: data.nhomChuong }).click();

    await this.nhomBenhInput.fill(data.nhom);
    await this.page.getByRole('option', { name: data.nhom }).click();

    await this.dienGiaiInput.fill(data.dienGiai);

    await this.submitButton.click();

    await this.waitOverlayGone();

  }

  // ================= UPDATE =================

  async updateTen(oldName: string, newName: string) {

    await this.searchByTenBenh(oldName);

    const row = this.tableRows.filter({ hasText: oldName });

    await expect(row.first()).toBeVisible();

    await row.first().locator('button').last().click();

    await this.page.getByText('Cập nhật', { exact: true }).click();

    await this.modal.waitFor({ state: 'visible' });

    await this.tenBenhInputModal.fill('');
    await this.tenBenhInputModal.fill(newName);

    await this.updateButton.click();

    await this.waitOverlayGone();

  }

  // ================= DELETE =================

  async deleteByTen(name: string) {

    await this.searchByTenBenh(name);

    const row = this.tableRows.filter({ hasText: name });

    await expect(row.first()).toBeVisible();

    await row.first().locator('button').last().click();

    await this.page.getByText('Xóa', { exact: true }).click();

    await this.page.getByRole('button', { name: /^xóa$/i }).click();

    await this.waitOverlayGone();

  }

}