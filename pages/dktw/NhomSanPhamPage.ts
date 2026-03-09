// import { Page, Locator, expect } from '@playwright/test';

// export class NhomSanPhamPage {
//   readonly page: Page;

//   // ===== TABLE =====
//   readonly addButton: Locator;
// //   readonly searchInput: Locator;
// //   readonly searchButton: Locator;
//   readonly table: Locator;
//   readonly tableRows: Locator;

//   // ===== MODAL =====
//   readonly modal: Locator;
//   readonly maInput: Locator;
//   readonly tenInput: Locator;
//   readonly loaiSelect: Locator;
//   readonly dienGiaiTextarea: Locator;

//   constructor(page: Page) {
//     this.page = page;

//     // ===== TABLE =====
//     this.addButton = page.getByRole('button', { name: /^thêm$/i }).first();

//     // this.searchInput = page.getByPlaceholder(/tìm kiếm/i);
//     // this.searchButton = page.getByRole('button', { name: /^tìm$/i });

//     this.table = page.locator('table').first();
//     this.tableRows = this.table.locator('tbody tr');

//     // ===== MODAL =====
//     this.modal = page.getByRole('dialog');

//     this.maInput = this.modal.getByRole('textbox', {
//       name: /mã nhóm sản phẩm/i,
//     });

//     this.tenInput = this.modal.getByRole('textbox', {
//       name: /tên nhóm sản phẩm/i,
//     });

//     // this.loaiSelect = this.modal.getByRole('combobox', {
//     //   name: /loại sản phẩm/i,
//     // });
//     this.loaiSelect = this.modal.getByPlaceholder(/chọn loại sản phẩm/i);

//     this.dienGiaiTextarea = this.modal.getByRole('textbox', {
//       name: /diễn giải/i,
//     });
//   }

//   async goto() {
//     await this.page.goto(
//       'http://dktw.cusc.vn/danhmuc/root/nhom-san-pham',
//       { waitUntil: 'domcontentloaded' }
//     );
//   }

//   async waitOverlayGone() {
//     const overlay = this.page.locator('.mantine-LoadingOverlay-overlay');
//     if (await overlay.count()) {
//       await overlay.first().waitFor({ state: 'hidden' });
//     }
//   }

//   // ================= CREATE =================
//   async create(ma: string, ten: string, loai: string) {
//   await this.addButton.click();
//   await this.modal.waitFor({ state: 'visible' });

//   await this.maInput.fill(ma);
//   await this.tenInput.fill(ten);

//   // chọn loại sản phẩm (mantine select)
//   await this.loaiSelect.click();

//   const dropdown = this.page.locator('.mantine-Select-dropdown');
//   await dropdown.waitFor({ state: 'visible' });

//   await dropdown.getByText(loai, { exact: true }).click();

//   await this.modal.getByRole('button', { name: /^thêm$/i }).click();

//   const notification = this.page.locator('.mantine-Notification-root');
//   await expect(notification).toContainText(/thành công/i);

//   await this.modal.waitFor({ state: 'hidden' });
// }

//   // ================= SEARCH =================
  

//   async getRowByMa(ma: string) {
//   const cell = this.tableRows
//     .locator('td:nth-child(2)')
//     .filter({ hasText: new RegExp(`^${ma}$`) });

//   await expect(cell).toHaveCount(1);

//   return cell.locator('xpath=ancestor::tr');
// }

//   // ================= UPDATE =================
// //   async updateTenByMa(ma: string, newTen: string) {
// //     await this.search(ma);

// //     const row = this.tableRows.filter({ hasText: ma }).first();
// //     await expect(row).toBeVisible();

// //     await row.locator('button:has(svg.tabler-icon-edit)').click();

// //     await this.modal.waitFor({ state: 'visible' });

// //     await this.tenInput.fill('');
// //     await this.tenInput.fill(newTen);

// //     await this.modal
// //       .getByRole('button', { name: /cập nhật/i })
// //       .click();

// //     const notification = this.page.locator('.mantine-Notification-root');
// //     await expect(notification).toContainText(/thành công/i);

// //     await this.modal.waitFor({ state: 'hidden' });
// //   }

// async updateTenByMa(ma: string, newTen: string) {
//   const row = await this.getRowByMa(ma);

//   await row
//     .locator('button:has(svg.tabler-icon-edit)')
//     .click();

//   await this.modal.waitFor({ state: 'visible' });

//   await this.tenInput.fill('');
//   await this.tenInput.fill(newTen);

//   await this.modal
//     .getByRole('button', { name: /cập nhật/i })
//     .click();

//   const notification = this.page.locator('.mantine-Notification-root');
//   await expect(notification).toContainText(/thành công/i);

//   await this.modal.waitFor({ state: 'hidden' });
// }

//   // ================= DELETE =================
//   async deleteByMa(ma: string) {
//   const row = await this.getRowByMa(ma);

//   await row
//     .locator('button:has(svg.tabler-icon-trash)')
//     .click();

//   await this.page
//     .getByRole('button', { name: /xóa|xác nhận/i })
//     .click();

//   const notification = this.page.locator('.mantine-Notification-root');
//   await expect(notification).toContainText(/thành công/i);
// }
// }







import { Page, Locator, expect } from '@playwright/test';

export class NhomSanPhamPage {
  readonly page: Page;

  // ===== TABLE =====
  readonly addButton: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;

  // ===== MODAL =====
  readonly modal: Locator;
  readonly maInput: Locator;
  readonly tenInput: Locator;
  readonly loaiSelect: Locator;
  readonly dienGiaiTextarea: Locator;

  constructor(page: Page) {
    this.page = page;

    // ===== TABLE =====
    this.addButton = page.getByRole('button', { name: /^thêm$/i }).first();

    // this.table = page.locator('table').first();
    this.table = page.locator('table').filter({
  hasText: 'Mã nhóm sản phẩm'
});
    this.tableRows = this.table.locator('tbody tr');

    // ===== MODAL =====
    this.modal = page.getByRole('dialog');

    this.maInput = this.modal.getByRole('textbox', {
      name: /mã nhóm sản phẩm/i,
    });

    this.tenInput = this.modal.getByRole('textbox', {
      name: /tên nhóm sản phẩm/i,
    });

    // Mantine Select thực tế là input readonly
    this.loaiSelect = this.modal.locator(
      'input[placeholder*="Loại sản phẩm"]'
    );

    this.dienGiaiTextarea = this.modal.getByRole('textbox', {
      name: /diễn giải/i,
    });
  }

  async goto() {
    await this.page.goto(
      'http://dktw.cusc.vn/danhmuc/root/nhom-san-pham',
      { waitUntil: 'domcontentloaded' }
    );
  }

  async waitOverlayGone() {
    const overlay = this.page.locator('.mantine-LoadingOverlay-overlay');
    if (await overlay.count()) {
      await overlay.first().waitFor({ state: 'hidden' });
    }
  }

  // ================= CREATE =================
  async create(ma: string, ten: string, loai: string) {
    await this.addButton.click();
    await this.modal.waitFor({ state: 'visible' });

    await this.maInput.fill(ma);
    await this.tenInput.fill(ten);

    // Mở dropdown Mantine
    await this.loaiSelect.click();

    const dropdown = this.page.locator('.mantine-Select-dropdown');
    await dropdown.waitFor({ state: 'visible' });

    await dropdown.getByText(loai, { exact: true }).click();

    await this.modal.getByRole('button', { name: /^thêm$/i }).click();

    const notification = this.page.locator('.mantine-Notification-root');
    await expect(notification).toBeVisible({ timeout: 10000 });
    await expect(notification).toContainText(/thành công/i);

    await this.modal.waitFor({ state: 'hidden' });
    await this.waitOverlayGone();
  }

  // ================= FIND ROW =================
//   async getRowByMa(ma: string) {
//     const cell = this.tableRows
//       .locator('td')
//       .nth(1) // cột Mã nhóm sản phẩm
//       .filter({ hasText: new RegExp(`^${ma}$`) });

//     await expect(cell).toHaveCount(1);

//     return cell.locator('xpath=ancestor::tr');
//   }
async getRowByMa(ma: string) {
  const rows = this.tableRows;

  const matched = rows.filter({
    has: rows.locator('td').filter({
      hasText: new RegExp(`^${ma}$`),
    }),
  });

  await expect(matched).toHaveCount(1);

  return matched.first();
}

  // ================= UPDATE =================
  async updateTenByMa(ma: string, newTen: string) {
    const row = await this.getRowByMa(ma);

    await row
      .locator('button:has(svg.tabler-icon-edit)')
      .click();

    await this.modal.waitFor({ state: 'visible' });

    await this.tenInput.fill('');
    await this.tenInput.fill(newTen);

    await this.modal
      .getByRole('button', { name: /cập nhật/i })
      .click();

    const notification = this.page.locator('.mantine-Notification-root');
    await expect(notification).toBeVisible({ timeout: 10000 });
    await expect(notification).toContainText(/thành công/i);

    await this.modal.waitFor({ state: 'hidden' });
    await this.waitOverlayGone();
  }

  // ================= DELETE =================
  async deleteByMa(ma: string) {
    const row = await this.getRowByMa(ma);

    await row
      .locator('button:has(svg.tabler-icon-trash)')
      .click();

    await this.page
      .getByRole('button', { name: /xóa|xác nhận/i })
      .click();

    const notification = this.page.locator('.mantine-Notification-root');
    await expect(notification).toBeVisible({ timeout: 10000 });
    await expect(notification).toContainText(/thành công/i);

    await this.waitOverlayGone();
  }
}