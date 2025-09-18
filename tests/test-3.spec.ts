import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://stepinsummit.stepinforum.org/');
  await page.locator('#nav_menu12').getByRole('link', { name: 'Conference Agenda' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Vipul Kocher' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('heading', { name: 'Vipul Kocher' }).click();
  const page2Promise = page1.waitForEvent('popup');
  await page1.locator('#elementor-header').getByRole('link', { name: 'Book Now' }).click();
  const page2 = await page2Promise;
  await page2.getByRole('button', { name: 'Buy Now' }).click();
  await page2.getByRole('button', { name: 'Add' }).click();
});