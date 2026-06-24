const { chromium } = require('playwright-core');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:3001';
const OUT = 'C:/Users/oreto/AppData/Local/Temp/claude/c--Users-oreto-Desktop-new/24e242fe-5c1b-4e44-944a-9d0ae60d9756/scratchpad';

const PUBLIC_ROUTES = ['/', '/players', '/fixtures', '/leagues', '/search?q=a', '/auth/login', '/auth/signup'];
const AUTH_ROUTES = ['/build', '/my-team', '/transfers', '/points', '/chat'];

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
  const page = await ctx.newPage();

  // sign in via demo button first so authed routes render real content
  await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle' });
  await page.click('text=Try Demo');
  await page.waitForTimeout(500);

  const routes = [...PUBLIC_ROUTES, ...AUTH_ROUTES];
  for (const route of routes) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(600);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(`375px ${route.padEnd(20)} overflowPx=${overflow}`);
    if (overflow > 2) {
      const safe = route.replace(/[\/?=]/g, '_') || 'home';
      await page.screenshot({ path: `${OUT}/sweep_375${safe}.png`, fullPage: true });
    }
  }

  await browser.close();
})();
