const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext({
    storageState: 'auth.json',
    acceptDownloads: true,
  });

  const page = await context.newPage();

  // TikTok広告マネージャ レポートページへ
  await page.goto('https://business.tiktok.com/ads/manager/report');

  // 初期UI操作
  await page.getByRole('button', { name: 'ホーム' }).click();
  await page.getByText('Yaaha004 Yaaha004 代理店 ID：').click();
  await page.getByRole('button', { name: 'スキップ' }).click();
  await page.getByText('広告アカウント 新登場').click();

  // バイトル入力 → 選択
  await page.waitForSelector('[data-testid="ks-input-index-gYhNPj"]', { timeout: 10000 });
  const input = page.locator('[data-testid="ks-input-index-gYhNPj"]');
  await input.click({ force: true });
  await input.fill('');
  await input.type('バイトル', { delay: 100 });
  await page.waitForTimeout(1500);
  await page.click('text=バイトル(Yaaha)');

  // 広告マネージャー → 新しいウィンドウへ
  const page1Promise = page.waitForEvent('popup');
  await page.locator('button', { hasText: '広告マネージャー' }).click();
  const page1 = await page1Promise;

  // Analytics に hover → Custom Reports 遷移
  await page1.getByText('Analytics', { exact: true }).hover();
  await page1.waitForTimeout(1000);
  await page1.click('text=Custom reports');

  // バイトル Looker用 をクリック
  const row = page1.locator('tr', { hasText: 'バイトル Looker用' }).first();
  await row.waitFor({ state: 'visible', timeout: 10000 });
  await row.hover();
  const detailItem = page1.locator('text=バイトル Looker用').nth(1);
  await detailItem.waitFor({ state: 'visible', timeout: 5000 });
  await detailItem.click();
  console.log('✅ バイトル Looker用 をクリックしました');

  // ✅ ページ遷移を待つ（重要）
  await page1.waitForNavigation({ waitUntil: 'networkidle' });
  await page1.waitForTimeout(1000); // UI安定化

  // Export ボタンが enabled になるまで待機
  const exportButton = page1.getByRole('button', { name: 'Export' });
  await exportButton.waitFor({ state: 'visible', timeout: 15000 });

  let isEnabled = await exportButton.isEnabled();
  const maxWait = 15000;
  const interval = 500;
  let waited = 0;

  while (!isEnabled && waited < maxWait) {
   console.log(`🔄 Exportボタン待機中... (${waited}ms)`);

    await page1.waitForTimeout(interval);
    isEnabled = await exportButton.isEnabled();
    waited += interval;
  }

  if (!isEnabled) {
    console.log('⚠️ Exportボタンが有効化されませんでした。中断します。');
    await browser.close();
    return;
  }

  await exportButton.click();
  console.log('✅ Exportボタンをクリックしました');

  // CSV選択モーダルが出るまで待機
  await page1.waitForTimeout(4000); // Export押下後の描画猶予
  const csvOption = await page1.waitForSelector('label:has-text("csv")', { timeout: 10000 });
  await csvOption.click();
  console.log('✅ CSV形式を選択しました');

  // ダウンロード処理
  const downloadPromise = page1.waitForEvent('download');
  await page1.getByRole('dialog').getByRole('button', { name: 'Export' }).click();
  const download = await downloadPromise;

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const filePath = path.join(__dirname, `report-${today}.csv`);
  await download.saveAs(filePath);

  console.log(`✅ ダウンロード完了: ${filePath}`);

  await context.close();
  await browser.close();
})();
