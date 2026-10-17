# Article 9 historical example — implementation report

Implemented **12 October 2026** on `adsense-readiness-2026-10-11`, following explicit owner approval. No commit, push, deployment, external account change or AdSense review submission.

## Implemented and preserved

Inserted **Historical worked example: Manchester United’s 2024/25 Europa League draw** and the four approved paragraphs directly after the existing two **Bring the domestic calendar into view** paragraphs, immediately before **Use the right competition rules**. Text matches the approved proposal exactly, with its Markdown citations converted to HTML links retaining the approved labels and targets.

Added the five sources from the approved proposal:

1. [UEFA draw results](https://www.uefa.com/uefaeuropaleague/news/0290-1bbc3ce94923-e3a70688bbdd-1000--europa-league-league-phase-draw-contenders-set-for-competitions-new-era/).
2. [UEFA draw procedure](https://www.uefa.com/uefaeuropaleague/news/028e-1b11797faef1-56c7d70b74aa-1000--uefa-europa-league-league-phase-draw/).
3. [UEFA match calendar PDF](https://editorial.uefa.com/resources/0290-1bbea0181c18-c9285f327c80-1000/draw_results_-_uefa_-_uel_-_league_phase_draw_fixtures_by_matchday.pdf).
4. [United’s Tottenham coverage](https://www.manutd.com/en/news/erik-ten-hag-names-team-to-face-tottenham-on-29-september).
5. [United’s Villa coverage](https://www.manutd.com/en/news/every-word-from-erik-ten-hag-press-conference-after-aston-villa-0-man-utd-0-on-6-october-2024).

The example separates opponent/home-away allocations, the separate fixture calendar and domestic-date context. It reports UEFA's stated calendar-release plan, not an independently verified publication timestamp for the accessible PDF. It does not claim that every original fixture detail remained unchanged or establish travel arrangements, recovery hours, fatigue, lineups or outcomes.

Retained both old citations and their URLs. The Champions League announcement now reads **Comparison reading only: UEFA 2026/27 Champions League draw announcement; not evidence for the Europa League example**. The internal Champions League explainer retains its comparison-reading label. Seven sources are listed in total; the five new inline targets match the first five metadata source targets.

Every earlier Article 9 paragraph and its correction notice remains unchanged and in order. The headline, description, category, author, section, related IDs, `/articles/9`, image/credit/review state and original publication timestamp **2026-08-28T15:00:00+03:00** are preserved. `updatedAt` is **2026-10-12**, with the approved dated revision note appended separately. Generated metadata/schema/sitemap dates agree. The generator derives **742 words** and **four minutes** reading time; these are presentation values, not approval thresholds.

The authorized body record is `.editorial/p0-review.json`, `bodies.9`, with a dated owner authorization and before/after hashes. Its before hash matches the existing P0-era body; earlier source-correction approvals and other historical records were not overwritten. Preservation guards chain only these specifically approved source/generated revisions after prior approvals.

## All files changed or created in this task

Central sources/authorization:
- `.editorial/article-content.js`
- `.editorial/news-data.js`
- `.editorial/p0-review.json`

Generated public outputs:
- `articles/9.html` — approved example, links, source list, revision note and metadata.
- `articles/14.html` — **only** related Article 9 card reading time, three to four minutes; its own body/metadata are unchanged.
- `news-data.js` — Article 9 source list, revision date and derived word count.
- `news.html` — Article 9 card reading time.
- `sitemap.xml` — Article 9 modified date.

Necessary preservation/browser checks:
- `.editorial/article-3-revision-check.cjs` — preserves its original snapshots and recognizes only the later approved Article 9 body/metadata/source/generated changes.
- `.editorial/article-24-revision-check.cjs` — chains the Article 9 approved body while retaining Article 24 and other original protections.
- `.editorial/standings-source-check.cjs` — chains approved Article 9 fingerprints after previous Article 3 changes; Standings remains unchanged.
- `.editorial/legacy-exclusion-check.cjs` — chains approved Article 9 generated hashes after earlier approvals; exact exclusions/original asset fingerprints retained.
- `.editorial/browser-check.cjs` — explicit Article 9 no-JavaScript exact-paragraph/link/location/correction/date checks, mobile/desktop/dark/light layouts, screenshots and evidence flag.

New implementation/evidence/report files:
- `.editorial/apply-article-9.cjs` — one-time implementation script, refusing duplicate insertion.
- `.editorial/article-9-revision-evidence.json` — approved insertion/revision, prior metadata/body hashes and public/source fingerprints.
- `.editorial/article-9-revision-check.cjs` — exact addition, original paragraph/correction/metadata preservation, five inline/listed sources, two retained comparison citations, generated dates and precise related-card-only changes.
- `.editorial/ARTICLE_9_IMPLEMENTATION_REPORT.md` — this report.

Refreshed regression evidence:
- `.editorial/browser-results.json`
- `.editorial/raw-html-results.json`
- `.editorial/legacy-exclusion-results.json`

**Unintended changes: none identified.** Public-file fingerprints permit only the five generated outputs listed above. All unrelated article bodies and metadata, Article 32 page/content/image bytes, Standings, APIs, image assets and other public files remain identical to the task's pre-change snapshot. Other Git working-tree differences predate this task.

## Test results

| Check | Result |
| --- | --- |
| `generate-static.cjs` | PASS: all 16 articles and publication outputs regenerated |
| `validate-content.cjs` | PASS: body authorization, metadata/links, inline syntax, protected systems and shared chrome; includes `generate-static.cjs --check` |
| `image-rights-check.cjs` | PASS: registry/hash/delivery consistency; not licensing clearance |
| `api-smoke.cjs` | PASS: existing guards, match fields and standings/fallback source contract |
| `raw-html-check.cjs` | PASS: exact crawlable article bodies, metadata/schema, links/assets, 24 sitemap URLs, redirects and excluded routes |
| `match-coverage-check.cjs` | PASS: 12 competitions, dates/order/deduplication, caching/failure recovery and token isolation |
| `article-32-archive-check.cjs` | PASS: approved archive preserved |
| `article-24-revision-check.cjs` | PASS: existing correction/protections retained |
| `article-3-revision-check.cjs` | PASS: earlier exact example/correction/protections retained |
| `standings-source-check.cjs` | PASS: Standings and protected systems retained |
| `legacy-exclusion-check.cjs` | PASS: exact 19 local exclusions return 404; 22 active resources return 200; originals retained |
| `article-9-revision-check.cjs` | PASS: exact insertion, prior paragraphs/correction, unchanged original metadata, source consistency, generated dates and unrelated-content preservation |
| `browser-check.cjs` | PASS: all 16 routes, metadata/schema/related links, Article 9 exact example/five links/correction/location/dates, no-JavaScript rendering at 320/360/390/1440px in both themes, existing News/Home/Matches/Standings/Watch and shared-chrome checks |
| `git diff --check` | PASS |

Browser evidence: `.editorial/browser-results.json` includes `article9HistoricalExample` with exact-paragraph, five-source, no-JavaScript, viewport and theme results. Screenshots: `C:\Users\user\AppData\Local\Temp\tv96-editorial-tdCrrM`, including `article-9-example-no-js-dark-320.png`, `article-9-example-no-js-dark-1440.png`, `article-9-example-no-js-light-320.png` and `article-9-example-no-js-light-1440.png`.

## Remaining risks and limits

This is an explicitly historical example, not a 2026/27 fixture announcement. The current accessible UEFA calendar is not an immutable independently timestamped release snapshot; no exact publication time or universal absence of later changes is asserted. The club coverage supports domestic-date context; no itinerary or physiological/tactical inference is invented. Source accessibility may vary with JavaScript, caching or later publisher updates.

The change remains local until an authorized deployment. Existing image-rights/branding, Article 32 underlying-photograph permission, certified regional CMP and AdSense account/Auto Ads checks remain unresolved. No media was copied or embedded. The earlier content-quality audit is historical evidence; it was not silently rewritten. Browser/API checks mock external services and do not establish real ad placements, regional consent, current production behavior or AdSense approval.
