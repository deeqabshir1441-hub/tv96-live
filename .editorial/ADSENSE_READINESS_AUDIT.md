# TV96 Live AdSense readiness audit

Audit date: 11 October 2026, Africa/Nairobi. Site: https://www.tv96live.org. Local branch: `adsense-readiness-2026-10-11`. Initial working tree was clean. No commit, push, deployment, external configuration change or review submission was performed.

## Executive assessment

**Recommendation: hold another review request until the owner verifies consent and media rights, reviews the dated news presentation, and checks the deployed fixes.** This is a readiness recommendation, not a diagnosis of Google's rejection. No rejection email or account-specific Policy Center details were available. Approval cannot be guaranteed; there is no assumed minimum article count or word count.

The site has 16 published articles and 16 unpublished records. All published bodies are in server-delivered HTML, have unique titles/descriptions, bylines, dates, Article JSON-LD, contextual links and three related articles. All 16 production bodies matched their local editorial sources. The sitemap contains 24 URLs: eight primary pages and 16 articles. Existing permanent article merges and clean-URL normalization work in production.

Confirmed safe fixes: News's match sidebar now tracks asynchronous loading, successful/empty responses and errors, and escapes upstream text; the app manifest no longer promises live HD streaming while playback is disabled; editorial maintenance documentation now states the current card count. Articles, legal text, images, analytics, advertising loaders, football APIs and stream configuration were preserved. No material was silently withdrawn or padded.

The most significant unresolved questions concern a certified CMP for affected European visitors and permission for media/competition branding. These are owner-verification items, not proven violations. Official Ligue 1 source endpoints returned 500 to direct requests, although Google's browsing service retrieved their content. This discrepancy was recorded rather than disguised by substituting another unverified source.

## Baseline and evidence

Official references consulted:

- [Google Publisher Policies](https://support.google.com/adsense/answer/10502938?hl=en): intellectual property, representation, inventory value, privacy and ad interactions.
- [AdSense Program policies](https://support.google.com/adsense/answer/48182?hl=en) and [ad placement guidance](https://support.google.com/adsense/answer/1346295?hl=en).
- [Certified consent management requirements](https://support.google.com/adsense/answer/13554116?hl=en) and [consent management setup](https://support.google.com/adsense/answer/7670013?hl=en).
- [Site connection and verification](https://support.google.com/adsense/answer/12169212?hl=en) and [ads.txt guidance](https://support.google.com/adsense/answer/12171612?hl=en).
- [Search Central helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) and [canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

Evidence files are local and excluded from Vercel by the existing `.vercelignore:1` rule for `.editorial/`:

| Evidence | Scope |
| --- | --- |
| `adsense-local-inventory-results.json` | Repository file paths, sizes/hashes, all active article metadata/body line references, word counts, links and repeated paragraphs |
| `adsense-production-results.json` | 84 requested production URLs, redirect chains, status, canonicals, robots directives, schema, crawlable text, 37 additional local resources/navigation targets and 31 distinct source URLs |
| `adsense-live-browser-results.json` | 25 primary pages at 1440px and 360px, actual text, navigation, layout overflow, image failures, console/runtime/network events and observed CMP globals |
| `adsense-home-browser-results.json` | Follow-up showing the image warning was an invisible empty match-modal image |
| `adsense-followup-results.json` | Successful HTTP/non-www recheck and repeated direct Ligue 1 source failures |
| `raw-html-results.json`, `browser-results.json` | Existing local raw-HTTP and Chromium validation outputs; local football/third-party responses are mocked |

The report lives inside `.editorial/` deliberately: it must not become a public site page containing internal review material. Historical AUDIT/REPORT/PRODUCTION-FIXES/IMAGE-SOURCE-CLEANUP documents were read as history, not assumed to describe today's deployment.

## Repository and generation inventory

There is no package manifest, dependency-install step or framework build. No applicable AGENTS.md was found. Public assets are static HTML/CSS/JS; `api/matches.js` and `api/standings.js` are Vercel handlers with a server-side football-data.org token. No token was exposed or modified.

Canonical workflow: `.editorial/news-data.js` supplies metadata, statuses, sources, related IDs and image review records; `.editorial/article-content.js` supplies trusted HTML; `content-model.cjs` loads both; `article-template.html` supplies shared presentation. `sync-content.cjs` invokes `generate-static.cjs`, which writes numeric article HTML, published-only root `news-data.js`, marked Home/News blocks, sitemap, Watch indexing state and allowlisted redirects. Generation verifies image hashes against `optimized-images.json`. `optimize-article-images.cjs` uses installed Chromium to produce WebP; no new image processing was needed. `sync-site-chrome.cjs` maintains shared markup and was checked through validation.

Inspected generators, API/frontend scripts, service worker/manifest, config/routing, editorial bodies/metadata, source approval/retirement manifests, existing tests and generated outputs. The inventory hashes retained assets without treating their presence as licence evidence. IDE/Git internals are outside the published-site inventory. The accidental root filename `tatus --short` is a maintenance artifact, not an active route dependency; no deletion was performed.

Active IDs: **3, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 32**. Removed IDs **1, 2, 4, 7, 11** remain retired; merges **8 → 10, 20 → 12, 25 → 14** remain permanent. Other unpublished IDs **5, 6, 26–31** have no public article. No IDs were reused.

Integrations: one existing AdSense loader on Home, News, Matches, Standings, About, Privacy and each article; Umami on Home; Vercel analytics on Home/News/articles; cdnjs/jsDelivr/Tailwind assets where referenced; team/league images from media.api-sports.io and crests.football-data.org; social outbound links. HLS and stream/history scripts are gated by disabled streaming. Local storage stores theme preference; `sw.js` caches selected static assets and provides an offline page. Contact is mailto, with no web submission endpoint.

## Prioritized findings

P0 means a review hold or serious user/policy concern; P1 means important; P2 means optional. A priority does not establish a policy violation or Google's actual rejection reason.

| Priority / evidence class | Location / affected URL | Proof and implication | Proposed fix / disposition | Baseline |
| --- | --- | --- | --- | --- |
| P1 confirmed, fixed locally | `news.html:542`, `/news` | Sidebar read empty initial arrays once. No `matchesDataUpdated`, failure event or promise handler existed. Live News said no matches while live Standings listed upcoming fixtures. Provider strings were interpolated as HTML. | Track loading/ready/failed, refresh on completion/events, distinguish no upcoming fixtures, escape text/URL attribute. Delayed response, failure, empty and injection tests added. | Helpful content/user experience; Publisher representation |
| P1 confirmed, fixed locally | `manifest.json:4`, installable app | Description advertised live HD streaming while `site-config.js:2` is false and `/watch-live` says unavailable. | Describe actual football news, guides, fixtures, scores and standings. Existing brand and app settings preserved. | Publisher representation |
| P2 confirmed, fixed locally | `.editorial/README.md:15` | Maintenance instructions said 23 News cards; model, raw News and production have 16. | Correct to 16; no content change. | Source/output consistency |
| P0 owner verification, unresolved | AdSense loaders, e.g. `index.html:30`, `.editorial/article-template.html:37`; `/privacy` | No first-party CMP/TCF implementation found; no `__tcfapi` or Funding Choices global observed in the unmodified production browser session. No European location was emulated. | Owner must verify a Google-certified CMP/IAB TCF configuration and actual regional consent behavior before applicable ad serving. Do not infer noncompliance solely from an unspecified-region session or install a cosmetic banner. | Certified CMP and EU consent requirements |
| P0 owner verification, unresolved | `.editorial/news-data.js:816`, `/articles/32`, Home; `images/articles/jj-gabriel.webp` | Metadata says user-provided, not licensed. Visible artwork depicts a young player, Manchester United and Adidas marks. No permission documentation found. | Obtain source/licence and relevant permissions; assess whether image presentation accurately identifies its provenance. If permission fails, obtain owner authorization for replacement/removal through the editorial workflow. | Publisher intellectual property/representation |
| P1 plausible rights risk | `.editorial/news-data.js:853`, image registry; `/articles/9–24` and shared branding | All 15 active registered images retain `brandingReview: required`; registry automatically assigns reviewed status to original-editorial assets. Visual samples 12 and 14 depict trophies/competition marks. Site logos, banners, upstream crests and unused agency-marked files also lack demonstrated licences. | Complete actual rights review, retain creation/licence evidence, and restrict unused unlicensed deployment assets when authorized. A passing image test establishes registration/hash consistency, not legal permission. | Publisher intellectual property |
| P1 confirmed availability issue; permanence unproven | `.editorial/news-data.js:702`, `/articles/24` source list | Two cited Ligue 1 endpoints repeatedly returned HTTP 500 to direct requests; full-slug alternative also failed. Browsing service retrieved official content. | Recheck in a normal browser; replace only with a working verified official reference. Original citations retained; no claims rewritten from an unavailable source. | Helpful content sourcing |
| P1 editorial freshness risk | `.editorial/news-data.js:816`, `.editorial/article-content.js:28`, `/articles/32`, Home/News | 15 September story still tagged Breaking news and foregrounded on 11 October. Text says 15 and birthday 6 October and discusses a pending cup selection/request. | Editor should verify subsequent outcome and either add a genuinely dated update or explicitly archive the original account. Preserve historical publication date; do not silently change age/outcome. | Helpful content reliability/freshness |
| P1 owner verification | `index.html:8`, `ads.txt:1`; site/account verification | Existing `ca-pub-9924964891667864` matches ads.txt seller ID and loaders. Verification file is reachable after a clean-URL redirect. This does not establish account ownership/status. | Owner checks exact domain, publisher ID, verification status, ads.txt status and Policy Center in AdSense; Search Console URL inspection for index state. | AdSense connection and ads.txt guidance |
| P1 plausible dormant streaming risk | `streams.js`, `watch-live.html:169`, `vercel.json:13`; `/streams.js`, `/match-ids` | Local file contains third-party HLS endpoints without authorization evidence. Feature false; live stream/utility URLs redirect to a genuine 404; no player appears in disabled Watch DOM. | Keep disabled. Require documented broadcast rights and explicit owner authorization before any re-enable. No stream hosts were requested or modified. | Publisher intellectual property |
| P2 confirmed optional usability issue | `manifest.json:9`, `manifest.json:15` | Icon declarations say 192/512 but PNG headers show both files are 1024×1024. | In a later asset change, create correctly sized icons or accurately declare their dimensions; review existing artwork rights first. | App installation usability, not established AdSense blocker |
| P2 technical limitation, already disclosed | `api/standings.js:9`, `/standings` | Calculated fallback ranks on points/GD/GF; it cannot settle every league's head-to-head/play-off/disciplinary case. UI advises official confirmation. | Keep caveat; future provider/ranking work should be separately scoped and tested. No football behavior removed. | Helpful content accuracy |

No confirmed currently active unauthorized playback, incentivized ad clicking, deceptive manual ad unit, adult/gambling material, malware, or article plagiarism was established. This is not a certification of all rights or every possible ad placement. Auto Ads settings and served creatives were outside account access.

## Every active article

Common checks for all 16: HTTP 200, canonical `https://www.tv96live.org/articles/ID`, index/follow, crawlable full body without JS, unique metadata, Organization byline "TV96 Live Editorial Team", valid dates and schema, one visible H1, readable paragraphs/headings, contextual links plus three related links, and working local delivery images where used. No future publication/revision date relative to 11 October. Body counts below are generator counts, not eligibility thresholds. Historical authorship/expertise and editorial sign-off still require owner confirmation.

References in the table are metadata/body source line numbers in `.editorial/news-data.js` / `.editorial/article-content.js` respectively. Generated delivery is `articles/ID.html`. All images except image-free 3 require the rights review described above; no row certifies a licence.

| ID / subject | Lines; words | Individual assessment and source/freshness action |
| --- | --- | --- |
| 3 — World Cup knockout assists | 60 / 5; 466 | Clear scope/provider caveats and labelled hypothetical example; correction transparently removes unsupported historical rankings. Only internal further reading, so do not market as a verified statistical record. No hero photograph; retired candidate remains suppressed. Original July date and September revision retained. |
| 9 — Reading a European draw | 205 / 11; 477 | Useful draw-vs-schedule/travel checklist, not a confirmed opponent list. Correction removes prior unsupported fixtures. Exact UEFA draw reference returned 200; confirm its season-specific relevance rather than treating Champions League rules as Europa League rules. Some conceptual overlap with 14, but different user question. |
| 10 — Álvarez chronology | 238 / 12; 324 | Short but focused archive: official Atlético position, attributed private-meeting/Arsenal reporting and limits of inference. Three precise sources returned 200; official statement was also browsed. No invented price or completed transfer conclusion. August chronology and September correction explicitly dated; retain archive framing. |
| 12 — Premier League structure | 302 / 14; 881 | Worked 20-team/38-game/380-fixture and points examples, table reading and contextual links. Official PL sources reachable. Useful introductory guide; shares some rules with 18/19 but serves a broader purpose. Check season allocations rather than adding a fixed promise. |
| 13 — Champions League entry | 337 / 15; 823 | Distinguishes entry stages, paths, association/club coefficients, title holders and performance spots. Useful checklist and hypothetical examples. UEFA general sources reachable; regulation URLs returned a JS application shell, so HTTP 200 alone did not independently verify every 2026/27 provision. Human regulation check remains. |
| 14 — Champions League format | 375 / 16; 951 | Specific league-phase boundaries, two-leg aggregate examples and final; distinguishes entry from knockout progression. General UEFA explanation supports overall format; Article 17–22 links are JS-dependent sources. Have editor inspect actual regulations. Branded trophy graphic needs review. |
| 15 — Goal difference | 422 / 17; 782 | Correct worked arithmetic, two-team swings, points-before-GD and explicit limits across competitions. Hypothetical teams are labelled. PL and Serie A sources reachable. Useful independent calculation lesson, not padding to the league guide. |
| 16 — Expected goals | 455 / 18; 823 | Explains shot quality, aggregation, provider/model differences and outcome limitations. Named Hudl Statsbomb methodology source returned 200. No supplied match xG represented as site-produced data. Check methodological claims against that provider before future numerical reporting. |
| 17 — VAR | 481 / 19; 839 | Distinguishes checks/reviews, on-field decision, second caution and optional corner provision; examples and reporting guidance add utility. IFAB current 2026/27 protocol/law-change pages available through direct HTTP and browsing. Future rule revisions need a genuinely dated update, not automated freshness. |
| 18 — PL relegation | 511 / 20; 841 | Points/GD worked example, safety limits, remaining-game bounds and promotion context. Official PL/EFL sources reachable; EFL March announcement consulted. Does not repeat an obsolete fixed play-off field. Some rule overlap with 12, but distinct survival-calculation focus. |
| 19 — PL European routes | 545 / 21; 904 | Layered cup/performance/title-holder checklist and conditional scenarios. Reachable PL/UEFA references; 2026/27 regulation application still needs human reading. Shares a single short explanatory paragraph with 13, not an entire duplicated article. Do not infer an automatic extra English place. |
| 21 — La Liga | 614 / 23; 777 | 20-team structure, conditional ranking warning, tactics/transitions and practical fixture/table use. Official standings reachable; no full current Spanish regulations verified. Conservative wording avoids claiming a complete tiebreak procedure. More precise rule source would improve usefulness. |
| 22 — Serie A | 641 / 24; 849 | Competition/cup distinction, dated 2025/26 relegation play-off example, tactical shapes and history. Two official source URLs returned 200. Historical example is explicitly season-specific, not certification of all 2026/27 rules. Editor should confirm exceptional championship ties before expansion. |
| 23 — Bundesliga | 672 / 25; 814 | Useful 18-team/34-match/306-fixture arithmetic, 16th play-off versus automatic relegation distinction and pressing questions. Exact official promotion and FAQ pages reachable. No invented player/team news. Retain current-season rule review. |
| 24 — Ligue 1 | 702 / 26; 843 | Useful 18-club/34-game comparison and 3rd–5th Ligue 2 pathway versus Bundesliga. Two sources fail direct HTTP; official browsing content corroborates established pathway but not every current-season detail. Flag availability and season confirmation; do not expand or replace facts based solely on cached content. |
| 32 — JJ Gabriel request | 816 / 28; 885 | Attributed BBC/MEN account distinguishes request from completed departure and Giggs comments from response. Both exact reports returned 200. No exclusive reporting claimed. Most time-sensitive article: birthdate/age, cup selection and unresolved status need human follow-up; photo/marks require provenance. |

The paragraph comparison found one identical paragraph over 100 characters (13/19). Several league guides reuse a general outline and cautious analytical language; this is an editorial distinctiveness risk, not proof of copied or low-value content. The useful arithmetic, separate competition structures and different examples support retaining them. Further improvement should answer real reader questions with verified evidence, rather than add filler or spin sources. No comprehensive external plagiarism database or private licence records were accessible.

## Primary pages and live routing

| Page | Result and remaining limit |
| --- | --- |
| Home | 200, self canonical, four raw editorial cards plus dynamic fixtures; layouts/navigation passed. Lead story freshness remains an editorial task. |
| News | 200, self canonical, all 16 links in raw HTML; JS adds filters/pagination. Confirmed match-sidebar defect fixed locally; production still has old behavior because nothing was deployed. |
| Matches | 200, API-driven fixtures; local empty/failure/day-tab tests passed. API failure is explicitly separated from no returned coverage. Live API returned 200; this is a snapshot, not an uptime guarantee. |
| Standings | 200, API-driven tables; local success/empty/failure tests passed. Live PL API returned 200. Official-outcome caveats present; fallback limitation remains. |
| About | 200, readable scope/editorial/correction process and contact. Generic team byline is consistent; actual staff credentials not verified. |
| Contact | 200, usable mailto enquiry/correction/rights links and explanation of no form. Inbox ownership/deliverability require owner verification. |
| Privacy | 200, readable descriptions of hosting/Umami/advertising/theme/offline caching and third-party connections. Operational retention and consent settings are unverified. No legal wording changed. |
| Terms | 200, readable use/content terms and contact navigation. Legal sufficiency not certified; wording preserved. |
| Watch Live | 200, noindex/follow, helpful unavailable message/links; no active video in live DOM, no AdSense loader. Excluded from sitemap. Playback remains disabled. |

All primary and article pages passed live DOM checks at 1440px and 360px, with no uncaught runtime exceptions or observed console/network error events during the observation windows. Every mobile menu opened with `aria-expanded=true`, exposed navigation and closed with Escape. No horizontal overflow. An automated image warning on Home was investigated: `matchModalHomeLogo` has an empty source inside a hidden modal; follow-up confirmed `visible=false`. It is not a visible broken asset. Lazy images outside the observed viewport and all possible real ad layouts were not exhaustively assessed.

Production route observations:

- `http://tv96live.org/`: 308 to HTTPS non-www, then 308 to HTTPS www, then 200. One crawl rerun timed out before response; the follow-up reproduced the valid chain. HTTP www and HTTPS non-www normalize correctly.
- Active `/articles/ID.html` → 308 → clean article → 200. `/articles/12/`, `/news/`, `/news.html`, `/index.html` normalize correctly.
- Clean merged URLs → 308 → surviving article → 200; `.html` forms take an additional normalization hop. Legacy query forms preserve `?id=...` in production; the final page canonical points to the clean surviving article. This is an acceptable alternate URL, not an inherent canonical error. The local test server omits those query strings, so its redirect model is not identical to Vercel.
- Removed/draft IDs, unknown articles and requested private/editorial source files return genuine 404 with noindex. `/streams.js` and `/match-ids` give 307 to `/_streaming-disabled`, which returns 404.
- Robots allows crawling and names the correct sitemap; no Google crawler block found. Sitemap excludes disabled Watch, drafts, retired routes and utilities. All local page/asset/navigation resources extracted from actual markup returned successfully. Script strings/template contents are excluded from link extraction to avoid false `${...}` URLs.
- Ads.txt is HTTP 200 text/plain with `google.com, pub-9924964891667864, DIRECT, f08c47fec0942fa0`. IDs agree locally and on production; account identity remains unverified.
- Ownership verification HTML returns 308 to a clean route and then 200 with its original token text. Presence does not prove Google has accepted verification.

## Remediation log and exact change scope

1. Audited the model, generation workflow and baseline tests before edits; reported the News finding before remediation.
2. Fixed only News's nongenerated sidebar script (`news.html:542` onward), using existing event/promise APIs and escaping helper.
3. Extended `.editorial/browser-check.cjs` with a genuinely delayed future upcoming fixture, malicious text, empty and failed News API scenarios. An intermediate test fixture failed because the existing kickoff logic correctly converted its past kickoff to Finished; the fixture was corrected to a future date, retaining the assertion and existing production behavior. Final tests pass.
4. Changed only `manifest.json` description and the stale count in `.editorial/README.md`.
5. Ran the established generator. Outputs are current; no manual generated article/data edits were made. No article body, source list, publication status, title, date or image was changed.

Modified existing files: `news.html`, `manifest.json`, `.editorial/README.md`, `.editorial/browser-check.cjs`, `.editorial/browser-results.json` (fresh test evidence).

Added files: `.editorial/ADSENSE_READINESS_AUDIT.md`; `.editorial/adsense-local-inventory.cjs` and `adsense-local-inventory-results.json`; `.editorial/adsense-production-check.cjs` and `adsense-production-results.json`; `.editorial/adsense-live-browser.cjs` and `adsense-live-browser-results.json`; `.editorial/adsense-home-browser-results.json`; `.editorial/adsense-followup-results.json`. All are deployment-excluded by the existing rule. No dependency/configuration changes.

## Validation and before/after

| Command / check | Final result |
| --- | --- |
| `node .editorial/generate-static.cjs` | PASS, 16 static articles generated through established workflow |
| `node .editorial/generate-static.cjs --check` | PASS, outputs current |
| `node .editorial/validate-content.cjs` | PASS, unique metadata, links, dates, script syntax, source/body preservation, protected systems, sitemap and chrome; includes P0 and chrome checks |
| `node .editorial/image-rights-check.cjs` | PASS, 15 active registered WebP assets/hashes and suppressed candidate references; not a licence certification |
| `node .editorial/match-coverage-check.cjs` | PASS, 12 competitions, IDs, deduplication, EAT rollover, ordering, cache/backoff/stale/partial/network cases and frontend coverage |
| `node .editorial/api-smoke.cjs` | PASS, mocked matches/standings guards and fallback |
| `node .editorial/raw-html-check.cjs` | PASS, 16 complete raw articles, metadata/schema, internal assets/links, 24 sitemap URLs, excluded routes and merges |
| `node .editorial/browser-check.cjs` | PASS, JS-disabled article/News, filters, themes, install prompt, navigation, 320–1440px checks, matches/standings fallback and new delayed/error/empty/escaping sidebar cases |
| Read-only live HTTP / live Chromium | Recorded, not an all-network assertion: 84 URLs + 37 resources + 31 sources; 50 desktop/mobile page observations; source failures and one transient timeout retained |

Published count **16 → 16**, unpublished **16 → 16**, sitemap **24 → 24**, source bodies/titles/dates/statuses unchanged, four Home cards, three featured News links and three related links per article unchanged. No framework build exists; generation plus existing checks are the available build/validation workflow. Image optimization was not rerun because no image input changed. No test assertions were suppressed or historical approval manifests weakened.

## Owner tasks and limits before another review

1. Check exact rejection/Policy Center details and account/domain/publisher identity. Validate ownership and ads.txt inside Google; public HTTP cannot establish account state.
2. Verify certified consent behavior from EEA/UK/Switzerland including accept, reject, withdrawal and applicable ad signals. No regional emulation/account configuration was available. Any needed legal wording changes require owner approval and accurate operational information.
3. Obtain rights evidence for supplied image 32, competition/trophy imagery, site branding and upstream logos. Review unused agency-marked files before future deployments; public direct asset availability alone does not prove an infringement. Streaming must stay false unless broadcast rights and explicit authorization are established.
4. Have an editor review the JJ Gabriel story's subsequent outcome and presentation, actual UEFA regulation content, and Ligue 1 source availability/current rules. Improve precise sourcing without fabricated reporting or extra padding.
5. When the owner authorizes a release, deploy the reviewed local changes and repeat production sidebar/install checks. This task did not deploy. Check Search Console indexing/canonicals and actual Auto Ads behavior, including content/error screens and mobile navigation separation, before requesting review.

Direct local network was initially restricted; authorized read-only requests subsequently worked. Live browser checks used a fresh local Chromium profile, no simulated services and no clicks on ads/video. Observations are time/region/browser-specific and do not prove continuous API uptime, global consent behavior, all lazy asset delivery, actual ranking/index inclusion, ad density, copyright permissions, email operation or all factual claims. The report keeps those limitations separate from confirmed defects. No high-impact editorial, legal, stream or account change was implemented.
