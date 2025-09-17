import { test, expect } from '@playwright/test';
import { makeUser } from './utils/faker';
import { Checkout } from './pages/checkOutPage';

test('complete ticket booking flow and fill form for 5 applicants', async ({ page }) => {
  await page.goto('https://konfhub.com/stepin-summit-2025/');
  await page.getByRole('button', { name: /buy now/i }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: /^add$/i }).click();
  // Increase ticket quantity to 5 by clicking "+" button 4 times (default is 1)
  const plusButton = await page.getByRole('button', { name: '+' });
  for (let i = 0; i < 4; i++) {
    await plusButton.click();
    await page.waitForTimeout(300); // wait for UI update
  }
  await page.getByRole('button', { name: /proceed/i }).click();
  // Wait for the first applicant's name input to be visible before filling the form
  await page.getByLabel('Name*').first().waitFor({ state: 'visible', timeout: 10000 });
  // Fill the form for 5 applicants using faker-generated data
  const checkout = new Checkout(page);
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

  // Click the Copy Details button after filling the form for 5 applicants
  await page.click('button.copy-button');

  // Reveal the Buyer Details section by clicking the "Buyer Details" heading or toggle button
  // Toggle the React switch for Buyer Details
  const buyerDetailsSwitch = page.locator('.react-switch-bg').first();
  await buyerDetailsSwitch.waitFor({ state: 'visible', timeout: 10000 });
  await buyerDetailsSwitch.click();

  // Verify buyer name and email match the first applicant
  const buyerName = await page.getByRole('textbox', { name: 'Name', exact: true }).inputValue();
  const buyerEmail = await page.getByRole('textbox', { name: 'Email', exact: true }).inputValue();
  expect(buyerName).toBe(user.name);
  expect(buyerEmail).toBe(user.emailOfficial);
  console.log('Buyer details verified successfully', buyerName);
  console.log('Buyer email verified successfully', buyerEmail);
  // Click the Checkout button
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Checkout' }).click();
  // Click on Pay with UPI payment method
  await page.waitForTimeout(300);
  await page.getByText('Pay with UPI').first().click();

  // Get the value from the total summary
  const totalText = await page.locator('div.summary-total').first().textContent();
  // Extract the total value using regex (assumes format like 'Total: ₹1234')
  const totalMatch = totalText && totalText.match(/Total\s*[:₹]\s*([\d,.]+)/i);
  const totalValue = totalMatch ? totalMatch[1] : null;
  // Save for future assertions
  expect(totalValue).not.toBeNull();
  console.log('Total value extracted from summary:', totalValue);

  // await page.getByRole('button', { name: 'Proceed to Payment' }).click();
  // await page.waitForTimeout(1000);

  // Get the value from the price summary popup (select only the "Total" element)
  // const popupTotalLocator = page.getByText(/^Total/i).locator('..').locator('..').locator('div.price-summary');
  // const popupPriceText = await popupTotalLocator.textContent();
  // // Extract the price value using regex (assumes format like 'Total: ₹1234' or similar)
  // const popupPriceMatch = popupPriceText && popupPriceText.match(/Total\s*[:₹]\s*([\d,.]+)/i);
  // const popupPriceValue = popupPriceMatch ? popupPriceMatch[1] : null;
  // expect(popupPriceValue).not.toBeNull();
  // // Assert popup price matches the previously saved total value
  // expect(popupPriceValue).toBe(totalValue);
});