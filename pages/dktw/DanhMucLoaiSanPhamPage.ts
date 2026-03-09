import { Page, Locator, expect } from '@playwright/test';

export class DanhMucLoaiSanPhamPage {
  readonly page: Page;

  readonly addButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;

  readonly modal: Locator;
  readonly maInput: Locator;
  readonly tenInput: Locator;
  readonly laThuocCheckbox: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  

  constructor(page: Page) {
    this.page = page;

    // ===== TABLE =====
    this.addButton = page.getByRole('button', { name: /^thêm$/i }).first();

    this.searchInput = page.getByPlaceholder(
      /tìm kiếm theo tên loại sản phẩm/i
    );

    this.searchButton = page.getByRole('button', { name: /^tìm$/i });

    this.table = page
      .locator('table')
      .filter({ hasText: 'Mã loại sản phẩm' });

    this.tableRows = this.table.locator('tbody tr');

    // ===== MODAL =====
    this.modal = page.getByRole('dialog');

    this.maInput = this.modal.getByRole('textbox', {
      name: /mã loại sản phẩm/i,
    });

    this.tenInput = this.modal.getByRole('textbox', {
      name: /tên loại sản phẩm/i,
    });

    this.laThuocCheckbox = this.modal.getByRole('checkbox', {
      name: /loại sản phẩm là thuốc/i,
    });

    this.submitButton = this.modal.getByRole('button', {
      name: /^thêm$|^lưu$/i,
    });

    this.cancelButton = this.modal.getByRole('button', {
      name: /hủy/i,
    });
  }

  async goto() {
    await this.page.goto(
      'http://dktw.cusc.vn/danhmuc/root/loai-san-pham?page=1',
      { waitUntil: 'domcontentloaded' }
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

  

//   async create(ma: string, ten: string) {
//   await this.addButton.click();
//   await this.modal.waitFor({ state: 'visible' });

//   await this.maInput.fill(ma);
//   await this.tenInput.fill(ten);
//   await this.laThuocCheckbox.check();

//   await this.submitButton.click();

//   const notification = this.page.locator('.mantine-Notification-root');

//   await expect(notification).toBeVisible({ timeout: 10000 });
//   await expect(notification).toContainText(/thành công/i);

//   await this.modal.waitFor({ state: 'hidden' });
// } mới sửa 4/3

async create(ma: string, ten: string) {
  await this.addButton.click();
  await this.modal.waitFor({ state: 'visible' });

  await this.maInput.fill(ma);
  await this.tenInput.fill(ten);
  await this.laThuocCheckbox.check();
  // await this.dienGiaiTextarea.fill('Test auto');

  await this.submitButton.click();

  const notification = this.page.locator('.mantine-Notification-root').last();

  // 🔥 chỉ chờ notification xuất hiện
  await expect(notification).toBeVisible({ timeout: 10000 });

  // const text = await notification.innerText();

  // if (!/thành công/i.test(text)) {
  //   throw new Error(`Create fail: ${text}`);
  // }
await expect(notification).toContainText(/thành công/i);
  // 🔥 đừng chờ modal hidden bằng waitFor
  await expect(this.modal).toBeHidden({ timeout: 10000 });

  await this.waitOverlayGone();
}

  // ================= VERIFY =================
  // async verifyExists(ma: string) {
  //   await expect(
  //     this.tableRows.filter({ hasText: ma })
  //   ).toHaveCount(1);
  // }
async verifyExists(ma: string) {
  const cell = this.tableRows
    .locator('td:nth-child(2)')
    .filter({ hasText: new RegExp(`^${ma}$`) });

  await expect(cell).toHaveCount(1);
}


async updateTenByMa(ma: string, newTen: string) {
  const cell = this.tableRows
    .locator('td:nth-child(2)')
    .filter({ hasText: new RegExp(`^${ma}$`) });

  await expect(cell).toHaveCount(1);

  const row = cell.locator('xpath=ancestor::tr');

  // 🔥 Click icon edit đúng cách
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
  await expect(notification).toContainText(/thành công/i);

  await this.modal.waitFor({ state: 'hidden' });
  await this.waitOverlayGone();
}


  // ================= DELETE =================
 async deleteByTen(ten: string) {
  // 1️⃣ Search theo tên
  await this.search(ten);

  const row = this.tableRows.first();
  await expect(row).toBeVisible();

  // 2️⃣ Click icon trash
  await row
    .locator('button:has(svg.tabler-icon-trash)')
    .click();

  // 3️⃣ Confirm popup
  await this.page
    .getByRole('button', { name: /xóa/i })
    .click();

  // 4️⃣ Verify success
  const notification = this.page.locator('.mantine-Notification-root');
  await expect(notification).toContainText(/thành công/i);

  await this.waitOverlayGone();
}
}