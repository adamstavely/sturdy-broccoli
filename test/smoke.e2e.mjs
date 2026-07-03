/**
 * Self-contained browser smoke test for <mcaap-onboarding>, run against the demo
 * shell (src/index.html) — no real app required.
 *
 *   npm run build         # emit www/ first
 *   npm run test.smoke    # (optionally CHROME_BIN=/path/to/chrome)
 *
 * Verifies the integration seam (navigateHandler), deep-linking + spotlight upgrade,
 * dialog a11y attributes, analytics events, keyboard nav, and content validation.
 * This is a starting point; migrate to @stencil/playwright for a CI-grade suite.
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';
import puppeteer from 'puppeteer';

const WWW = join(dirname(fileURLToPath(import.meta.url)), '..', 'www');
const CHROME = process.env.CHROME_BIN || process.env.PUPPETEER_EXECUTABLE_PATH ||
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.css': 'text/css', '.map': 'application/json' };

const server = http.createServer(async (req, res) => {
  try {
    const rel = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
    const file = join(WWW, rel === '/' ? 'index.html' : rel);
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('not found'); }
});

const fails = [];
const ok = (name, cond, extra) => { console.log(`${cond ? '✓' : '✗'} ${name}`); if (!cond) fails.push(name + (extra ? ` — ${extra}` : '')); };

await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const errors = [];
try {
  const page = await browser.newPage();
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(base, { waitUntil: 'networkidle0' });
  await page.evaluate(() => customElements.whenDefined('mcaap-onboarding'));

  const v = await page.evaluate(() => document.querySelector('mcaap-onboarding').validate());
  ok('content validation is clean', v.content.length === 0, JSON.stringify(v.content));
  ok('all 10 page hints discovered', v.pages.length === 10, `got ${v.pages.length}`);
  ok('header anchors resolve on dashboard', v.anchorsFound.length === 7, `got ${v.anchorsFound.length}`);

  const r = await page.evaluate(async () => {
    const onb = document.querySelector('mcaap-onboarding');
    onb.start('clearance');
    await new Promise(r => setTimeout(r, 500));
    const sr = onb.shadowRoot, dlg = sr.querySelector('[role="dialog"]');
    return {
      navigated: !!document.querySelector('[data-tour="ws-header"]'),
      spotlight: !!sr.querySelector('.hole'),
      ariaModal: dlg && dlg.getAttribute('aria-modal'),
      labelled: !!(dlg && sr.querySelector('#' + dlg.getAttribute('aria-labelledby'))),
      events: document.getElementById('log').textContent,
    };
  });
  ok('deep-link navigated to the target page', r.navigated);
  ok('spotlight rendered on cross-page step (F1)', r.spotlight);
  ok('dialog is aria-modal', r.ariaModal === 'true');
  ok('dialog is labelled by an existing node', r.labelled);
  ok('analytics: mcaapTourStarted fired', r.events.includes('mcaapTourStarted'));
  ok('analytics: mcaapNavigate fired', r.events.includes('mcaapNavigate'));

  const before = await page.evaluate(() => document.querySelector('mcaap-onboarding').shadowRoot.querySelector('.count').textContent);
  await page.keyboard.press('ArrowRight');
  await new Promise(r => setTimeout(r, 300));
  const after = await page.evaluate(() => document.querySelector('mcaap-onboarding').shadowRoot.querySelector('.count').textContent);
  ok('ArrowRight advances the step', before !== after, `${before} -> ${after}`);

  ok('no console errors', errors.length === 0, errors.join(' | '));
} finally {
  await browser.close();
  server.close();
}

console.log(fails.length ? `\nFAILED (${fails.length}):\n- ${fails.join('\n- ')}` : '\nAll smoke checks passed.');
process.exit(fails.length ? 1 : 0);
