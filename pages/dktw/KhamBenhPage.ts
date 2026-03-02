


import { Page, Locator, expect } from '@playwright/test';

export class KhamBenhPage {
  readonly page: Page;

  // ===== Tabs =====
  readonly tabChoKham: Locator;
  readonly tabDaKham: Locator;

  // ===== Search (INPUT CHUNG)
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  // ===== Hồ sơ chi tiết 
  readonly ngheNghiepTextarea: Locator;
  readonly hoTenTextarea: Locator;
  readonly tuoiTextarea: Locator;

  constructor(page: Page) {
    this.page = page;

    // Tabs
    this.tabChoKham = page.getByRole('tab', { name: /Chờ khám/i });
    this.tabDaKham = page.getByRole('tab', { name: /Đã khám/i });

    // Search input chung
    this.searchInput = page.getByRole('textbox', {
      name: /tìm kiếm bệnh nhân/i,
    });

    // ⚠️ nút tìm: hiện tại chỉ có icon → lấy button đầu tiên
    this.searchButton = page.getByRole('button').first();

    // Hồ sơ
    // this.ngheNghiepTextarea = page
    //   .getByText('Nghề nghiệp', { exact: false })
    //   .locator('xpath=ancestor::div[contains(@class,"mantine-InputWrapper")]')
    //   .locator('textarea.user-input-value');
    this.ngheNghiepTextarea = page
  .getByText(/Nghề nghiệp/i)
  .locator('xpath=following::*[1]');


    this.hoTenTextarea = page
      .locator('textarea.user-input-value', { hasText: /.+/ })
      .first();

    this.tuoiTextarea = page
      .locator('textarea.user-input-value', {
        hasText: /\d+\s*(tuổi|tháng|ngày)/i,
      })
      .first();
  }

  // =========================
 
  // =========================
  async goto() {
    await this.page.goto('http://dktw.cusc.vn/benhvien/khambenh', {
      waitUntil: 'networkidle',
    });

    // đảm bảo input search đã render
    await this.searchInput.waitFor({ state: 'visible', timeout: 20000 });
  }

  // =========================
  //  SEARCH CHUNG
  // (Mã BN / CCCD / SĐT / Họ tên)
  // =========================
  async searchByKeyword(keyword: string) {
    await this.searchInput.click();
    await this.searchInput.fill('');
    await this.searchInput.type(keyword, { delay: 40 });

    await this.searchButton.click();
    await this.page.waitForTimeout(800);
  }

  // =========================
  // 🔁 SEARCH CẢ 2 TAB (CHUẨN NGHIỆP VỤ)
  // =========================
  async searchInBothTabs(keyword: string): Promise<'CHO_KHAM' | 'DA_KHAM'> {
    // 1️⃣ Chờ khám
    await this.tabChoKham.click();
    await this.page.waitForTimeout(300);

    await this.searchByKeyword(keyword);

    const countChoKham = await this.page
      .getByText(/Mã BN:\s*\d+/i)
      .count();

    if (countChoKham > 0) {
      return 'CHO_KHAM';
    }

    // 2️⃣ Đã khám
    await this.tabDaKham.click();
    await this.page.waitForTimeout(300);

    await this.searchByKeyword(keyword);

    const countDaKham = await this.page
      .getByText(/Mã BN:\s*\d+/i)
      .count();

    if (countDaKham > 0) {
      return 'DA_KHAM';
    }

    throw new Error(`❌ Không tìm thấy bệnh nhân với keyword: ${keyword}`);
  }

  // alias cho test đọc dễ
  async searchByMaBN(maBN: string) {
    return this.searchInBothTabs(maBN);
  }

  async searchByCCCD(cccd: string) {
    return this.searchInBothTabs(cccd);
  }

  async searchBySDT(sdt: string) {
    return this.searchInBothTabs(sdt);
  }

  // =========================
  // 📂 MỞ HỒ SƠ
  // =========================
  async openHoSoByMaBN(maBN: string) {
    const hoSo = this.page.getByText(
      new RegExp(`Mã BN:\\s*${maBN}`)
    );

    await hoSo.waitFor({ state: 'visible', timeout: 20000 });
    await hoSo.scrollIntoViewIfNeeded();
    await hoSo.click();
  }

  async openFirstHoSo() {
    const firstHoSo = this.page
      .getByText(/Mã BN:\s*\d+/i)
      .first();

    await firstHoSo.waitFor({ state: 'visible', timeout: 15000 });
    await firstHoSo.click();
  }

  // =========================
  // ✅ VERIFY
  // =========================
  async verifySearchHasResult() {
    await expect(
      this.page.getByText(/Mã BN:\s*\d+/i).first()
    ).toBeVisible({ timeout: 15000 });
  }

  async verifyCCCDExists(cccd: string) {
    await expect(
      this.page.getByText(new RegExp(cccd))
    ).toBeVisible({ timeout: 15000 });
  }

  async verifySDTExists(sdt: string) {
    await expect(
      this.page.getByText(new RegExp(sdt))
    ).toBeVisible({ timeout: 15000 });
  }

  // async verifyNgheNghiepExists() {
  //   await expect(this.ngheNghiepTextarea).toHaveText(/.+/, {
  //     timeout: 20000,
  //   });
  // }
async verifyNgheNghiepExists() {
  await expect(this.ngheNghiepTextarea).toHaveText(/\S+/);
}



  async verifyHoTenExists() {
    await expect(this.hoTenTextarea).toBeVisible({ timeout: 20000 });
    await expect(this.hoTenTextarea).toHaveText(/.+/);
  }

  async verifyTuoiFormat() {
    await expect(this.tuoiTextarea).toBeVisible({ timeout: 20000 });

    const tuoiText = (await this.tuoiTextarea.textContent())?.trim() || '';
    const regex =
      /^(\d+)\s*(tuổi|tháng|ngày)(\s+\d+\s*(tuổi|tháng|ngày))*$/i;

    expect(
      tuoiText,
      `❌ Tuổi sai định dạng: "${tuoiText}"`
    ).toMatch(regex);
  }
}
