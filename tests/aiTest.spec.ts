import { test, expect } from '@playwright/test';
import {ai} from '@zerostep/playwright'
import { beforeEach } from 'node:test';

test.describe.skip('Ai test run', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://stepinsummit.stepinforum.org/conference-agenda/');
    });

test('Test-1 ', async ({ page }) => {
  await ai('click on home',{page,test})
  await page.waitForURL('https://stepinsummit.stepinforum.org/')
  await ai('assert the page title contains "Conference Agenda | STeP-IN SUMMIT 2025"',{page,test})

  });

test('Book Now opens KonfHub in new tab and proceed', async ({ page }) => {
  test.setTimeout(60000)
  await ai('Navigate to homepage',{page,test})
  await page.waitForURL('https://stepinsummit.stepinforum.org/')

  const popupPromise = page.waitForEvent('popup');
  await ai('Click on "BOOK NOW" in the header', { page, test });

  const newPage = await popupPromise;
  await newPage.waitForLoadState('domcontentloaded');

  await expect(newPage).toHaveURL(/https?:\/\/(www\.)?konfhub\.com\/.*stepin.*summit/i);

  await expect(newPage.locator('button', { hasText: 'buy now' })).toBeVisible();

  await ai('Click on "Buy Now"', { page: newPage, test });
  await newPage.waitForTimeout(10000);
  await ai('click on Add',{page:newPage,test})

  await ai('click on + 4 times',{page:newPage,test})

  await ai('click on Proceed',{page:newPage,test})

  //await ai('Fill in the form with realistic values for name, official email, personal email address, phone number:9449348576, designation, organisation',{page:newPage, test})
});


  test('Test-3', async ({ page }) => {
    
  });

  test('Test-4', async ({ page }) => {
    
  });

  test('Test-5', async ({ page }) => {
    
  });

  test('Test-6', async ({ page }) => {
    
  });
});

