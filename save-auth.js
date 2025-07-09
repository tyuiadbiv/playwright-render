import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // ✅ ログイン画面へ移動
  await page.goto('https://business.tiktok.com/ja');

  // ✅ ログインボタンをクリックして、手動ログイン開始（Googleなど含む）
  const popupPromise = page.waitForEvent('popup');
  await page.click('text=ログイン'); // ログインリンクのテキスト
  const popup = await popupPromise;

  // ✅ ここで手動ログインしてください（GoogleログインもOK）
  console.log('🛑 ログイン完了後、ターミナルで Enter を押してください');
  process.stdin.resume();
  process.stdin.once('data', async () => {
    await context.storageState({ path: 'auth.json' });
    console.log('✅ auth.json に保存されました');
    await browser.close();
    process.exit();
  });
})();
