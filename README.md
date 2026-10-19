# Tech Compass

A static, searchable technology field guide. Python builds real HTML pages from structured JSON; a small JavaScript search layer ranks published guides in the browser. No framework, paid APIs, analytics, external fonts, or runtime dependencies.

## Run locally

```sh
python3 scripts/build.py
python3 scripts/check.py
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://localhost:4173. Serve over HTTP; opening HTML files directly will not support root-relative navigation or the search index request.

Optional search regression checks, with Node installed:

```sh
node scripts/check-search.mjs
python3 scripts/check-release.py
python3 scripts/check-contrast.py
```

## Project structure

- `content/articles.json`: article text, slugs, categories, type, keywords, source keys, dates, author, related articles, and publication status.
- `scripts/build.py`: reusable page templates, topic taxonomy, reference registry, static page generator, metadata, sitemap and hosting header output.
- `assets/style.css`: color tokens, typography, layouts, responsive breakpoints, focus and reduced-motion styles.
- `assets/app.js`: mobile navigation, query normalization, edit-distance matching, relevance ranking, category filters, and safe DOM rendering.
- `dist/`: generated output. Build replaces this directory; edit source files instead.
- `docs/QA.md`: evidence, limitations, and the requested checklist.

## Editing content

Add an article object following the existing schema. Use `status: "draft"` to exclude it from generation and search. Set `status: "published"` only after reviewing it. Give it a unique lowercase hyphenated slug, real publication/update dates, and related slugs of published articles. Reference sources through the registry in `scripts/build.py`. Build and run checks after edits. Public pages do not claim independent expert review.

The initial library contains 16 articles. Smart Home includes a Google Nest Wi-Fi guide. Operator details and the verified Sites origin are stored in `content/site-info.json`; policy text is in `content/policies.json`.

## Hosting

Upload `dist/` to a static host that supports directory index pages and a custom `404.html`. Configure HTTPS. `_headers` is supplied for compatible static hosts; on other platforms translate its rules into the host configuration. Python's development server does not apply `_headers`.

For production, build with the real, verified origin:

```sh
SITE_URL=https://your-real-domain.example python3 scripts/build.py
```

This emits canonical URLs and an absolute XML sitemap. The example origin is documentation only; it is not configured in the application. Search-result pages should not be indexed with arbitrary query strings; configure production crawl/index behavior when the origin is known.

The Sites address is https://tech-compass-field-guide.ants-pinup-3l.chatgpt.site. Source identity is stored in `.openai/hosting.json`. New Sites are owner-private. Build output uses this verified origin by default; `SITE_URL` overrides it for isolated tests or a future domain change. No credentials are stored in the project.

## Launch prerequisites

Operator: Saxon Crawford, Kentucky, United States; contact: saxon.crawford@icloud.com. Confirm provider retention and processing details. Finalize privacy and terms frameworks with appropriate review. Verify HTTPS, headers, redirects, and 404 response codes on the chosen host. Perform a full accessibility and device audit and have a technical editor review the starter library. Add content according to actual user needs before expanding infrastructure.

After deployment, run `python3 scripts/check-live.py https://your-real-host` to check HTTPS, headers, canonical metadata, 404 behavior, noindex and sitemap configuration. The live checker cannot inspect owner-private Sites without authentication; use the authenticated browser for those checks.
