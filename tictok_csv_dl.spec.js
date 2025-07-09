const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://business.tiktok.com/ads/manager/report');
  await page.getByText('Yaaha004 Yaaha004 代理店 ID：').click();
  await page.getByRole('button', { name: 'スキップ' }).click();
  await page.getByText('広告アカウント 新登場').click();
  await page.getByTestId('ks-input-index-gYhNPj').click();
  await page.getByTestId('ks-input-index-gYhNPj').press('KanjiMode');
  await page.getByText('バイトル(Yaaha)').click();
  const page1Promise = page.waitForEvent('popup');
  await page.locator('button').filter({ hasText: '広告マネージャー' }).click();
  const page1 = await page1Promise;
  await page1.getByText('Custom reports').click();
  await page1.getByRole('row', { name: 'バイトル Looker用  Edit  Export  Delete  Copy', exact: true }).getByTestId('overflow-tooltip-overflow-tooltip-owdvbV').click();
  await page1.getByRole('button', { name: 'Export' }).click();
  await page1.locator('label').filter({ hasText: 'csv' }).click();
  const downloadPromise = page1.waitForEvent('download');
  await page1.getByRole('dialog').getByRole('button', { name: 'Export' }).click();
  const download = await downloadPromise;

  // ---------------------
  await context.close();
  await browser.close();
})();