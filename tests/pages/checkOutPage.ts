import { expect, Page, Locator } from '@playwright/test';

export class Checkout {
  constructor(private page: Page) {}

  // ---------- Lazy locators (single) – kept for backward compatibility ----------
  get nameInput(): Locator {
    return this.page.getByLabel(/name/i)
      .or(this.page.getByRole('textbox', { name: /name/i }));
  }
  get officialEmailInput(): Locator {
    return this.page.locator('[id="35524-0-desktop-1"]');
  }
  get personalEmailInput(): Locator {
    return this.page.locator('[id="35524-0-desktop-2"]');
  }
  get phoneInput(): Locator {
    return this.page.locator('.form-control.input-tel').first();
  }
  get designationInput(): Locator {
    return this.page.getByRole('textbox', { name: /designation/i });
  }
  get organisationInput(): Locator {
    return this.page.getByRole('textbox', { name: /organisation|organization/i });
  }
  get industryInput(): Locator {
    return this.page.getByRole('textbox', { name: /industry/i });
  }
  get addressInput(): Locator {
    return this.page.getByRole('textbox', { name: /address/i });
  }
  get cityInput(): Locator {
    return this.page.getByRole('textbox', { name: /city/i });
  }
  get referralDropdown(): Locator {
    // react-select input; your class seems stable on this page
    return this.page.locator('.css-19bb58m').first();
  }
  get submitBtn(): Locator {
    return this.page.getByRole('button', { name: /pay|submit|continue|confirm|proceed/i });
  }

  // ---------- Indexed lists (NEW) ----------
  private nameInputsAll(): Locator {
    return this.page.getByLabel(/name/i)
      .or(this.page.getByRole('textbox', { name: /name/i }));
  }
  private officialEmailInputsAll(): Locator {
    return this.page.locator('[id="35524-0-desktop-1"]')
      .or(this.page.getByRole('textbox', { name: /official.*email/i }));
  }
  private personalEmailInputsAll(): Locator {
    return this.page.locator('[id="35524-0-desktop-2"]')
      .or(this.page.getByRole('textbox', { name: /personal.*email/i }));
  }
  private phoneInputsAll(): Locator {
    return this.page.locator('.form-control.input-tel');
  }
  private designationInputsAll(): Locator {
    return this.page.getByRole('textbox', { name: /designation/i });
  }
  private organisationInputsAll(): Locator {
    return this.page.getByRole('textbox', { name: /organisation|organization/i });
  }
  private industryInputsAll(): Locator {
    return this.page.getByRole('textbox', { name: /industry/i });
  }
  private addressInputsAll(): Locator {
    return this.page.getByRole('textbox', { name: /address/i });
  }
  private cityInputsAll(): Locator {
    return this.page.getByRole('textbox', { name: /city/i });
  }
  private referralDropdownsAll(): Locator {
    return this.page.locator('.css-19bb58m');
  }

  // Nth helpers (NEW)
  nameInputAt(index: number): Locator { return this.nameInputsAll().nth(index); }
  officialEmailInputAt(index: number): Locator { return this.officialEmailInputsAll().nth(index); }
  personalEmailInputAt(index: number): Locator { return this.personalEmailInputsAll().nth(index); }
  phoneInputAt(index: number): Locator { return this.phoneInputsAll().nth(index); }
  designationInputAt(index: number): Locator { return this.designationInputsAll().nth(index); }
  organisationInputAt(index: number): Locator { return this.organisationInputsAll().nth(index); }
  industryInputAt(index: number): Locator { return this.industryInputsAll().nth(index); }
  addressInputAt(index: number): Locator { return this.addressInputsAll().nth(index); }
  cityInputAt(index: number): Locator { return this.cityInputsAll().nth(index); }
  referralDropdownAt(index: number): Locator { return this.referralDropdownsAll().nth(index); }

  // ---------- Helpers ----------
  private async waitVisible(l: Locator) {
    await l.scrollIntoViewIfNeeded();
    await l.waitFor({ state: 'visible' });
  }

  private async fillWithRetry(l: Locator, value: string) {
    await this.waitVisible(l);
    await l.fill('');
    await l.fill(value);
    try {
      await expect(l).toHaveValue(value, { timeout: 1500 });
    } catch {
      await this.page.waitForTimeout(200);
      await l.fill('');
      await l.fill(value);
      await expect(l).toHaveValue(value, { timeout: 1500 });
    }
  }

  private async typePhoneSmartAt(index: number, raw10Digits: string) {
    const phone = this.phoneInputAt(index);
    await this.waitVisible(phone);
    await phone.click();
    await phone.fill('');

    const ph = await phone.getAttribute('placeholder');
    const toType = ph && /\+91/.test(ph) ? `+91 ${raw10Digits}` : raw10Digits;

    await phone.type(toType, { delay: 500 });
    // blur onto some other field in the same row if possible
    const desig = this.designationInputAt(index);
    if (await desig.isVisible().catch(() => false)) {
      await desig.click();
    } else {
      await this.page.keyboard.press('Tab');
    }
    await expect(phone).toHaveValue(/(\+?91[\s-]*)?\d{10}$/, { timeout: 2000 });
  }

  async selectReferral(label: string, index = 0) {
    const dd = this.referralDropdownAt(index);
    await this.waitVisible(dd);
    await dd.click();

    const option = this.page.getByRole('option', { name: new RegExp(label, 'i') });
    if (await option.isVisible().catch(() => false)) {
      await option.first().click();
    } else {
      // fallback: pick the first available option
      await this.page.locator('[id^="react-select"]').first().click();
    }
    await this.page.waitForTimeout(200);
  }

  // ---------- Public actions ----------
  /**
   * NEW: Fill attendee at a specific index (0-based)
   */
  async fillFormTwoPhaseAt(data: {
    name: string;
    emailOfficial: string;
    emailPersonal: string;
    phone: string;
    designation: string;
    organisation: string;
    industry: string;
    address: string;
    city: string;
  }, index: number) {
    // Let the row mount
    await this.nameInputAt(index).waitFor({ state: 'visible' });
    await this.page.waitForTimeout(100);

    // Phase 1: stable fields
    await this.fillWithRetry(this.nameInputAt(index), data.name);
    await this.fillWithRetry(this.officialEmailInputAt(index), data.emailOfficial);
    await this.fillWithRetry(this.personalEmailInputAt(index), data.emailPersonal);

    // Phone (masked) + commit
    await this.typePhoneSmartAt(index, data.phone);
    await this.page.waitForTimeout(150);

    // Phase 2: remaining
    await this.fillWithRetry(this.designationInputAt(index), data.designation);
    await this.fillWithRetry(this.organisationInputAt(index), data.organisation);
    await this.fillWithRetry(this.industryInputAt(index), data.industry);
    await this.fillWithRetry(this.addressInputAt(index), data.address);
    await this.fillWithRetry(this.cityInputAt(index), data.city);

    await this.page.waitForTimeout(100);
  }

  /**
   * Backward-compatible: fills the FIRST attendee (index 0)
   */
  async fillFormTwoPhase(data: {
    name: string;
    emailOfficial: string;
    emailPersonal: string;
    phone: string;
    designation: string;
    organisation: string;
    industry: string;
    address: string;
    city: string;
  }) {
    await this.fillFormTwoPhaseAt(data, 0);
  }
}
