/**
 * Writes dist/_headers AFTER the build.
 *
 * This runs post-build on purpose. Astro inlines some of its bundled
 * component scripts straight into the HTML, and which ones it inlines
 * depends on their size, so the set is not knowable from the source.
 * Starlight ships several inline scripts of its own (theme provider,
 * sidebar state, search), and the set changes between versions. Hashing
 * them from the actual output is what lets this site drop
 * 'unsafe-inline' without an upgrade silently breaking the page.
 *
 * So: build first, then hash every inline script that actually shipped.
 * The CSP can never disagree with the output, because it is derived
 * from it. That is also why there is no 'unsafe-inline' here.
 */

import { createHash } from "node:crypto";
import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

/** Every .html file under dist. */
async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;

const hashes = new Set();
const files = await htmlFiles(dist);

for (const file of files) {
  const html = await readFile(file, "utf8");
  for (const [, , body] of html.matchAll(INLINE_SCRIPT)) {
    if (!body.trim()) continue;
    // The hash covers the element's exact text content, byte for byte.
    hashes.add("'sha256-" + createHash("sha256").update(body, "utf8").digest("base64") + "'");
  }
}

let origin = "";
const src = process.env.PUBLIC_UMAMI_SRC ?? "";
if (src) {
  try {
    origin = " " + new URL(src).origin;
  } catch {
    console.warn(`[headers] PUBLIC_UMAMI_SRC is not a valid URL: ${src}. Leaving it out of the CSP.`);
  }
}

const template = await readFile(resolve(root, "config/headers.template"), "utf8");

await writeFile(
  join(dist, "_headers"),
  template
    .replaceAll("__SCRIPT_HASHES__", [...hashes].sort().join(" "))
    .replaceAll("__ANALYTICS_ORIGIN__", origin),
  "utf8",
);

console.log(
  `[headers] dist/_headers written. ${hashes.size} inline script hash(es) across ${files.length} page(s).` +
    (origin ? ` Analytics origin${origin}.` : " No analytics origin configured."),
);
