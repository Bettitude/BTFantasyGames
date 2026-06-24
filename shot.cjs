const { chromium } = require('playwright-core');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:3001';
const OUT = 'C:/Users/oreto/AppData/Local/Temp/claude/c--Users-oreto-Desktop-new/24e242fe-5c1b-4e44-944a-9d0ae60d9756/scratchpad';

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const ctx = await browser.newContext({ viewport: { width: 375, height: 1400 } });
  const page = await ctx.newPage();

  await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle' });
  await page.click('text=Try Demo');
  await page.waitForTimeout(500);

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const homeTable = await page.$('table');
  if (homeTable) await homeTable.screenshot({ path: `${OUT}/home_table_375.png` });

  await page.goto(`${BASE}/leagues`, { waitUntil: 'networkidle' });
  await page.click('text=Global');
  await page.waitForTimeout(800);
  const leaguesTable = await page.$('table');
  if (leaguesTable) await leaguesTable.screenshot({ path: `${OUT}/leagues_table_375.png` });
  else console.log('no leagues table found (maybe empty data)');

  await browser.close();
})();
