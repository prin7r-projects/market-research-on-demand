#!/usr/bin/env node
/**
 * [CITED_SHOTS] Capture desktop + mobile fullPage screenshots from the live deploy.
 *
 * Requires: pnpm dlx playwright install chromium  (one-time, ~150MB).
 * Output:   docs/screenshots/landing-desktop.png   (1440x900, fullPage, dpr=2)
 *           docs/screenshots/landing-mobile.png    (390x844,  fullPage, dpr=2)
 *
 * Re-run after any landing-affecting commit before sign-off.
 */
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const URL_LIVE = "https://market-research-on-demand.prin7r.com";
const OUT_DIR = resolve(REPO_ROOT, "docs/screenshots");
mkdirSync(OUT_DIR, { recursive: true });

async function capture(name, contextOptions) {
  console.log(`[CITED_SHOTS] launching browser for ${name}`);
  const browser = await chromium.launch();
  const context = await browser.newContext({
    deviceScaleFactor: 2,
    ...contextOptions
  });
  const page = await context.newPage();
  console.log(`[CITED_SHOTS] navigating ${URL_LIVE}`);
  await page.goto(URL_LIVE, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2000); // let custom fonts render
  const out = resolve(OUT_DIR, `landing-${name}.png`);
  await page.screenshot({ path: out, fullPage: true });
  console.log(`[CITED_SHOTS] wrote ${out}`);
  await browser.close();
}

await capture("desktop", { viewport: { width: 1440, height: 900 } });
await capture("mobile", {
  ...devices["iPhone 14"],
  viewport: { width: 390, height: 844 }
});
console.log("[CITED_SHOTS] done");
