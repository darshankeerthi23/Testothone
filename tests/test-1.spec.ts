import { test, expect } from '@playwright/test';
import { Checkout } from './pages/checkOutPage';
import { makeUser } from './utils/faker';

test('fills KonfHub checkout form', async ({ page }) => {
  // 1) Open site and popup
    test.setTimeout(60000)
  await page.goto('https://stepinsummit.stepinforum.org/', { waitUntil: 'domcontentloaded' });

  const popup = page.waitForEvent('popup');
  await page.locator('#elementor-header').getByRole('link', { name: /book now/i }).click();
  const page6 = await popup;
  await page6.waitForLoadState('domcontentloaded');

  // Optional diagnostics while stabilizing
  page6.on('framenavigated', f => console.log('[navigated]', f.url()));
  page6.on('console', msg => console.log('[console]', msg.type(), msg.text()));

  // 2) Ticket selection
  await page6.getByRole('button', { name: /buy now/i }).click();
  await page6.getByRole('button', { name: /^add$/i }).click();
  for (let i = 0; i < 4; i++) {
    await page6.getByRole('button', { name: /^\+\s*$/ }).click();
  }
  await page6.getByRole('button', { name: /proceed/i }).click();

  // 3) Fill checkout (two-phase inside PO)
  const checkout = new Checkout(page6);
  const user = makeUser();
  await checkout.fillFormTwoPhase(user);

  await expect(checkout.nameInput).toHaveValue(user.name);
  await expect(checkout.officialEmailInput).toHaveValue(user.emailOfficial);
  await expect(checkout.personalEmailInput).toHaveValue(user.emailPersonal);
  await expect(checkout.phoneInput).toHaveValue(/(\+?91[\s-]*)?\d{10}$/);
  await expect(checkout.designationInput).not.toBeEmpty();
  await expect(checkout.organisationInput).not.toBeEmpty();
  await expect(checkout.industryInput).not.toBeEmpty();
  await expect(checkout.addressInput).not.toBeEmpty();
  await expect(checkout.cityInput).not.toBeEmpty();
  await checkout.selectReferral('email');
  // If you want to continue:
  // await checkout.submit();
});

