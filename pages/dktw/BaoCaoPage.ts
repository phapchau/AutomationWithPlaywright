import { Page, Locator, expect } from '@playwright/test';

export class BaoCaoPage {
  readonly page: Page;

  readonly maBNInput: Locator;
  readonly timButton: Locator;
  readonly hoTenInput: Locator;
  readonly phuongPhapTiemInput: Locator;
  readonly xoaBoLocIcon: Locator;
  readonly exportButton: Locator;



  constructor(page: Page) {
    this.page = page;

    // ✅ Ô tìm kiếm theo đúng label/name "Mã bệnh nhân"
    this.maBNInput = page.getByRole('textbox', {
      name: /mã bệnh nhân|mã bn/i,
    }).first();

    // ✅ Ô tìm theo Họ tên
    this.hoTenInput = page.getByRole('textbox', {
      name: /họ và tên bệnh nhân/i,
    }).first();

this.phuongPhapTiemInput = page
      .locator('label')
      .filter({ hasText: /phương pháp tiêm/i })
      .first()
      .locator('..')
      .locator('input[type="text"], input[title="select"]')
      .first();

    // ✅ Nút "Tìm"
    this.timButton = page.getByRole('button', {
      name: /tìm/i,
    }).first();

this.xoaBoLocIcon = this.maBNInput
      .locator('xpath=ancestor::*[self::div or self::section][1]')
      .locator('button')
      .filter({ has: page.locator('svg') })
      .last();


// this.exportButton = this.page.getByRole('button', { name: /xuất file báo cáo/i });
this.exportButton = this.page.locator(
  'button.buttonSaveBE:has-text("Xuất file báo cáo")'
);

  }


  async goto() {
    await this.page.goto('http://dktw.cusc.vn/benhvien/bao-cao', {
      // waitUntil: 'networkidle',
      waitUntil: 'domcontentloaded',
      
    });

    await expect(this.page).not.toHaveURL(/\/user\/login/, {
      timeout: 15000,
    });
  }


async waitOverlayGone() {
  const overlay = this.page.locator('.mantine-LoadingOverlay-overlay');
  if (await overlay.count()) {
    await overlay.first().waitFor({ state: 'hidden', timeout: 20000 });
  }
}

  // ✅ Search đúng flow: nhập mã BN → click nút Tìm
  // async searchByMaBN(maBN: string) {
  //   await this.maBNInput.waitFor({ state: 'visible', timeout: 15000 });

  //   await this.maBNInput.fill(maBN);

  //   await this.timButton.waitFor({ state: 'visible', timeout: 15000 });
  //   await this.timButton.click();

  //   await this.page.waitForTimeout(1000);
  // }//25/2

async searchByMaBN(maBN: string) {
  await this.waitOverlayGone();

  await this.maBNInput.waitFor({ state: 'visible', timeout: 15000 });
  await this.maBNInput.fill(maBN);

  await this.timButton.click();
}

  // ✅ nhập họ tên → click Tìm
  async searchByHoTen(hoTen: string) {
    await this.hoTenInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.hoTenInput.fill(hoTen);

    await this.timButton.click();
    await this.page.waitForTimeout(1000);
  }

async removeUnexpectedPills(allowedLabels: string[]) {
  const pills = this.page.locator('.mantine-Pill-root');

  let count = await pills.count();

  for (let i = 0; i < count; i++) {
    const pill = pills.nth(i);
    const text = (await pill.innerText()).trim();

    const isAllowed = allowedLabels.some(label =>
      text.toLowerCase().includes(label.toLowerCase())
    );

    // ❌ pill rác (ví dụ: "ê")
    if (!isAllowed) {
      await pill.locator('button').click();
      await this.page.waitForTimeout(150);
    }
  }
}









// async selectPhuongPhapTiem(methods: string | string[]) {
//   const list = Array.isArray(methods) ? methods : [methods];

//   await this.phuongPhapTiemInput.waitFor({ state: 'visible', timeout: 15000 });

//   // 🔥 Clear searchValue 1 lần trước khi chọn
//   await this.phuongPhapTiemInput.click();
//   await this.page.keyboard.press('Control+A');
//   await this.page.keyboard.press('Backspace');
//   await this.page.keyboard.press('Escape');

//   for (const method of list) {
//     // mở dropdown
//     await this.phuongPhapTiemInput.click();
//     await this.page.waitForTimeout(150);

//     // 🔥 insertText – tránh IME bug
//     await this.page.keyboard.insertText(method);
//     await this.page.waitForTimeout(250);

//     const option = this.page.getByRole('option', {
//       name: new RegExp(`^${method}$`, 'i'),
//     });

//     await option.waitFor({ state: 'visible', timeout: 15000 });
//     await option.click();

//     // đóng dropdown để commit value
//     await this.page.keyboard.press('Escape');
//     await this.page.waitForTimeout(150);
//   }

//   // 🔥 Blur khỏi component để reset searchValue
//   await this.page.click('body');

//   // 🔥 Dọn pill rác (nếu có)
//   await this.removeUnexpectedPills(list);
// }///cái cũ đúng



async selectPhuongPhapTiem(methods: string | string[]) {
  const list = Array.isArray(methods) ? methods : [methods];

  await this.phuongPhapTiemInput.waitFor({ state: 'visible' });

  for (const method of list) {
    // mở dropdown
    await this.phuongPhapTiemInput.click();

    // chọn option trực tiếp (dropdown local)
    const option = this.page.getByRole('option', {
      name: new RegExp(`^${method}$`, 'i'),
    }).first();

    await option.waitFor({ state: 'visible' });
    await option.click();

    // commit value
    await this.page.keyboard.press('Escape');
  }
}
//2/2






  async clickTim() {
    await this.timButton.click();
    await this.page.waitForTimeout(1000);
  }


  // ✅ Search theo Mã BN bằng Enter (giống nút Tìm)
async searchByMaBNWithEnter(maBN: string) {
  await this.maBNInput.waitFor({ state: 'visible', timeout: 15000 });

  await this.maBNInput.fill(maBN);

  // nhấn Enter để lọc dữ liệu
  await this.maBNInput.press('Enter');

  await this.page.waitForTimeout(1000);
}







// async clickXoaBoLocIconXAndReload() {
//   const filterBox = this.timButton.locator('xpath=ancestor::div[1]');
//   const clearBtn = filterBox.locator('button:has(svg.tabler-icon-x)').first();

//   await clearBtn.waitFor({ state: 'visible', timeout: 15000 });
//   await clearBtn.click();
//   await this.page.waitForTimeout(300);

//   // ✅ Xóa pill/tag
//   const pills = filterBox.locator('.mantine-Pill-root');
//   while (await pills.count() > 0) {
//     await pills.first().locator('button').click();
//     await this.page.waitForTimeout(150);
//   }

//   // ✅ QUAN TRỌNG NHẤT: clear searchValue của MultiSelect
//   await this.phuongPhapTiemInput.click();
//   await this.page.keyboard.press('Control+A');
//   await this.page.keyboard.press('Backspace');
//   await this.page.keyboard.press('Escape');

//   await expect(pills).toHaveCount(0);
// }28/01 chạy ổn

async clickXoaBoLocIconXAndReload() {
  const filterBox = this.timButton.locator('xpath=ancestor::div[1]');
  const clearBtn = filterBox.locator('button:has(svg.tabler-icon-x)').first();

  await clearBtn.waitFor({ state: 'visible', timeout: 15000 });
  await clearBtn.click();
  await this.page.waitForTimeout(300);

  // 1️⃣ Xóa toàn bộ pill/tag
  const pills = filterBox.locator('.mantine-Pill-root');
  while (await pills.count() > 0) {
    await pills.first().locator('button').click();
    await this.page.waitForTimeout(120);
  }

  // 2️⃣ Clear text bằng keyboard (KHÔNG evaluate JS)
  await this.phuongPhapTiemInput.click();
  await this.page.keyboard.down('Control');
  await this.page.keyboard.press('KeyA');
  await this.page.keyboard.up('Control');
  await this.page.keyboard.press('Backspace');

  // 3️⃣ Escape + blur để Mantine reset searchValue
  await this.page.keyboard.press('Escape');
  await this.page.click('body');

  // 4️⃣ Assert sạch
  await expect(pills).toHaveCount(0);
  // await expect(this.phuongPhapTiemInput).toHaveValue('');
}




//nhập hết rồi tìm
async fillFilters(filters?: {
    maBN?: string;
    hoTen?: string;
    phuongPhapTiem?: string | string[];
  }) {

    if (filters?.phuongPhapTiem) {
      await this.selectPhuongPhapTiem(filters.phuongPhapTiem);
    }

    if (filters?.maBN !== undefined) {
      await this.maBNInput.fill(filters.maBN);
    }

    if (filters?.hoTen !== undefined) {
      await this.hoTenInput.fill(filters.hoTen);
    }

    
  }



  async verifyResultContains(text: string) {
    await expect(this.page.getByText(new RegExp(text, 'i')).first()).toBeVisible({
      timeout: 15000,
    });
  }





async exportExcelAndWaitDownload() {
  await this.exportButton.waitFor({
    state: 'visible',
    timeout: 20000,
  });

  const [download] = await Promise.all([
    this.page.waitForEvent('download', { timeout: 30000 }),
    this.exportButton.click(),
  ]);

  return download;
}



// ✅ Verify No Data
async verifyNoData() {
  await expect(
    this.page.getByText(/không có dữ liệu|no data|không tìm thấy/i).first()
  ).toBeVisible({ timeout: 15000 });
}

}
