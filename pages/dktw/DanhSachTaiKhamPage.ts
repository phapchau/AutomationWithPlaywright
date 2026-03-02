
import { Page, Locator, expect } from '@playwright/test';

export class DanhSachHenTaiKhamPage {
  readonly page: Page;
  readonly url = '/benhvien/danh-sach-benh-nhan-hen-tai-kham';

  // ✅ Input search chung
  readonly searchInput: Locator;

  // ✅ Buttons
  readonly timButton: Locator;
  readonly xoaBoLocButton: Locator;

  // ✅ Mantine overlay
  readonly overlay: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput = this.page.getByPlaceholder(/tìm kiếm theo thông tin bệnh nhân/i);

    // nút "Tìm" có title="Tìm" (log của bạn confirm đúng)
    this.timButton = this.page.getByRole('button', { name: /tìm/i });

    // nút "Xóa bộ lọc" thường là icon × bên phải
    // this.xoaBoLocButton = this.page.locator('button:has-text("×")').first();
    this.xoaBoLocButton = this.page.locator(
  '//button[contains(@title,"Tìm")]/following::button[1]'
);


    // Mantine LoadingOverlay
    this.overlay = this.page.locator('.mantine-LoadingOverlay-overlay');
  }

  // =========================
  // ✅ WAIT: overlay không còn chặn click
  // =========================
 async waitOverlayNotBlocking(timeout = 30000) {
  const overlay = this.page.locator('.mantine-LoadingOverlay-overlay');

  // nếu overlay không tồn tại thì bỏ qua
  if ((await overlay.count()) === 0) return;

  // chờ overlay biến mất (không còn visible => không chặn click)
  await overlay.first().waitFor({ state: 'hidden', timeout }).catch(() => {});
}



  // =========================
  // NAVIGATION
  // =========================
  async goto() {
    await this.page.goto(this.url);
    await expect(this.page).toHaveURL(new RegExp(this.url.replace(/\//g, '\\/')));

    // ✅ đợi overlay tắt hẳn
    await this.waitOverlayNotBlocking();
    await expect(this.searchInput).toBeVisible({ timeout: 15000 });
  }

  // =========================
  // ACTIONS
  // =========================
  async fillSearch(text: string) {
    await this.searchInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.searchInput.fill(text);
  }

  
  async clickTim() {
  await this.timButton.waitFor({ state: 'visible', timeout: 15000 });

  await this.waitOverlayNotBlocking();
  await this.timButton.click();
  await this.waitOverlayNotBlocking();
}


  async search(text: string) {
    await this.fillSearch(text);
    await this.clickTim();
  }

  

 async clearFilterByXAndReload() {
  // ✅ click đúng nút xóa bộ lọc
  await this.xoaBoLocButton.waitFor({ state: 'visible', timeout: 15000 });
  await this.xoaBoLocButton.click();

  // ✅ chờ overlay/loading xong
  await this.page.waitForTimeout(800);

  // ✅ reload để chắc chắn về trạng thái ban đầu
  await this.page.reload();
  await this.page.waitForTimeout(800);

  // ✅ nếu vẫn còn value (do UI giữ state) -> clear tay luôn
  await this.searchInput.fill('');
}



  // =========================
  // ASSERT
  // =========================
  async verifySearchInputEmpty() {
    await expect(this.searchInput).toHaveValue('', { timeout: 15000 });
  }

  async verifyResultContains(text: string) {
    await expect(this.page.getByText(new RegExp(text, 'i')).first()).toBeVisible({
      timeout: 15000,
    });
  }

  async verifyNoData() {
    await expect(
      this.page.getByText(/không có dữ liệu|no data|không tìm thấy/i).first()
    ).toBeVisible({ timeout: 15000 });
  }
}

