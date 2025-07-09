const { chromium } = require('playwright'); // ← import ではなく require に変更

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://business.tiktok.com/ja');

  const popupPromise = page.waitForEvent('popup');
  await page.click('text=ログイン');
  const popup = await popupPromise;

  console.log('🛑 ログイン完了後、ターミナルで Enter を押してください');
  process.stdin.resume();
  process.stdin.once('data', async () => {
    await context.storageState({ path: 'auth.json' });
    console.log('✅ auth.json に保存されました');
    await browser.close();
    process.exit();
  });
})();
