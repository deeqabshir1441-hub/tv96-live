# Article 24 approved correction — 12 October 2026

Implemented the owner's approved two replacement paragraphs exactly, with a separately identified revision note dated 12 October 2026. The original headline, publication timestamp (`2026-09-05T12:00:00+03:00`), URL (`/articles/24`), image and unrelated body content are preserved. No Article 32 body, metadata, generated page or image change occurred in this task.

## Sources and authorization

Primary source: [LFP 2026/27 regulations](https://www.lfp.fr/assets/26_27_LFP_STATUTS_REGLEMENTS_08_09_2026_f2aaaaa325.pdf), Article 519 (printed page 122: promotion/relegation) and Article 519 ter (printed pages 123–124: playoff format). Exceptional interruption/reinstatement provisions are Articles 518 quater and 520. This PDF was inspected during source verification; subsequent retrieval timed out. No claim of continuously available remote access is made.

Supporting source: [official 2026/27 Ligue 2 calendar](https://www.lfp.fr/article/ligue-2-bkt-le-calendrier-de-la-saison-2026-2027), published 10 June 2026. Retained older citations are explicitly labeled historical: 2024 and 11 May 2026 (2025/26 season). Their previously observed HTTP 500 responses remain a historical-link availability limitation, not the evidence supporting the revised passage.

The authorized before/after SHA-256 body revision is in `p0-review.json`, under `followupRevision.bodies.24`, with its own 12 October 2026 authorization. The pre-existing Article 32 authorization is unchanged. `article-24-revision-evidence.json` records the preserved metadata, original bodies, Article 32 image/page fingerprints and exact generated-output approvals.

## Final test results

| Check | Final result |
| --- | --- |
| generate-static.cjs (generation and --check via validation) | PASS: 16 articles, generated metadata, News/Home, sitemap and redirects |
| validate-content.cjs | PASS: body preservation, metadata, links, JavaScript syntax, protected systems, generated outputs |
| p0-check.cjs (via validation and archive check) | PASS: approved revisions and original protections |
| sync-site-chrome.cjs --check (via validation) | PASS: nine static sources |
| image-rights-check.cjs | PASS: 15 registered WebP images and fallback; this is a technical check, not legal clearance |
| api-smoke.cjs | PASS: mocked API guards, match fields, standings and fallback |
| match-coverage-check.cjs | PASS: 12 competitions, date boundaries, cache/error handling and frontend coverage |
| raw-html-check.cjs | PASS: 16 articles, schema, local assets, 24 sitemap URLs, redirects and excluded routes |
| browser-check.cjs | PASS: all articles, JavaScript-disabled content, Home/News, themes, navigation, matches/standings and disabled Watch; tested widths include 320, 360, 390 and 1440 px |
| article-32-archive-check.cjs | PASS: existing archive presentation retained |
| article-24-revision-check.cjs | PASS: exact approved paragraphs plus revision note; preserved publication metadata and every unrelated body; Article 32 metadata/page/images unchanged |
| legacy-exclusion-check.cjs | PASS: 19 excluded URLs return local 404; 22 active resources return 200; all 19 originals preserved |
| adsense-scope-followup.cjs | PASS: local publisher/canonical consistency, 26 pages and 24 sitemap entries; remote source observations are retained with their original timestamps |

Two initial guard failures were resolved narrowly: validation still expected the pre-approval deployment exclusions, and legacy preservation still expected pre-correction generated outputs. Validation now permits exactly the previously approved 19 exclusions; the legacy check validates explicit before/after hashes for the six affected generated files. All other protections remain in force. No deployment exclusion was changed by this task.

Browser screenshots: `C:\Users\user\AppData\Local\Temp\tv96-editorial-hu4ruX`.

## Files changed by this task

Central sources / authorization:
- `.editorial/article-content.js`
- `.editorial/news-data.js`
- `.editorial/p0-review.json`

Checks / evidence / implementation record:
- `.editorial/validate-content.cjs`
- `.editorial/legacy-exclusion-check.cjs`
- `.editorial/implement-article-24.cjs` (one-time implementation script; deliberately refuses the already-revised body)
- `.editorial/article-24-revision-check.cjs`
- `.editorial/article-24-revision-evidence.json`
- `.editorial/ARTICLE_24_IMPLEMENTATION_REPORT.md`

Generated outputs:
- `articles/24.html` (corrected passage, sources, revision display and schema)
- `articles/23.html` (only the related Article 24 card's reading time: four to five minutes)
- `news-data.js` (Article 24 metadata and derived word count)
- `index.html` (generated metadata)
- `news.html` (Article 24 reading time)
- `sitemap.xml` (Article 24 revision date)

Refreshed test evidence:
- `.editorial/browser-results.json`
- `.editorial/raw-html-results.json`
- `.editorial/legacy-exclusion-results.json`
- `.editorial/adsense-scope-followup-results.json`

Other pre-existing working-tree changes belong to earlier authorized work and are not new changes from this task. In particular, Article 32 already differed from Git HEAD before this task; its current contents were preserved.

## Remaining blockers and limits

Article 24's requested current-season promotion/relegation verification is resolved. Article 32 photograph-derived image rights remain unresolved; other rights-evidence, regional Google-certified CMP and AdSense account-level checks remain owner verification items. Passing image tests does not establish licensing or legal clearance. Keep AdSense re-review on hold pending those blockers.

Checks used local routing, mocked APIs and browser services; they do not verify deployed behavior, remote CMP settings or an AdSense account. No commit, push, deployment, external account change, streaming enablement or AdSense review submission occurred.
