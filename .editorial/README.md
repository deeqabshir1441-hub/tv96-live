# Maintaining the TV96 Live editorial library

The site remains plain HTML/CSS/JavaScript. Published `/articles/{id}` URLs resolve to generated `articles/{id}.html` through Vercel clean URLs. There is no article catch-all rewrite or client-side body renderer.

1. Edit `.editorial/news-data.js` for metadata, publication status, sources and related IDs. It is the central record, including unpublished IDs. Use real publication/revision dates.
2. Edit `.editorial/article-content.js` for trusted HTML bodies. Use paragraphs and H2/H3 headings; the template supplies the sole H1. Draft bodies 5 and 6 and season briefs 26-31 remain local.
3. Edit `.editorial/article-template.html` for shared article presentation. `{{FIELD}}` slots are replaced by the generator; body HTML is trusted, metadata is escaped, JSON-LD is serialized safely.
4. Run `node .editorial/sync-content.cjs` (or `node .editorial/generate-static.cjs`). This generates all published pages, published-only `news-data.js`, raw News cards, derived word counts/reading times, sitemap and allowlisted legacy redirects. Unpublishing removes stale generator-owned pages and links. Do not hand-edit generated bodies or static News blocks.
   For a new original editorial PNG, first add its exact ID/path to `editorialImageRegistry` in `.editorial/news-data.js`, record `imageType`, `rightsStatus`, and `brandingReview`, then run `node .editorial/optimize-article-images.cjs` before generation. The local Chrome/Edge workflow preserves source PNGs, writes bounded 1200 × 800 maximum quality-0.92 WebP assets, and records source/delivery hashes in `.editorial/optimized-images.json`. Generation refuses missing or stale optimized assets. Public pages, News, Home and OG metadata use WebP; internal review fields never deploy. Mark competition branding `required` until manual review, and use `clear` only for graphics without third-party marks.
5. Run `node .editorial/validate-content.cjs`, `node .editorial/raw-html-check.cjs`, `node .editorial/browser-check.cjs`, and `node .editorial/api-smoke.cjs`. `node .editorial/generate-static.cjs --check` detects stale outputs without writing. Validation pins the pre-expansion commit `9ee47c6` and pre-fix commit `16e286e`; it preserves all original bodies and protected football files. Intentional future editorial body revisions need a deliberate baseline update.
6. Review the generated outputs before the normal release process. Generation runs locally before deployment: deploy the generated pages and public metadata, not an attempt to run the excluded generator on Vercel. No new package, framework, build override or API runtime has been added.

`.vercelignore` excludes the entire `.editorial/` directory, including sources, drafts, tests and reports. The public root no longer contains `article-content.js` or `article-template.html`. Published legacy query URLs redirect to clean article URLs; absent/unpublished IDs have no file and receive HTTP 404. Do not restore the old catch-all rewrite.

News initially contains all 16 published cards and three featured links. JavaScript adds category filtering and pagination; the shared card renderer avoids divergent card markup. Article content and metadata do not require JavaScript.

The raw HTTP test server models this project's clean URLs, redirects and deployment exclusions. It is not Vercel itself. Browser tests use isolated Chromium, mocked external services and football data, and include JavaScript-disabled article/News checks. API tests use deterministic mocks without production credentials. These checks do not verify deployed routing, real advertising/analytics delivery or live upstream availability. Recheck HTTP responses on an authorized preview before a production release.

## Deferred editorial review

Existing local photographs for IDs 8-11 have uncertain rights; local storage does not prove ownership. Older removed image candidates for IDs 1-4 and 7 remain internal and are not reintroduced. No third-party image was downloaded or copied. Source precision for IDs 8-9 and older reporting accuracy need editorial review. Existing ads on the noindex offline utility page remain outside this change. Streaming stays disabled.

See `PRODUCTION-FIXES-REPORT.md` for evidence and remaining review risks. Earlier AUDIT/REPORT files describe historical states and are retained as local records.

## Image and source cleanup

See IMAGE-SOURCE-CLEANUP-REPORT.md for the current state; earlier reports are historical. Run `node .editorial/image-rights-check.cjs` with the other checks. Original fallback artwork is reproducible with `python .editorial/create-editorial-fallback.py`. Retired candidate paths stay internal. The approved-source-revisions.json manifest records the deliberate news corrections while preserving exact checks for every untouched body.
