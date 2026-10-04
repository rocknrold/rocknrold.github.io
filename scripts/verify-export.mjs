// Sanity checks on ./out before it is published to GitHub Pages.
// Fails the CI run (exit 1) instead of deploying a broken site.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname;
const errors = [];
const check = (ok, msg) => ok || errors.push(msg);

const required = [
  "index.html",
  "404.html",
  ".nojekyll", // without it Jekyll drops the _next/ folder
  "robots.txt",
  "sitemap.xml",
  ".well-known/security.txt",
  "Aaron.jpg",
  "_next",
];
for (const f of required) check(existsSync(join(OUT, f)), `missing ${f}`);

for (const name of ["profile", "experience", "projects", "skills", "credentials", "details"]) {
  const file = join(OUT, "api/v1", `${name}.json`);
  if (!existsSync(file)) {
    errors.push(`missing api/v1/${name}.json`);
    continue;
  }
  try {
    const body = JSON.parse(readFileSync(file, "utf8"));
    check(body.status === "success" && body.code === 200 && body.data, `api/v1/${name}.json has an unexpected shape`);
  } catch {
    errors.push(`api/v1/${name}.json is not valid JSON`);
  }
}

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

for (const file of walk(OUT).filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  const rel = file.slice(OUT.length);
  check(html.includes('http-equiv="Content-Security-Policy"'), `${rel}: no CSP meta tag`);
  check(!/unsafe-inline|unsafe-eval/.test(html.match(/Content-Security-Policy" content="([^"]*)"/)?.[1] ?? ""), `${rel}: CSP allows unsafe-*`);
  check(!/localhost|127\.0\.0\.1/.test(html), `${rel}: references localhost`);
}

// Data-leak guard: everything under out/ is public. Fail if a phone number
// (e.g. from the résumé) ever lands in a page or an API response.
const PHONE = /(?:\+?63|0)[\s-]?9\d{2}[\s-]?\d{3}[\s-]?\d{4}/;
for (const file of walk(OUT).filter((f) => /\.(html|json|txt)$/.test(f))) {
  check(!PHONE.test(readFileSync(file, "utf8")), `${file.slice(OUT.length)}: contains a phone number`);
}

if (errors.length) {
  console.error(`Export verification failed:\n  - ${errors.join("\n  - ")}`);
  process.exit(1);
}
console.log("Export verified: ready for GitHub Pages");
