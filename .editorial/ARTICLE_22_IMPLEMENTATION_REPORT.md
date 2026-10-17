# Article 22 implementation — 13 October 2026

Branch: `adsense-readiness-2026-10-11`. Implemented the owner's exact approved proposal, including the explicit Article 21 related-card exception. No commit, push, deployment or AdSense review submission.

## Implementation

Inserted the H3 `Which ties require a play-off in 2026/27?`, all six approved paragraphs and the exact hypothetical calculation table after the existing three equal-points paragraphs, before `Europe and the second division`. Two inline citations point to the exact owner-supplied official FIGC 244/A URL.

The FIGC regulation verified during proposal preparation explicitly applies to 2026/2027, was published 27 May 2026 and provides clauses i–iii on PDF page 1 continuing onto page 2, with clause iv on page 2. The insertion distinguishes the championship procedure, survival procedure, hosting mini-table and UEFA-finalist exception. It states no extra time and does not treat the ordinary procedures as unconditional.

The hypothetical clubs, totals and results are explicitly invented. Both finish on 37 league points; A earns 3 + 1 = 4 head-to-head points, B earns 0 + 1 = 1. A hosts the second leg, but that does not automatically award survival. The table includes an accessible hypothetical label, column/row headers and local wrapping suitable for narrow viewports.

Retained every original paragraph and all original metadata except authorized source-list changes, revision date and derived word count. Retained publication timestamp `2026-09-05T12:00:00+03:00`, headline, description, category, author, URL, image and related IDs. `updatedAt` and the exact approved revision note use the actual Nairobi implementation date, 2026-10-13.

Added the official FIGC source; retained and relabeled the 2025/26 Lega survival citation exactly as approved; retained the championship-history citation unchanged. Historical context is not presented as authority for 2026/27.

Extended the existing body-hash authorization chain without deleting or replacing historical approvals. Necessary existing preservation guards now validate the Article 22 successor against the prior approved baseline; their earlier evidence remains intact. The source and public-file snapshot also protects all untouched bodies, metadata, images, APIs and other public files.

Regenerated through `node .editorial/generate-static.cjs`. Final model word count: 1,168; reading time: six minutes. `articles/21.html` changed only the generated Article 22 card label from four to six minutes. Exact full-text comparison against its pre-task snapshot proves the narrow exception; Article 21 body, metadata, sources and revision are unchanged. The homepage Article 22 card also changed only its generated reading time; reversing that single replacement reproduces its pre-task SHA-256 hash.

Articles 3, 9, 24 and 32, Standings, API/ranking implementations, images, streaming settings, ad/consent loaders and unrelated functionality are unchanged from the start of this task. Existing unrelated working-tree changes belong to earlier tasks.

## Checks

| Command | Result |
|---|---|
| `node .editorial/generate-static.cjs --check` | PASS: 16 generated articles and discovery outputs |
| `node .editorial/validate-content.cjs` | PASS: content, metadata, internal links, protected files, syntax and generator parity |
| `node .editorial/p0-check.cjs` | PASS: historical/current authorization chains, publication dates and protected systems |
| `node .editorial/image-rights-check.cjs` | PASS: existing registered image/fallback/suppression safeguards |
| `node .editorial/article-22-revision-check.cjs` | PASS: exact insertion, original text, sources/season/exception, arithmetic, hosting, metadata, narrow Article 21 exception and protected hashes |
| `node .editorial/article-21-revision-check.cjs` | PASS: previous approved Article 21 addition and protections |
| `node .editorial/article-24-revision-check.cjs` | PASS: previous approved correction and protections |
| `node .editorial/article-3-revision-check.cjs` | PASS: previous example/correction and protections |
| `node .editorial/article-9-revision-check.cjs` | PASS: previous historical example and protections |
| `node .editorial/article-32-archive-check.cjs` | PASS: previous archive presentation preserved |
| `node .editorial/standings-source-check.cjs` | PASS: Standings page/API protections |
| `node .editorial/match-coverage-check.cjs` | PASS: 12 competitions, caches, failure paths, deduplication and date boundaries |
| `node .editorial/api-smoke.cjs` | PASS: existing mocked upstream contracts |
| `node .editorial/raw-html-check.cjs` | PASS: 16 routes, metadata/schema, assets, 24 sitemap URLs, exclusions and redirects |
| `node .editorial/legacy-exclusion-check.cjs` | PASS: 19 excluded local URLs return 404, 22 active resources return 200, originals preserved |
| `node .editorial/browser-check.cjs` | PASS: full existing suite plus exact Article 22 no-JavaScript text, citations, table headers/calculations, metadata and both-theme layouts at 320/360/390/1440px |
| `git diff --check` | PASS: exit 0; only existing Windows line-ending conversion warnings |

Browser screenshots: `C:\Users\user\AppData\Local\Temp\tv96-editorial-621ZqV\article-22-example-no-js-{dark|light}-{320|1440}.png`. Visually inspected the 320px light screenshot: table values and hosting order fit within the viewport. Browser/API tests use mocked external services and the local static server; they do not verify production or account state.

An initial generated-output allowlist assertion caught the additional homepage reading-time label. Inspection and reverse-substitution hash verification confirmed it was solely the Article 22 card synchronization. The Article 21 exception itself passed unchanged. This expected generator effect was documented and included in the narrow preservation check. All final checks passed; no unintended content changes found.

## Every modified or added file in this task

- `.editorial/article-content.js`
- `.editorial/news-data.js`
- `.editorial/p0-review.json`
- `.editorial/apply-article-22.cjs` — new
- `.editorial/article-22-revision-evidence.json` — new
- `.editorial/article-22-preservation.cjs` — new
- `.editorial/article-22-revision-check.cjs` — new
- `.editorial/ARTICLE_22_IMPLEMENTATION_REPORT.md` — new
- `.editorial/article-21-preservation.cjs`
- `.editorial/article-21-revision-check.cjs`
- `.editorial/article-3-revision-check.cjs`
- `.editorial/article-9-revision-check.cjs`
- `.editorial/browser-check.cjs`
- `articles/22.html`
- `articles/21.html` — approved related-card label only
- `index.html` — Article 22 reading-time label only
- `news-data.js`
- `news.html`
- `sitemap.xml`
- `.editorial/browser-results.json`
- `.editorial/raw-html-results.json`
- `.editorial/legacy-exclusion-results.json`

## Remaining risks

The example is hypothetical and does not establish a real sporting outcome. Historical Lega context remains available with its explicit limitation; FIGC is the authoritative source for the inserted current-season procedures. No remaining Article 22 implementation failure was found.

Existing site-wide image-rights, CMP owner/region verification, AdSense account checks and other content-quality findings remain outstanding. No image rights, remote consent compliance or AdSense approval is claimed. AdSense re-review remains held pending the existing action plan and owner checks.
