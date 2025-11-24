const { chromium } = require('playwright');

async function captureScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  const pages = [
    { url: 'http://localhost:5173/', name: 'home' },
    { url: 'http://localhost:5173/loan-analysis', name: 'loan-analysis' },
    { url: 'http://localhost:5173/deposit-analysis', name: 'deposit-analysis' },
    { url: 'http://localhost:5173/summary', name: 'summary' }
  ];

  for (const p of pages) {
    await page.goto(p.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `screenshots/${p.name}.png`,
      fullPage: true
    });
    console.log(`Captured: ${p.name}.png`);
  }

  await browser.close();
  console.log('All screenshots captured!');
}

captureScreenshots().catch(console.error);
