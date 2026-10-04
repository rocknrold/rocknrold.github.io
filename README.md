# rocknrold.github.io

Portfolio of **Harold Aaron**, Senior Back-End Developer & Project Team Lead.
Built with Next.js (App Router) as a fully static export and hosted on GitHub Pages.

## Branches

| Branch   | Contains                                   |
| -------- | ------------------------------------------ |
| `main`   | Source code (this README). Work here.      |
| `master` | Built static site. GitHub Pages serves it. |

Pushing to `main` runs `.github/workflows/deploy.yml`, which lints, builds,
and publishes `out/` to `master`. Don't commit to `master` by hand.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build    # static site in ./out (+ hashed CSP on every page)
npm run verify   # the same pre-publish checks CI runs
npm start        # preview ./out, the exact build that gets deployed
```

## Edit content

All content lives in **`src/data/resume.ts`**. It is the single source for both
the page and the JSON API, so update it once and both stay in sync.

Nothing time-based is hard-coded. Years of experience ("4+ yrs"), role
durations ("3 yrs 10 mos"), and the copyright year are computed from the role
start dates (`careerStart` = the earliest role) and today's date:

- **Page**: recomputed in the visitor's browser on every visit (`src/components/Live.tsx`).
- **JSON API**: computed at build time, with `meta.generated_at`. The workflow
  rebuilds on the 1st of every month so the values never drift. This needs
  `main` as the repo's default branch, because GitHub only runs schedules there.

When you change jobs, just add the role to `experience`; everything else follows.

## JSON API (the "Postman" playground)

Static route handlers in `src/app/api/v1/*/route.ts` are prerendered to real
JSON files at build time:

```
GET /api/v1/profile.json
GET /api/v1/experience.json
GET /api/v1/projects.json
GET /api/v1/skills.json
GET /api/v1/credentials.json
GET /api/v1/details.json   # everything (legacy, also at /#/api/v1/details)
```

The playground on the home page fetches these for real and shows status, timing,
size, and response headers.

### API security

There is no server to put auth on: the API is public, read-only data, and
GitHub Pages serves it over HTTPS (HSTS) with `application/json`, rejects
`POST`/`PUT`/`DELETE` with `405`, and sends `Access-Control-Allow-Origin: *`
(not configurable). Protection is therefore about exposure and the client:

- **Data minimisation**: only what is already on the page is published.
  `npm run verify` fails the deploy if a phone number appears anywhere in `out/`.
- **Not indexed**: `robots.txt` disallows `/api/`.
- **Sandboxed playground** (`src/components/ApiPlayground.tsx`): same origin and
  `/api/v1/*` only, max URL length, no embedded credentials,
  `credentials: "omit"`, `redirect: "error"`, `no-referrer`, a 10 s timeout and a
  512 KB response cap. Non-GET methods get the same `405` locally and never hit
  the network. The page CSP adds `connect-src 'self'` on top of that.
- **Safe snippets**: "Copy as cURL" and the fetch snippet are built from the
  validated URL and shell-quoted, so pasting them can't run injected commands.

## Security

GitHub Pages can't send custom HTTP headers, so protection is built into the
pages themselves:

- **Content-Security-Policy**: `scripts/csp.mjs` runs after `next build`, hashes
  every inline script, and injects a strict `<meta>` CSP into each HTML page
  (no `unsafe-inline` or `unsafe-eval`, `connect-src 'self'`, `object-src 'none'`,
  `form-action 'none'`, `upgrade-insecure-requests`). If you add a third-party
  image host, add it to `IMG_HOSTS` in that script.
- **Clickjacking**: meta CSP can't set `frame-ancestors`, so the page hides
  itself when framed by another site (`src/app/layout.tsx`).
- **Referrer policy** `strict-origin-when-cross-origin`; external links use
  `rel="noopener noreferrer"`; JSON-LD is escaped against `</script>` injection.
- **`/.well-known/security.txt`** for vulnerability reports. Renew `Expires` yearly.
- **CI**: per-job least-privilege tokens, actions pinned to commit SHAs,
  `npm ci --ignore-scripts`, `npm audit` on shipped deps, and
  `scripts/verify-export.mjs` blocks the deploy if the export is incomplete or a
  page is missing its CSP. Dependabot (`.github/dependabot.yml`) keeps npm
  packages and pinned actions up to date.

## One-time GitHub setup

1. **Settings → Pages**: Source *Deploy from a branch*, branch `master`, folder `/ (root)`.
2. **Settings → Actions → General → Workflow permissions**: *Read and write*
   (only the deploy job requests write access, to push to `master`).
3. **Settings → Pages → Enforce HTTPS**: on.
4. Optional: **Settings → General → Default branch** → `main`, so the repo page
   shows the source and Dependabot/PRs target it.
