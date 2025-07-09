import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: 'auth.json' // ✅ 保存済みログイン状態を再利用
  });

  const page = await context.newPage();
  await page.goto('https://business.tiktok.com/ads/manager/report');

  // ✅ 一時停止して操作を記録できるモードにする
  await page.pause();

  // ⬆️ ここからマウス操作・入力をPlaywright UIから行うと、
  //     コンソールに対応するコードがリアルタイム表示される

  // 🎯 操作が終わったら Ctrl+C で終了、コードをコピー
})();
