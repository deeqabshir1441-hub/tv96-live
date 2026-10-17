# Article 3 worked example — implementation report

Implemented on **12 October 2026**, branch `adsense-readiness-2026-10-11`, after explicit owner approval. No commit, push, deployment, account change or AdSense review submission.

## Completed change

Inserted **A worked example: Netherlands–Argentina, 2022** and the three approved paragraphs immediately before **Compare opportunities as well as totals**, after the existing two **Look beyond the final pass** paragraphs. The approved wording is preserved exactly; Markdown citations are represented as inline HTML links with the same labels and targets. Added a separate dated revision note at the end.

The example separates FIFA's single-match recorded credit, Opta's descriptive analysis and Stats Perform's assist-category definitions. It introduces no all-time record, tournament-total or career-total assertion. The original correction notice remains intact; all original paragraphs retain their exact text and order.

Added sources, ahead of the existing internal further reading:

1. [FIFA full-time match report](https://fdp.fifa.org/assetspublic/ce44/r2859/pdf/FullTimeMatchReport-English.pdf), version 2: page 2 event; page 5 player assist column/legend.
2. [Opta Analyst contemporary analysis](https://theanalyst.com/articles/lionel-messi-world-cup-stats-argentina-2022-final): descriptive analysis of the pass.
3. [Stats Perform Opta event definitions](https://www.statsperform.com/opta-event-definitions/): conventional versus fantasy assist categories, separate from FIFA's recorded credit.

Preserved headline, `/articles/3`, author, original publication timestamp `2026-07-14T12:02:02+03:00`, description, category, related IDs and image state (no active hero image). `updatedAt` is `2026-10-12`; generated modified-date/schema/sitemap metadata agrees. The generator derives **684 body words** and **four minutes** reading time. Counts describe content, not AdSense eligibility thresholds.

The earlier body approvals remain unchanged. `.editorial/p0-review.json`, `followupRevision.bodies.3`, adds an independently dated authorized before/after body-hash chain. The evidence record captures the exact insertion, revision note, old body/metadata and public-file fingerprints.

## Every file modified or created by this task

Central sources and authorization:
- `.editorial/article-content.js`
- `.editorial/news-data.js`
- `.editorial/p0-review.json`

Generated outputs:
- `articles/3.html` — worked example, citations, revision note, sources, modified-date metadata and derived word count/reading time.
- `articles/13.html` — only related Article 3 card reading time, three to four minutes; its body/metadata are unchanged.
- `articles/16.html` — only related Article 3 card reading time, three to four minutes; its body/metadata are unchanged.
- `news-data.js` — Article 3 sources, revision date and derived word count.
- `news.html` — Article 3 card reading time.
- `sitemap.xml` — Article 3 last-modified date.

Necessary guards/evidence/documentation:
- `.editorial/apply-article-3.cjs` — one-time implementation script; refuses to run again after insertion.
- `.editorial/article-3-revision-evidence.json` — exact authorized insertion and preservation evidence.
- `.editorial/article-3-revision-check.cjs` — verifies exact addition, earlier body/correction, source consistency, preserved metadata, unrelated bodies/public files and precise related-card-only changes.
- `.editorial/article-24-revision-check.cjs` — preserves its original Article 3 baseline and recognizes the separately authorized later revision; remaining guards unchanged.
- `.editorial/standings-source-check.cjs` — checks the recorded prior fingerprints and chains only approved Article 3 source/generated changes; Standings and all other protections remain.
- `.editorial/legacy-exclusion-check.cjs` — chains approved generated hashes after prior Article 24/Standings revisions; retains exact 19-asset exclusions and original fingerprints.
- `.editorial/ARTICLE_3_IMPLEMENTATION_REPORT.md` — this report.

Refreshed regression evidence:
- `.editorial/browser-results.json`
- `.editorial/raw-html-results.json`
- `.editorial/legacy-exclusion-results.json`

Other pre-existing working-tree changes belong to earlier tasks. `index.html`, `standings.html`, Article 24, Article 32, both APIs and all image assets were not changed by this implementation. The generated changes to Articles 13/16 are required reading-time synchronization, not unrelated editorial rewrites.

## Regression results

| Check | Result |
| --- | --- |
| `generate-static.cjs` | PASS: all 16 articles and published outputs regenerated |
| `validate-content.cjs` | PASS: source/body approval checks, metadata, links, inline syntax, protected files and shared chrome; includes `generate-static.cjs --check` |
| `image-rights-check.cjs` | PASS: registry/delivery consistency; not licensing verification |
| `api-smoke.cjs` | PASS: existing API guards, match fields, standings/fallback source contract |
| `raw-html-check.cjs` | PASS: 16 articles, crawlable content, unique metadata/schema, links/assets, 24 sitemap URLs and redirects/excluded routes |
| `match-coverage-check.cjs` | PASS: 12 competitions, dates/order/deduplication, caching/error recovery and token isolation |
| `article-32-archive-check.cjs` | PASS: approved archive presentation preserved |
| `article-24-revision-check.cjs` | PASS: approved correction and original preservation chain retained |
| `standings-source-check.cjs` | PASS: Standings implementation and protected systems retained |
| `legacy-exclusion-check.cjs` | PASS: 19 local exclusions return 404; 22 active resources return 200; local originals retained |
| `article-3-revision-check.cjs` | PASS: exact insertion/correction/date/image preservation, same inline/metadata sources, unrelated bodies/APIs/images unchanged and related cards only change reading time |
| `browser-check.cjs` | PASS: all 16 routes, metadata/schema/related links, no-JavaScript articles/News, mobile/desktop layouts, themes/navigation, mocked Matches/Standings and provenance transitions, disabled Watch and shared chrome |
| `git diff --check` | PASS |

## Remaining issues and limits

Browser evidence: `.editorial/browser-results.json`; screenshots directory `C:\Users\user\AppData\Local\Temp\tv96-editorial-1SyPeS`. Browser/API data and external scripts are mocked locally. No new Article 3-specific screenshot was added; its route, full body, metadata and layout were covered by the existing browser checks.

No unresolved implementation issue has been identified for this bounded example. It demonstrates one fixture, not a verified multi-match or historical ranking dataset. The separate provider definitions are not asserted to be FIFA's methodology or a retrospective reclassification of its 2022 record. No media was downloaded, embedded or reused.

The change remains local until a separately authorized deployment. Existing Article 32 photograph-permission, branding-rights, certified regional CMP and AdSense account/Auto Ads verification blockers remain unresolved. The earlier content-quality audit remains historical evidence rather than an automatically updated report. Local tests mock football/advertising services and do not establish current production deployment, upstream availability, consent behavior, legal clearance or AdSense approval.
