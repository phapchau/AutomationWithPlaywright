import { Page, Locator, expect } from '@playwright/test';

export class DanhMucSanPhamPage {
  readonly page: Page;

  // ===== TABLE =====
  readonly addButton: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;

  // ===== SEARCH =====
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly nhaSanXuatSelect: Locator;
  readonly nhomSanPhamSelect: Locator;

  // ===== MODAL =====
  readonly modal: Locator;

  readonly tenInput: Locator;
  readonly maInput: Locator;
  readonly hoatChatInput: Locator;

  readonly loaiSanPhamSelect: Locator;
  readonly nhomSanPhamModalSelect: Locator;

  readonly donViTinhSelect: Locator;
  readonly nhaSanXuatModalSelect: Locator;
  readonly nuocSanXuatSelect: Locator;

  readonly nongDoInput: Locator;
  readonly quyCachInput: Locator;
  readonly soKiemSoatInput: Locator;
  readonly dienGiaiInput: Locator;

  readonly submitButton: Locator;
  readonly updateButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // ===== TABLE =====
    this.addButton = page.getByRole('button', { name: /thêm sản phẩm/i });
    // this.table = page.locator('table').first();
    this.table = page
  .locator('table')
  .filter({ hasText: 'Tên SP' });
    this.tableRows = this.table.locator('tbody tr');

    // ===== SEARCH =====
    this.searchInput = page.getByPlaceholder(/tìm kiếm theo tên sản phẩm/i);
    this.searchButton = page.getByRole('button', { name: /^tìm$/i });

    // this.nhaSanXuatSelect = page.getByLabel(/nhà sản xuất/i);
    this.nhaSanXuatSelect = this.page.locator(
  'input[placeholder="Chọn nhà sản xuất"]'
);
    // this.nhomSanPhamSelect = page.getByLabel(/nhóm sản phẩm/i);
    this.nhomSanPhamSelect = page.getByRole('textbox', {
  name: /nhóm sản phẩm/i
});

    // ===== MODAL =====
    this.modal = page.getByRole('dialog');

    this.tenInput = this.modal.getByPlaceholder(/nhập tên sản phẩm/i);
    this.maInput = this.modal.getByPlaceholder(/nhập mã sản phẩm/i);

    this.hoatChatInput = this.modal.getByRole('textbox', {
      name: /hoạt chất/i
    });

    this.loaiSanPhamSelect = this.modal.getByPlaceholder(/chọn loại sản phẩm/i);
    this.nhomSanPhamModalSelect = this.modal.getByPlaceholder(/chọn nhóm sản phẩm/i);

    this.donViTinhSelect = this.modal.getByPlaceholder(/chọn đơn vị tính/i);
    this.nhaSanXuatModalSelect = this.modal.getByPlaceholder(/chọn nhà sản xuất/i);
    this.nuocSanXuatSelect = this.modal.getByPlaceholder(/chọn nước sản xuất/i);

    this.nongDoInput = this.modal.getByRole('textbox', {
      name: /nồng độ/i
    });

    this.quyCachInput = this.modal.getByPlaceholder(/quy cách/i);
    // this.soKiemSoatInput = this.modal.getByPlaceholder(/số kiểm soát/i);
    this.soKiemSoatInput = this.modal.locator('[data-path="sanphamSokiemsoat"]');
    this.dienGiaiInput = this.modal.getByPlaceholder(/diễn giải/i);

    this.submitButton = this.modal.getByRole('button', {
      name: /^Thêm mới$/i
    });

    this.updateButton = this.modal.getByRole('button', {
      name: /^cập nhật$/i
    });

    this.cancelButton = this.modal.getByRole('button', { name: /hủy/i });
  }

  async goto() {
    await this.page.goto(
      'http://dktw.cusc.vn/danhmuc/root/san-pham?page=1&pageSize=20'
    );
  }

  async waitOverlayGone() {
    const overlay = this.page.locator('.mantine-LoadingOverlay-overlay');
    if (await overlay.count()) {
      await overlay.first().waitFor({ state: 'hidden' });
    }
  }

  // ================= SEARCH =================

  async search(keyword: string) {
    await this.searchInput.fill('');
    await this.searchInput.fill(keyword);

    await this.searchButton.click();
    await this.waitOverlayGone();
  }

  // async filterByNhaSanXuat(name: string) {
  //   await this.nhaSanXuatSelect.click();
  //   await this.page.getByText(name, { exact: true }).click();
  // }
async filterByNhaSanXuat(name: string) {

  // gõ tên vào input của combobox
  await this.nhaSanXuatSelect.click();
  await this.nhaSanXuatSelect.fill(name);

  // dropdown hiện ra
  const dropdown = this.page
    .locator('.mantine-Select-dropdown:visible')
    .last();

  await dropdown.waitFor({ state: 'visible' });

  // chọn đúng option
  await dropdown.getByText(name, { exact: true }).click();

}


  // async filterByNhomSanPham(name: string) {
  //   await this.nhomSanPhamSelect.click();
  //   await this.page.getByText(name, { exact: true }).click();
  // }
  async filterByNhomSanPham(name: string) {

  await this.nhomSanPhamSelect.click();

  const dropdown = this.page
    .locator('.mantine-Select-dropdown:visible')
    .last();

  await dropdown.waitFor({ state: 'visible' });

  await dropdown.getByText(name, { exact: true }).click();

}

  // ================= SELECT OPTION =================

  async selectOption(select: Locator, value: string) {

    await select.click();

    const dropdown = this.page
      .locator('.mantine-Select-dropdown:visible')
      .last();

    await dropdown.waitFor({ state: 'visible' });

    await dropdown.getByText(value, { exact: true }).click();
  }

  // ================= CREATE =================

  async create(data: {
    ten: string
    ma: string
    loai: string
    nhom: string
    hoatChat: string
    donViTinh: string
    nhaSanXuat: string
    nuocSanXuat: string
    nongDo: string
    quyCach: string
    soKiemSoat: string
    dienGiai: string
  }) {

    await this.addButton.click();
    await this.modal.waitFor({ state: 'visible' });

    // ===== input =====
    await this.tenInput.fill(data.ten);
    await this.maInput.fill(data.ma);
    await this.hoatChatInput.fill(data.hoatChat);

    // ===== select =====
    await this.selectOption(this.loaiSanPhamSelect, data.loai);
    await this.selectOption(this.nhomSanPhamModalSelect, data.nhom);
    await this.selectOption(this.donViTinhSelect, data.donViTinh);
    await this.selectOption(this.nhaSanXuatModalSelect, data.nhaSanXuat);
    await this.selectOption(this.nuocSanXuatSelect, data.nuocSanXuat);

    // ===== input tiếp =====
    await this.nongDoInput.fill(data.nongDo);
    await this.quyCachInput.fill(data.quyCach);
    await this.soKiemSoatInput.scrollIntoViewIfNeeded();
    await this.soKiemSoatInput.fill(data.soKiemSoat);
    await this.dienGiaiInput.fill(data.dienGiai);

    await this.submitButton.click();

    const notification = this.page.locator('.mantine-Notification-root').last();

    await expect(notification).toContainText(/thành công/i);

    await expect(this.modal).toBeHidden();

    await this.waitOverlayGone();
  }





  
  
  // ================= UPDATE =================

  async updateTen(oldTen: string, newTen: string) {

    await this.search(oldTen);

    const row = this.tableRows.first();

    await row.locator('button:has(svg.tabler-icon-edit)').click();

    await this.modal.waitFor({ state: 'visible' });

    await this.tenInput.fill('');
    await this.tenInput.fill(newTen);

    await this.updateButton.click();

    const notification = this.page.locator('.mantine-Notification-root').last();

    await expect(notification).toContainText(/thành công/i);

    await expect(this.modal).toBeHidden();

    await this.waitOverlayGone();
  }

  // ================= DELETE =================



async deleteByTen(ten: string) {

  await this.search(ten);

  const row = this.tableRows
    .filter({ hasText: ten })
    .first();

  await row
    .locator('button:has(svg.tabler-icon-trash)')
    .click();

  await this.page
    .getByRole('button', { name: /^xóa$/i })
    .click();

  const notification = this.page
    .locator('.mantine-Notification-root')
    .last();

  await expect(notification)
    .toContainText(/thành công/i);

  await this.waitOverlayGone();
}
}