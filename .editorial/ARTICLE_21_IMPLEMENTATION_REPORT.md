# Article 21 implementation — 13 October 2026

Owner approval: exact Article 21 proposal, conditional on reopening the official RFEF PDF before editing. Branch: `adsense-readiness-2026-10-11`. No commit, push, deployment or AdSense review submission.

## Source gate: passed before editing

Reopened https://rfef.es/sites/default/files/pdf/circulares/1._Circular_84_-_CNL_Primera_y_Segunda_Division___Anexo.pdf?cb=6df81e55 on 13 October 2026.

The circular cover heading refers to 2025/2026. Its operative publication paragraph identifies regulations for 2026/2027, approved 18 June 2026 and notified 30 June 2026. The attached title identifies 2026–2027. Article 1 (printed page 3) and Article 4(2) (printed page 4) expressly establish 2026/2027 applicability. The cover heading was not used as the applicable competition season.

Article 10, printed page 6, two-team paragraph (a)–(e): head-to-head goal difference, overall goal difference, overall goals scored, fair-play ranking, neutral-ground match. Printed page 7, multi-team paragraph (a)–(f): points among tied clubs, goal difference among them, overall goal difference, overall goals scored, fair-play ranking, neutral-ground match. The multi-team first criterion also says not to continue if its mini-table already separates every club. These provisions expressly concern final classification; they do not establish a universal interim provider sorting rule.

## Implemented and preserved

- Added the exact approved explanatory paragraphs, hypothetical results/calculation and unfinished-season caution after both existing tied-points paragraphs and before `European places and relegation`.
- Used two H3 headings as expressly required by the latest approval. The caution remains the exact approved paragraph without an additional third heading.
- Table has column/row headers and an accessible hypothetical label. Article-local fixed-width wrapping keeps cells inside the viewport without changing shared styles.
- Club A and Club B are explicitly invented: 60 points each; A wins 2–0, B wins 1–0; A's head-to-head GD is +1 and B's is −1. The first criterion resolves their tie despite B's better overall GD.
- Added the RFEF PDF inline and to the central source list; retained the existing LALIGA citation unchanged.
- Original headline, description, category, author, URL, image, related IDs, all original body text and `2026-09-05T12:00:00+03:00` publication timestamp preserved. `updatedAt` and the approved revision note use the actual Nairobi implementation date, 2026-10-13.
- Added a follow-up body-hash approval linked to the original P0 after-hash. Historical approvals and evidence were retained. Existing preservation guards explicitly validate the next approved hash rather than discarding earlier baselines.
- Generated outputs updated through `node .editorial/generate-static.cjs`. Article 21 is 1,083 words / five-minute reading time in the current content model.
- Articles 10 and 22 only changed their generated related Article 21 reading-time label, from four to five minutes. Exact reverse-substitution hash checks prove no other changes to those pages.
- Article 32 source, metadata, generated page and image bytes; Articles 3 and 9; Standings; APIs; ranking logic; all image files; ad/consent loaders; streaming configuration remained unchanged from the start of this task.

## Tests

| Command (`node .editorial/…`) | Final result |
|---|---|
| `generate-static.cjs --check` | PASS — 16 generated articles, public metadata, News, sitemap, redirects |
| `validate-content.cjs` | PASS — content, metadata, links, protected files, syntax, site chrome and generator parity |
| `p0-check.cjs` | PASS — original/follow-up approval chains, publication dates, protected systems |
| `image-rights-check.cjs` | PASS — 15 registered WebP images and existing fallback/suppression safeguards |
| `article-21-revision-check.cjs` | PASS — exact insertion, original paragraphs, hypothetical arithmetic, sources, metadata and protected hashes |
| `article-24-revision-check.cjs` | PASS — prior approved correction and protections |
| `article-3-revision-check.cjs` | PASS — prior example/correction and protections |
| `article-9-revision-check.cjs` | PASS — prior historical example and protections |
| `article-32-archive-check.cjs` | PASS — existing approved archive presentation preserved |
| `standings-source-check.cjs` | PASS — exact approved Standings implementation and API protections |
| `match-coverage-check.cjs` | PASS — 12 competitions, time boundaries, caching, deduplication and failure cases |
| `api-smoke.cjs` | PASS — mocked provider/fallback metadata and existing API contracts |
| `raw-html-check.cjs` | PASS — 16 routes, metadata/schema, assets, 24 sitemap URLs, exclusions and redirects |
| `legacy-exclusion-check.cjs` | PASS — 19 excluded assets return local 404; 22 active resources return 200; originals preserved |
| `browser-check.cjs` | PASS — full existing suite and Article 21 no-JavaScript, exact text/source/arithmetic, semantic table headers, dates and layouts at 320/360/390/1440px in dark/light themes |

Initial `validate-content`, `p0-check` and `article-32-archive-check` runs failed the existing future-update check because UTC was still 12 October while Nairobi was already 13 October. Fixed only the date-only revision comparison to use Africa/Nairobi calendar dates. Publication timestamps still use absolute instants, and future revision dates remain rejected. All three affected checks passed on rerun. No final failed checks.

Browser evidence: `C:\Users\user\AppData\Local\Temp\tv96-editorial-jZcfNF\article-21-example-no-js-{dark|light}-{320|1440}.png`. The 320px light screenshot was visually inspected. The full browser suite also verified existing loading/error/empty/unsupported states, background-refresh provenance, mobile navigation and disabled Watch Live behavior. Browser/API tests use mocked remote services; no production deployment or live account verification is implied.

## Every file modified or added by this task

Source and authorization:

- `.editorial/article-content.js`
- `.editorial/news-data.js`
- `.editorial/p0-review.json`

New implementation/evidence/guard/report files:

- `.editorial/apply-article-21.cjs`
- `.editorial/article-21-revision-evidence.json`
- `.editorial/article-21-preservation.cjs`
- `.editorial/article-21-revision-check.cjs`
- `.editorial/ARTICLE_21_IMPLEMENTATION_REPORT.md`

Necessary existing regression guards:

- `.editorial/p0-check.cjs`
- `.editorial/browser-check.cjs`
- `.editorial/article-24-revision-check.cjs`
- `.editorial/article-3-revision-check.cjs`
- `.editorial/article-9-revision-check.cjs`
- `.editorial/standings-source-check.cjs`
- `.editorial/legacy-exclusion-check.cjs`

Generated public files:

- `articles/21.html`
- `articles/10.html` — related-card reading time only
- `articles/22.html` — related-card reading time only
- `news-data.js`
- `news.html`
- `sitemap.xml`

Refreshed existing test results:

- `.editorial/browser-results.json`
- `.editorial/raw-html-results.json`
- `.editorial/legacy-exclusion-results.json`

The working tree already contained other approved changes before this task; this list identifies this task's changes rather than attributing the entire existing Git diff to Article 21.

## Remaining risks

No unintended content changes or unresolved Article 21 implementation failures were found. The hypothetical example does not represent an actual fixture or standings record, and the current-season summary is not a full treatment of every complex multi-team edge case. RFEF's cover-season discrepancy remains documented alongside its explicit operative applicability. No universal in-season sorting procedure has been claimed.

The previous site-wide AdSense blockers remain: unresolved Article 32 image rights and other image/branding evidence, owner-side certified CMP configuration/region testing, account checks and remaining content-quality work. Passing these local tests does not establish rights clearance, consent compliance, deployment behavior or AdSense approval. AdSense re-review should remain held pending the existing owner checklist.
