/**
 * Renders brand/og-template.html to the Open Graph card at public/og.png.
 *
 * Playwright is not a dependency of this repo on purpose: it is large and
 * would be installed on every Cloudflare build for a file that changes
 * about twice a year. Install it only when you need to regenerate:
 *
 *     npm i -D playwright && npx playwright install chromium
 *     node scripts/make-og.mjs
 */

import { readFile, writeFile, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const CARD = {
  title: "Written tutorials<br><span>you can run.</span>",
  meta: "ROS 2 · MuJoCo · Python",
  host: "learn.konjamcoding.me",
  out: "public/og.png",
};

let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)("playwright"));
} catch {
  console.error("Playwright is not installed. See the comment at the top of this file.");
  process.exit(1);
}

const logo = await readFile(resolve(root, "public/logo.png"));
const html = (await readFile(resolve(root, "brand/og-template.html"), "utf8"))
  .replaceAll("__LOGO__", "data:image/png;base64," + logo.toString("base64"))
  .replaceAll("__TITLE__", CARD.title)
  .replaceAll("__META__", CARD.meta)
  .replaceAll("__HOST__", CARD.host);

const tmp = resolve(root, "brand/.og-render.html");
await writeFile(tmp, html, "utf8");

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto("file://" + tmp, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: resolve(root, CARD.out) });
await browser.close();
await unlink(tmp);

console.log(`[og] ${CARD.out} written (1200x630).`);
