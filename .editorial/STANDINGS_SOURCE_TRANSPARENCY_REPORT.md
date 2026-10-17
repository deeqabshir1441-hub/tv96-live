# Standings source transparency — 12 October 2026

Owner-approved implementation on `adsense-readiness-2026-10-11`. The existing `standingsSource` field is now displayed above the table, outside the horizontal scrolling container. Strict equality checks recognize only `official` and `calculated-from-finished-matches`; every other value gets the neutral unavailable-source notice. All notice content uses fixed strings and `textContent`.

## Exact reader-facing text

- **Provider data** — Supplied by football-data.org. Updates may be delayed.
- **Calculated from available results** — Positions are provisional. Available results may be incomplete, and calculations may not reflect points deductions or competition-specific ranking rules. Check the competition’s official table before relying on a position.
- **Data source unavailable** — This response does not identify whether the standings were supplied by the provider or calculated. Check the competition’s official table before relying on a position.

The API's internal `official` value identifies the provider branch, not a verified or governing-body-certified status. Missing, null, object, array, numeric, boolean, unknown and case-mismatched values are not inferred to mean provider data.

The label remains associated with existing rows while a background request is pending. Once replacement rows render, their notice updates in the same synchronous execution. Every existing loading/unsupported/empty/error message clears and hides the old notice. Existing table messages, row rendering/order, polling, providers, credentials, colours and calculations are preserved.

The notice uses a persistent polite, atomic status region, visible textual labels/warnings, wrapping paragraphs and explicit high-contrast dark/light colours. Browser tests check status attributes, layout and at least 4.5:1 text contrast. This is not a claim of complete screen-reader testing or a site-wide accessibility certification.

## Files changed in this task

- `standings.html`: scoped styles, notice markup, fixed-text source mapping and clear/update calls.
- `.editorial/browser-check.cjs`: provider/fallback/unknown metadata fixtures; exact copy; delayed provider→calculated→provider transitions with different displayed points; missing/null/malformed/untrusted values; empty/malformed/HTTP/network failures; initial loading/unsupported states; mobile/themes/contrast/accessibility and screenshots.
- `.editorial/api-smoke.cjs`: source-field type and existing string contract, unchanged caching, provider provenance when fallback is not applied, preserved provider adjustments/order and request behavior. No handler mutation.
- `.editorial/p0-review.json`: separate dated, owner-authorized Standings page before/after hash chain; prior approvals retained.
- `.editorial/p0-check.cjs`: validate the original page approval against preserved before-text and validate the new follow-up hash; other original guards retained.
- `.editorial/legacy-exclusion-check.cjs`: recognize only the explicitly recorded Standings before/after hash in addition to existing Article 24 approvals; all other asset/public-file protections remain.
- `.editorial/standings-source-revision.json`: preserved prior page, approval hashes and exact fingerprints for protected APIs, other pages, article sources, Article 32 images and all 16 article outputs.
- `.editorial/standings-source-check.cjs`: verify approved page hash and protected-file preservation.
- `.editorial/STANDINGS_SOURCE_TRANSPARENCY_REPORT.md`: this implementation record and separately scoped findings.
- Refreshed regression evidence: `.editorial/browser-results.json`, `.editorial/raw-html-results.json`, `.editorial/legacy-exclusion-results.json`.

Pre-existing working-tree changes belong to earlier tasks. No static article generation was needed; `generate-static.cjs --check` is included in content validation. No article or unrelated public page was edited.

## Separate follow-up findings — calculations unchanged

These limitations are directly visible in `api/standings.js`; no incorrect live ranking is inferred from them:

1. **Fixture completeness:** reconstruction uses only returned matches and the provider table's team IDs. Missing fixtures and unrecognized team IDs can omit results; completeness is not established before adopting the fallback.
2. **Deductions/adjustments:** points are calculated from wins/draws, so provider/competition disciplinary deductions and other adjustments are not independently applied.
3. **Ranking rules:** sorting uses points, GD, goals scored and alphabetical order. It does not implement each competition's complete head-to-head, decisive-playoff, disciplinary or other ranking procedure.
4. **Incomplete scores:** converting values through `Number()` makes null or empty-string scores zero. Such values can be counted as scores; undefined/non-numeric values are skipped. Proper score validation needs a separately approved fix.
5. **Adoption count:** `completedMatchCount` counts status-filtered matches before unusable/team-mismatched records are skipped. A positive count does not prove any usable result was incorporated.
6. **Fallback availability:** reconstruction is attempted only when every provider row has zero played games; provider request failures are errors, not a universally available fallback. Exceptions during the fallback request can still cause the existing error path.

A future calculation change needs a separate proposal defining usable records, coverage, league rules, adjustments, source labeling and meaningful regression cases. This task neither silently fixes these limitations nor declares fallback positions official.

## Regression results

| Check | Final result |
| --- | --- |
| `validate-content.cjs` | PASS; includes P0 historical/authorized revision checks, shared chrome, metadata, protected files and `generate-static.cjs --check` for all 16 articles |
| `api-smoke.cjs` | PASS; existing handler guards/outputs plus extended source contract and provider-adjustment/order checks |
| `browser-check.cjs` | PASS; new provenance scenarios, exact copy, refresh transitions, empty/malformed/HTTP/network failures, loading/unsupported states, live-region attributes, dark/light text contrast and 320/360/390/1440px layouts; existing article/News/Matches/Watch/chrome regressions also pass |
| `raw-html-check.cjs` | PASS; 16 articles, metadata/schema, assets, related/internal links, 24 sitemap URLs, redirects and excluded routes |
| `image-rights-check.cjs` | PASS; registry/asset consistency, not licensing clearance |
| `match-coverage-check.cjs` | PASS; 12 competitions, date boundaries, caching/error recovery and frontend coverage |
| `article-32-archive-check.cjs` | PASS; existing archive retained |
| `article-24-revision-check.cjs` | PASS; approved correction and preservation retained |
| `legacy-exclusion-check.cjs` | PASS; exact 19 exclusions return local 404, 22 active resources return 200 and original files preserved |
| `standings-source-check.cjs` | PASS; approved page fingerprint and all protected files preserved |
| `git diff --check` | PASS |

Browser artifacts: `C:\Users\user\AppData\Local\Temp\tv96-editorial-3IbQJE`. New screenshots are `standings-source-dark-320.png`, `standings-source-dark-1440.png`, `standings-source-light-320.png` and `standings-source-light-1440.png`. Dark mobile and light desktop captures were visually inspected: warning text wraps within the main column above the table. The displayed teams/points are deterministic browser-test fixtures, not actual standings.

All browser/API scenarios use local mocked services, not production credentials or real ad requests. Live response metadata, regional CMP, Auto Ads and production deployment remain unverified by these tests. Historical AdSense/image-rights blockers are unaffected. Cached/older API responses without source metadata display the neutral unavailable-source notice, without inferred provenance.

No commit, push, deployment, streaming enablement, external account change or AdSense review submission was performed. Article 32's existing archive, content, metadata and image bytes are preserved.
