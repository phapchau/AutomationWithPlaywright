




import { Page, Locator, expect } from '@playwright/test';

export class TiepNhanPage {
  readonly page: Page;

  // ===== Required basic inputs =====
  readonly hoTenInput: Locator;
  readonly ngaySinhInput: Locator;
  readonly sdtInput: Locator;
  readonly gioiTinhNam: Locator;

  // ===== Button =====
  readonly tiepNhanButton: Locator;

  
  constructor(page: Page) {
    this.page = page;

    // Input cơ bản
    this.hoTenInput = page.getByLabel('Họ tên *');
    this.ngaySinhInput = page.getByRole('textbox', { name: 'Ngày sinh' });
    // this.sdtInput = page.getByLabel('SĐT *');
    this.sdtInput = page.locator(
  'input[data-path="benhnhan.benhnhanSodienthoai"]'
);
    this.gioiTinhNam = page.getByLabel('Nam');

    // this.tiepNhanButton = page.getByRole('button', { name: 'Tiếp nhận' });
    this.tiepNhanButton = page.locator(
  'button.mantine-Button-root:has-text("Tiếp nhận")'
);
  }

  // ===============================
  // Navigation
  // ===============================
  async goto() {
    // console.log('➡️ Mở trang Tiếp nhận');
    await this.page.goto('http://dktw.cusc.vn/benhvien/tiepnhan');

    // Nếu chưa login sẽ bị redirect
    await expect(this.page).not.toHaveURL(/user\/login/);

    // Chờ form load
    await this.hoTenInput.waitFor({ state: 'visible', timeout: 30000 });
  }

 

  // ===============================
  // Verify page loaded
  // ===============================
  async verifyTiepNhanPageLoaded() {
   
    await expect(this.hoTenInput).toBeVisible();
    await expect(this.tiepNhanButton).toBeVisible();

  }

  


// ✅ Search theo Mã BN





// ===============================
// ===============================
// 🔍 Search INPUT CHUNG
// (Mã BN / CCCD / SĐT)
// Trigger bằng ENTER
// ===============================
async searchByKeyword(keyword: string) {
  const searchInput = this.page
    .locator('input[placeholder*="Tìm kiếm"]')
    .first();

  await searchInput.waitFor({ state: 'visible', timeout: 15000 });
  await searchInput.scrollIntoViewIfNeeded();
  await searchInput.click();

  // clear sạch
  await searchInput.fill('');
  await searchInput.type(keyword, { delay: 30 });

  // ✅ NGHIỆP VỤ CHUẨN: Enter để search
  await searchInput.press('Enter');

  // chờ list render
  await this.page.waitForTimeout(800);
}

// ===== Alias cho test đọc dễ =====
async searchByMaBN(maBN: string) {
  await this.searchByKeyword(maBN);
}

async searchByCCCD(cccd: string) {
  await this.searchByKeyword(cccd);
}

async searchBySDT(sdt: string) {
  await this.searchByKeyword(sdt);
}





// ===============================
// ✅ Click mở hồ sơ theo Mã BN
// ===============================
async openHoSoByMaBN(maBN: string) {


  const record = this.page.getByText(new RegExp(`Mã BN:\\s*${maBN}`));

  await record.waitFor({ state: 'visible', timeout: 20000 });
  await record.scrollIntoViewIfNeeded();
  await record.click();
}


// ✅ Click nút "Cập nhật thông tin bệnh nhân"
// ===============================
async clickCapNhatThongTinBenhNhan() {
 

  const btnUpdate = this.page.getByRole('button', {
    name: /cập nhật thông tin bệnh nhân/i,
  });

  await btnUpdate.waitFor({ state: 'visible', timeout: 15000 });
  await btnUpdate.click();
}


// ===============================
// ✅ Click nút "Hủy thao tác"
// ===============================
async clickHuyThaoTac() {
  // console.log('❌ Click Hủy thao tác');

  const btnCancel = this.page.getByRole('button', {
    name: /hủy thao tác/i,
  });

  await btnCancel.waitFor({ state: 'visible', timeout: 15000 });
  await btnCancel.click();
}



  







async selectMantineByName(
  fieldName: RegExp | string,
  optionText: string
) {
  const wrapper = this.page
    .locator('div.mantine-InputWrapper-root')
    .filter({
      has: this.page.locator('label').filter({
        hasText:
          fieldName instanceof RegExp
            ? fieldName
            : new RegExp(fieldName, 'i'),
      }),
    })
    .first();

  await wrapper.waitFor({ state: 'visible', timeout: 15000 });
  await wrapper.scrollIntoViewIfNeeded();

  const input = wrapper.locator('input.mantine-Select-input').first();
  await input.waitFor({ state: 'visible', timeout: 15000 });

  await this.page.keyboard.press('Escape');
  // await this.page.waitForTimeout(300);

  await input.click({ force: true });
  // await this.page.waitForTimeout(400);

  await input.fill(optionText.slice(0, 4));
  // await this.page.waitForTimeout(400);

  // 🔥 CHỐT: match chính xác option
  const option = this.page.getByRole('option', {
    name: new RegExp(`^${optionText}$`, 'i'),
  });

  await option.waitFor({ state: 'visible', timeout: 15000 });
  await option.click();

  await this.page.keyboard.press('Escape');
  // await this.page.waitForTimeout(300);
}






async fillRequiredFields(options?: { sdt?: string; hoTen?: string; }) {
  // 1️⃣ Họ tên
  await this.hoTenInput.click();
  // await this.hoTenInput.fill('Auto');
  await this.hoTenInput.fill(options?.hoTen ?? 'Auto');
 

  // 2️⃣ Ngày sinh
  await this.ngaySinhInput.click();
  await this.ngaySinhInput.fill('01/01/1999');


  // 3️⃣ Giới tính
  await this.gioiTinhNam.check();

  // 4️⃣ SĐT
  await this.sdtInput.click();
  await this.sdtInput.fill(options?.sdt ?? '0901234567');


  // 5️⃣ Các Mantine Select (đã ổn)
  await this.selectMantineByName(/Quốc tịch/i, 'Việt Nam');
  await this.selectMantineByName(/Tỉnh.*Thành/i, 'Thành phố Hồ Chí Minh');
  await this.selectMantineByName(/Phường.*Xã/i, 'Xã Bình Châu');
  await this.selectMantineByName(/Dân tộc/i, 'Kinh');
  await this.selectMantineByName(/Vào khoa/i, 'Gây mê hồi sức');
  await this.selectMantineByName(/Vào phòng/i, 'Buồng GMHS 1');

  // 🔥 QUAN TRỌNG NHẤT – đảm bảo form validate xong
  // await this.page.keyboard.press('Tab');
  // await this.page.waitForTimeout(300);
  await expect(this.tiepNhanButton).toBeEnabled({ timeout: 15000 });
}




  async fillOptionalFields(options?: {
  ngheNghiep?: string;
  noiLamViec?: string;
  trinhDoVanHoa?: string;
  diaChi?: string;
  soCCCD?: string;
  ngayCap?: string;
  noiCap?: string;
}) {
  

  if (options?.ngheNghiep) {
    await this.fillOptionalTextbox(/Nghề nghiệp/i, options.ngheNghiep); // ← Thay từ selectOptionalMantine thành fillOptionalTextbox
  }

  if (options?.noiLamViec) {
    await this.fillOptionalTextbox(/Nơi làm việc/i, options.noiLamViec);
  }

  if (options?.trinhDoVanHoa) {
    await this.fillOptionalTextbox(/Trình độ văn hóa/i, options.trinhDoVanHoa); // ← Thay từ selectOptionalMantine thành fillOptionalTextbox
  }

  if (options?.diaChi) {
    await this.fillOptionalTextbox(/Địa chỉ/i, options.diaChi);
  }

  if (options?.soCCCD) {
    await this.fillOptionalTextbox(/Số CCCD/i, options.soCCCD);
  }

  if (options?.ngayCap) {
    await this.fillOptionalTextbox(/Ngày cấp/i, options.ngayCap);
  }

  if (options?.noiCap) {
    await this.fillOptionalTextbox(/Nơi cấp/i, options.noiCap);
  }
// Ngày cấp
// if (options?.ngayCap) {
//   const ngayCap = this.page.locator(
//     'input[data-path="benhnhan.benhnhanCmndNgaycap"]'
//   );
//   await ngayCap.fill(options.ngayCap);
//   await ngayCap.press('Enter'); // cần cho Mantine DateInput
// }

// // Nơi cấp
// if (options?.noiCap) {
//   const noiCap = this.page.locator(
//     'input[data-path="benhnhan.benhnhanCmndNoicap"]'
//   );
//   await noiCap.fill(options.noiCap);
// }

}
  // ===============================
 
 async clickTiepNhan() {
  await this.tiepNhanButton.click();
}



 

async verifyCapNhatSuccessToast() {

  // ✅ CHỈ lấy Mantine notification toast (tránh __next-route-announcer__)
  const toast = this.page.locator(
    'div[role="alert"].mantine-Notifications-notification'
  ).first();

  await toast.waitFor({
    state: 'visible',
    timeout: 15000,
  });

  // ✅ chỉ check "thành công" cho chắc chắn
  await expect(toast).toContainText(/thành công/i);

  
}





  // / ===== REQUIRED Mantine Select (FAIL nếu không chọn được)
  async selectMantineRequired(labelText: RegExp, optionText: string) {
    const label = this.page.locator('label').filter({ hasText: labelText }).first();
    const input = label
      .locator('..')
      .locator('input[type="text"], input[title="select"]')
      .first();

    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.scrollIntoViewIfNeeded();

    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);

    await input.click();
    await this.page.waitForTimeout(800);

    const option = this.page.getByRole('option', {
      name: optionText,
      exact: true,
    });

    await option.waitFor({ state: 'visible', timeout: 15000 });
    await option.click();

    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);
  }

  // ===== OPTIONAL Mantine Select (KHÔNG FAIL)
  async selectOptionalMantine(labelText: RegExp, optionText: string) {
    const label = this.page.locator('label').filter({ hasText: labelText });

    if (await label.count() === 0) {
      console.log(`⚠️ Không có field ${labelText} – skip`);
      return;
    }

    const input = label
      .first()
      .locator('..')
      .locator('input[type="text"], input[title="select"]')
      .first();

    if (!(await input.isVisible())) {
      console.log(`⚠️ Field ${labelText} không visible – skip`);
      return;
    }

    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);

    await input.click();
    await this.page.waitForTimeout(800);

    const option = this.page.getByRole('option', {
      name: optionText,
      exact: true,
    });

    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();

    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);
  }

  // ===== OPTIONAL TEXTBOX
  async fillOptionalTextbox(labelText: RegExp, value: string) {
  const label = this.page.locator('label').filter({ hasText: labelText }).first();

  if (await label.count() === 0) {
    console.log(`⚠️ Không có field ${labelText} – skip`);
    return;
  }

  // ✅ Scroll tới label để Mantine render input
  await label.scrollIntoViewIfNeeded();
  await this.page.waitForTimeout(300);

  // ✅ Wrapper gần nhất của Mantine
  const wrapper = label.locator('xpath=ancestor::div[contains(@class,"mantine-InputWrapper")]');

  const input = wrapper.locator('input, textarea').first();

  await input.waitFor({ state: 'visible', timeout: 5000 });

  await input.fill(value);
}


async updateSoDienThoai(newPhone: string) {
  console.log(`📱 Update SĐT = ${newPhone}`);

  const phoneInput = this.page.getByLabel(/SĐT/i).first();

  await phoneInput.waitFor({ state: 'visible', timeout: 15000 });

  await phoneInput.click();
  await phoneInput.fill('');
  await phoneInput.fill(newPhone);
}

async clickLuuCapNhat() {
  // console.log('💾 Click nút Lưu cập nhật');

  const btn = this.page.getByRole('button', {
    name: 'Lưu cập nhật',
    exact: true,
  });

  await btn.waitFor({ state: 'visible', timeout: 15000 });
  await btn.click();
}


async traCuuTheoMaBN(maBN: string) {
  const part1 = maBN.slice(0, 2);
  const part2 = maBN.slice(2, 4);
  const part3 = maBN.slice(4);

  const radio = this.page.getByRole('radio', { name: /mã bệnh nhân/i });
  await radio.check();

  //  Lấy 3 input ngay sau radio (following input)
  const inputs = radio.locator(
    'xpath=following::input[contains(@class,"mantine-TextInput-input")][position()<=3]'
  );

  await expect(inputs).toHaveCount(3);

  await inputs.nth(0).click();
  await inputs.nth(0).fill(part1);

  await inputs.nth(1).click();
  await inputs.nth(1).fill(part2);

  await inputs.nth(2).click();
  await inputs.nth(2).fill(part3);

  await this.page.getByRole('button', { name: /tra cứu thông tin/i }).click();
}


async traCuuTheoCCCD(cccd: string) {
  // 1️⃣ Chọn radio CCCD/CMND
  await this.page
    .getByRole('radio', { name: /cccd|cmnd/i })
    .check();

  // 2️⃣ Lấy đúng input theo placeholder
  const input = this.page.getByPlaceholder(
    /mã bệnh nhân hoặc cccd/i
  );

  await input.fill('');
  await input.fill(cccd);

  // 3️⃣ Click tra cứu
  await this.page
    .getByRole('button', { name: /tra cứu thông tin/i })
    .click();

  // 4️⃣ Business wait: chờ form được fill
  await expect(this.hoTenInput).not.toHaveValue('');
}

async verifyTraCuuThanhCong() {
  await expect(this.hoTenInput).not.toHaveValue('');
}




}//


