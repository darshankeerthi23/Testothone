import { test, expect } from '@playwright/test';

test('Conference Agenda - Author Vipul Kocher', async ({ page, context }) => {
  // 1. Navigate to the summit site
  await page.goto('https://stepinsummit.stepinforum.org/');

  // 2. Click Conference Agenda (menu link)
  await page.waitForTimeout(3000);
  await page.locator('#nav_menu18').getByRole('listitem').filter({ hasText: 'Conference Agenda' }).click();
  //wait agendaLink.first().scrollIntoViewIfNeeded();;
  await page.waitForTimeout(1000);

  // 3. Click the first author Vipul Kocher
  const authorLink = page.locator('text=Vipul Kocher');
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    authorLink.first().click(),
  ]);
  await page.waitForTimeout(1000);

  // 4. Switch to new tab if opened, else stay on current page
  const authorPage = newPage || page;
  await authorPage.waitForLoadState('domcontentloaded');

  // 5. Verify the author page shows the name “Vipul Kocher”
  await expect(authorPage.locator('text=Vipul Kocher')).toBeVisible();
});
