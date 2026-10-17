# Article 24 Ligue 1 tiebreak implementation — 13 October 2026

Branch: `adsense-readiness-2026-10-11`. Owner approved the exact four-paragraph addition and the narrow Article 23 related-card exception. No commit, push, deployment or AdSense review submission.

## Implemented

Added H3 `A hypothetical Ligue 1 tiebreak, step by step`, the exact four approved paragraphs and calculation table after both existing paragraphs under `Reading the table carefully`, before `History and development`. The two approved inline citation locations link to the official LFP PDF with `#page=121`.

Authority: https://www.lfp.fr/assets/26_27_LFP_STATUTS_REGLEMENTS_08_09_2026_f2aaaaa325.pdf, Article 518 ter, printed page 121. This provision was reopened and verified during the immediately preceding proposal phase. Criteria 1–8 cover overall GD, head-to-head points, head-to-head GD, overall goals scored, total wins, away wins, disciplinary points and drawing lots. The final paragraphs of the provision restrict criteria 2 and 3 to completed home-and-away meetings; before both are played, criteria 4–7 take priority after overall GD. No other league's order or API ranking behavior was imported.

All clubs, figures and results are explicitly hypothetical. Both clubs have 50 points and +5 overall GD (45−40 and 50−45). Club A's head-to-head points are 3+1=4; Club B's are 0+1=1. Criterion 2 resolves the tie before Club B's higher overall scoring total. The table includes a hypothetical accessible label, column/row headers and local wrapping for mobile widths.

Preserved every original Article 24 paragraph, the two previously approved promotion/relegation corrections and the 12 October 2026 revision notice. Retained all four source entries unchanged and appended the approved Article 518 ter entry using the same official PDF URL. Preserved headline, description, category, author, URL, image, related IDs and `2026-09-05T12:00:00+03:00` publication timestamp. Added the exact approved revision note dated 13 October 2026; `updatedAt` is `2026-10-13`.

Extended the body-hash authorization through an additional `revisions` entry beneath the existing Article 24 approval. Its old before/after hashes and original authorization remain unchanged. The P0 guard validates each successive before/after link. The original Article 24 correction guard still validates its original corrected body against the new pre-insertion snapshot, then verifies the narrowly authorized addition. Prior evidence files were retained.

Regenerated with the existing editorial generator. Final derived word count is 1,205 and reading time is six minutes. Article 23 changed only its Article 24 related-card label from five to six minutes, proven by exact full-text comparison with the saved pre-task page. Article 23 body, title, metadata, citations and other content remain unchanged. The homepage changed only the Article 24 reading-time label, verified by reversing that single change and comparing the pre-task hash.

Articles 3, 9, 21, 22 and 32, Standings, APIs/ranking logic, images, streaming settings and unrelated functionality remained unchanged from the start of this task. Existing unrelated working-tree changes belong to earlier authorized tasks.

## Tests

| Command | Result |
|---|---|
| `node .editorial/generate-static.cjs --check` | PASS — 16 articles and all generator-owned discovery outputs |
| `node .editorial/validate-content.cjs` | PASS — bodies, metadata, links, syntax, protected systems and generator parity |
| `node .editorial/p0-check.cjs` | PASS — all historical and successive approval links, dates, APIs and ad/consent protections |
| `node .editorial/image-rights-check.cjs` | PASS — existing image registry, fallback and suppression safeguards |
| `node .editorial/article-24-tiebreak-check.cjs` | PASS — exact four paragraphs/table, arithmetic, citations, unfinished-season condition, original text/metadata/sources/revision and narrow Article 23 exception |
| `node .editorial/article-24-revision-check.cjs` | PASS — original promotion/relegation correction and historical revision preserved |
| `node .editorial/article-22-revision-check.cjs` | PASS — prior Serie A insertion and protections |
| `node .editorial/article-21-revision-check.cjs` | PASS — prior La Liga insertion and protections |
| `node .editorial/article-3-revision-check.cjs` | PASS — prior example/correction and protections |
| `node .editorial/article-9-revision-check.cjs` | PASS — prior historical example and protections |
| `node .editorial/article-32-archive-check.cjs` | PASS — existing archive presentation preserved |
| `node .editorial/standings-source-check.cjs` | PASS — approved Standings page and API/ranking protections |
| `node .editorial/match-coverage-check.cjs` | PASS — 12 competitions, date boundaries, deduplication, caches and failure cases |
| `node .editorial/api-smoke.cjs` | PASS — existing mocked provider/fallback contracts |
| `node .editorial/raw-html-check.cjs` | PASS — 16 routes, schema/metadata, assets, 24 sitemap URLs, exclusions and redirects |
| `node .editorial/legacy-exclusion-check.cjs` | PASS — 19 excluded local URLs return 404; 22 active resources return 200; all originals preserved |
| `node .editorial/browser-check.cjs` | PASS — full existing suite and exact Article 24 no-JavaScript text/table, citations, calculations, seven row/three column headers, historical revision, dates and layouts at 320/360/390/1440px in both themes |
| `git diff --check` | PASS — exit 0; invoked with per-command `core.safecrlf=false` to suppress conversion warnings, without changing Git configuration |

No final failed checks. Browser evidence: `C:\Users\user\AppData\Local\Temp\tv96-editorial-1DyAR4\article-24-tiebreak-no-js-{dark|light}-{320|1440}.png`. Visually inspected the light 320px screenshot; calculation values fit within the viewport. Browser/API checks mock remote services and use a local routing/deployment model; they do not verify production or owner account settings.

## Every file modified or added in this task

Sources and authorization:

- `.editorial/article-content.js`
- `.editorial/news-data.js`
- `.editorial/p0-review.json`

New implementation, evidence, checks and report:

- `.editorial/apply-article-24-tiebreak.cjs`
- `.editorial/article-24-tiebreak-evidence.json`
- `.editorial/article-24-tiebreak-preservation.cjs`
- `.editorial/article-24-tiebreak-check.cjs`
- `.editorial/ARTICLE_24_TIEBREAK_IMPLEMENTATION_REPORT.md`

Necessary existing guards:

- `.editorial/p0-check.cjs`
- `.editorial/article-24-revision-check.cjs`
- `.editorial/article-22-preservation.cjs`
- `.editorial/article-22-revision-check.cjs`
- `.editorial/article-21-revision-check.cjs`
- `.editorial/article-3-revision-check.cjs`
- `.editorial/article-9-revision-check.cjs`
- `.editorial/browser-check.cjs`

Generated public outputs:

- `articles/24.html`
- `articles/23.html` — authorized related-card reading-time label only
- `index.html` — Article 24 reading-time label only
- `news-data.js`
- `news.html`
- `sitemap.xml`

Refreshed existing test results:

- `.editorial/browser-results.json`
- `.editorial/raw-html-results.json`
- `.editorial/legacy-exclusion-results.json`

## Remaining risks

No unintended changes or unresolved Article 24 implementation failures were found. The example is invented, not evidence of an actual ranking. Its unfinished-season explanation follows this competition's rules and does not assert that TV96's calculated API fallback implements them.

Existing image-rights, owner-side CMP/region testing, AdSense account checks and remaining editorial priorities are unaffected. Local passes do not establish rights clearance, consent compliance, production deployment behavior or AdSense acceptance. Re-review remains held pending the existing action plan and owner checks.
