// Adds a Content-Security-Policy <meta> tag to every exported HTML page.
//
// GitHub Pages can't send custom HTTP headers, so the policy has to live in the
// document. Next.js emits inline bootstrap scripts whose contents change on every
// build, so instead of allowing 'unsafe-inline' we hash each one at build time.
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname;

const IMG_HOSTS = ["https://user-images.githubusercontent.com"];

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

const sha256 = (text) => `'sha256-${createHash("sha256").update(text, "utf8").digest("base64")}'`;

function policy(scriptHashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${scriptHashes.join(" ")}`.trim(),
    "style-src 'self'",
    `img-src 'self' data: ${IMG_HOSTS.join(" ")}`,
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "worker-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

let pages = 0;
for await (const file of htmlFiles(OUT)) {
  let html = await readFile(file, "utf8");
  if (html.includes('http-equiv="Content-Security-Policy"')) continue;

  // Executable inline scripts only: no src, and no data types such as application/ld+json.
  const hashes = new Set();
  for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(attrs)) continue;
    const type = attrs.match(/\btype="([^"]*)"/)?.[1];
    if (type && !/^(text|application)\/javascript$|^module$/.test(type)) continue;
    hashes.add(sha256(body));
  }

  const meta = `<meta http-equiv="Content-Security-Policy" content="${policy([...hashes])}"/>`;
  if (!/<head>/.test(html)) throw new Error(`No <head> in ${file}`);
  // Must come before any script so the policy governs all of them.
  html = html.replace("<head>", `<head>${meta}`);
  await writeFile(file, html);
  pages++;
}

console.log(`CSP: added policy to ${pages} HTML page(s)`);
