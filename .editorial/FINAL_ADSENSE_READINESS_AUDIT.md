# Final coordinated AdSense readiness audit — 13 October 2026

Project TV96 Live; branch `adsense-readiness-2026-10-11`; https://www.tv96live.org. All three requested phases completed. This is read-only auditing, proposal preparation and report generation; no new editorial, design, API, image, consent or ad-setting changes. Earlier approved local fixes remain intact. No commit, push, deployment or review submission.

## Decisions

**Deployment readiness: NOT READY for an unrestricted release represented as fully AdSense-ready.** Outstanding rights decisions and owner verification remain. **The already approved local technical/editorial patch bundle is technically READY**, with all local regressions passing; it does not need rollback. A separately authorized deployment can deliver those reviewed fixes, but cannot itself establish image permissions or regional consent compliance. New Article 23/Home/About proposals are not implemented or approved.

**AdSense re-review readiness: NOT READY.** Close owner-side rights, CMP, account and actual ad-layout checks; deliver and verify the approved local fixes; address the selected content-quality proposals. Passing tests is not AdSense approval. The user-reported rejection was the broad programme-policies category; no account evidence identifies Google's specific reason. No violation or rejection cause is invented here.

## Evidence and current production comparison

Evidence files: `adsense-local-inventory-results.json`, `adsense-production-results.json`, `adsense-live-browser-results.json`, `final-ad-observation-results.json`, `final-legacy-live-results.json`, `browser-results.json`, `raw-html-results.json`, `legacy-exclusion-results.json`. Earlier audits and implementation reports are historical baselines, not current live-state proof.

- Local inventory: 16 published articles, 16 unpublished records excluded from generation; 24 sitemap routes. All current bodies, metadata and earlier correction chains were assessed against existing authorization/preservation records.
- Production HTTP audit: 84 requested endpoints, 37 discovered resources and 43 distinct public article source URLs. After network access was available, no site request errors or unexpected discovered-resource failures occurred. Source availability is distinct from source support for each claim.
- Six production article bodies differ from local: **3, 9, 21, 22, 24, 32**. The new examples, current Ligue 1 corrections and Article 32 archive presentation have not reached those live bodies. Live Article 32 still lacks the approved archive presentation; this is deployment lag, not a request to rewrite it.
- Local Standings has approved source labels and refresh/error protections; the production page remains older. Check it after any authorized release.
- All **19 approved legacy exclusions** still return HTTP 200 on production. Locally they return 404 under the deployment model and originals remain intact. The exclusions await deployment; no production exclusion is claimed.
- Production robots and ads.txt return 200 and match the intended public content. Canonicals point to HTTPS www clean URLs. Legacy merged IDs 8/20/25 resolve through redirect chains to 10/12/14. Internal source/draft/unknown routes are excluded under the checked routing.
- Production sitemap includes 24 routes but older revision timestamps for affected articles. The local regenerated sitemap reflects the approved revisions.
- Live `/api/matches` and `/api/standings?league=PL` returned HTTP 200 with data during the point-in-time check. No credentials or provider settings were inspected or changed.
- Two historical Article 24 sources returned direct HTTP 500: `https://ligue1.com/en/articles/l1_article_93-` and `https://ligue1.com/en/articles/l1_article_5074-`. Cached browser-search retrievals can still expose content, so this is a verified point-in-time link reliability problem, not proof that the historical text is false. Current LFP sources are available. Retain citations pending an owner-approved source repair; do not silently delete them.
- Live Chromium: 25 routes at 1440 and 360px (50 observations); no navigation errors, horizontal overflow or page exceptions. Only broken-image report was Home's invisible `matchModalHomeLogo` with empty `src`; no visible active image failed. This low-priority hidden utility detail does not establish a broken editorial image.
- Local browser: all 16 articles, no-JavaScript article/News presentation, mobile/theme/navigation, API empty/error/unsupported/loading states, delayed refresh provenance and disabled Watch verified. Screenshots: `C:\Users\user\AppData\Local\Temp\tv96-editorial-nP5fyq`.

Initial sandbox HTTP requests failed before receiving responses, and the first sandbox live-browser run timed out at CDP initialization. Authorized read-only network/browser reruns completed. Those initial failures were environment limitations, not site defects. No approval review rejection occurred.

## Prioritized findings

| ID | Severity | Classification | Evidence and action |
|---|---|---|---|
| C0 | Critical | None confirmed | No critical policy violation was established from available evidence. |
| R1 | High | Confirmed unresolved rights evidence | Article 32 uses a real-photo-derived AI edit; original photo was downloaded through Google Images and no licence established. Preserve image/content; owner must establish publication rights or authorize a separate remedy. |
| R2 | High | Owner verification required | Certified CMP account configuration and applicable EEA/UK/Swiss behavior remain unverified. Local/source/global absence cannot resolve this. Complete the manual matrix below. |
| R3 | High | Verified release lag | Six approved article changes, Standings disclosure and 19 asset exclusions remain absent from production. Deliver only after separate deployment authorization and recheck live behavior. |
| R4 | High | Potential inventory/placement risk, not observed violation | Empty/error API pages may offer little standalone value if monetized; verify Auto Ads exclusion/layout behavior. No visible ad creative was demonstrated in the probe. |
| R5 | Medium | Verified source reliability issue | Two historical Ligue 1 links returned HTTP 500 directly. Propose a specific verified replacement or contextual label repair before changing citations. |
| R6 | Medium | Content-quality improvement | Home's “large platform/latest transfer market news” copy exceeds demonstrated current scope. Exact revised text is proposed, not applied. |
| R7 | Medium | Content-quality improvement | Article 23 lacks a real worked play-off case. Exact historical example below adds distinctive reader value. |
| R8 | Medium | Rights/branding risk requiring evidence | Active illustration metadata says reviewed, but all 15 active image records still require branding review. Provenance records and hashes do not establish licences. |
| R9 | Medium | Content-value opportunity | Articles 18/19 can benefit from completed safety/qualification examples; guides 21–24 contain interchangeable tactical advice. Do not increase volume merely to meet an invented word/article threshold. |
| R10 | Low | Verified date mismatch | About's displayed August update label predates its later transparency additions. Correct only with approved content implementation using the real date. |
| R11 | Low | Verified minor repetition | One exact repeated source-support sentence in Articles 13/19; no duplicated complete article bodies established. Consolidation is optional, not a proven policy problem. |
| R12 | Low | Verified hidden-element detail | Home hidden modal image has empty source. Visible images pass; no public repair performed in this audit. |
| R13 | Low | Owner decision required | External TikTok highlights/cadence, mailbox monitoring and organizational responsibility cannot be proved from links. Do not invent staff or credentials. |

## Important pages and standalone value

Home: static generated Featured links remain when match APIs fail; lower site-purpose paragraph is generic/overpromising; no-JavaScript match shell remains a loading message, so propose a static limitation/help paragraph. News: all 16 cards in raw HTML, categories and pagination add discovery; archived labels are accurate locally but not all live. Matches: EAT dates, coverage explanation and contextual guide links add value beyond provider scores; failure/empty messages distinguish unavailable data from no football globally. Standings: glossary, caveats and guide links add educational context; local provenance allowlist accurately separates provider/calculated/unavailable; calculations are explicitly provisional. About: organizational byline, sourcing/corrections text and contact are visible; accurate current service list/date improve clarity. Contact: useful corrections and rights channels, no fictitious form; inbox functionality is owner-only. Privacy: discloses AdSense, analytics, hosting, provider media, browser storage and contact, but exact settings and conditional media disclosures need owner/legal verification; no legal edits proposed. Terms: relevant availability/third-party/IP disclosures and contact; legal sufficiency not established. Watch: disabled/unavailable, noindex, useful navigation rather than a functioning stream. Offline: noindex reconnect utility; current local file has no AdSense loader. Earlier reports suggesting existing offline ads should not be treated as current evidence.

API pages have some original context, but the underlying fixtures/tables remain provider data. Explanatory text and links add value; they do not guarantee Google considers every empty state sufficiently valuable. No source plagiarism conclusion or minimum-word policy is asserted.

## Image rights and deployment assets

Active image register is appended below with exact source paths; each registered PNG has corresponding WebP delivery recorded in `optimized-images.json`. Public article/News/Home/OG/JSON-LD use the delivery asset; metadata source paths are internal. Hash checks establish consistent bytes/optimization, not ownership or licence.

Article 3 has no editorial photograph; its generic shared fallback is recorded as local geometric artwork. Most other images are recorded as generated/original editorial illustrations, but supporting generation inputs/ownership and recognizable logos/trophies still require review. Article 32 is specifically user-provided photo-derived material, not independent AI-original or rights-cleared. It is used by Article 32, Home/News and article social/schema metadata. No image changed.

Shared `logo/Logo.png`, app icons/favicon and remote team/competition crests require publication/branding evidence too. Club/competition logos are identifiable third-party marks; provider access does not independently establish republication terms. The detailed rights checklist remains `ADSENSE_RIGHTS_EVIDENCE_INVENTORY.md`; its historical live statuses are dated evidence.

The 19 exact `.vercelignore` paths include two Getty-named files; local originals are retained and no licence has been established. Their current production exposure is confirmed in `final-legacy-live-results.json`. Additional unexcluded assets from the historical inventory (for example `banner/banner2026.png`, `banner/hero1.png`, `icon football/*`, `teams/*`, retired article illustrations and `logo` composites) remain deployable candidates requiring a fresh usage/provenance decision. They are not automatically covered by the 19 exclusions and no new exclusions/deletions are authorized here.

Closure evidence for each active or proposed-public asset: exact source creator/agency and original URL, licence or ownership record, permitted web/commercial use, modification/AI-edit permissions where relevant, required attribution, recognizable branding/people review and owner decision. A credit, Google Images download or AI transformation is not that evidence. Unresolved permissions are not by themselves a legal finding of infringement.

## Consent and account manual checklist

Local AdSense loaders use `ca-pub-9924964891667864`; ads.txt uses `pub-9924964891667864`, DIRECT and Google's expected certification authority ID. This public consistency does not verify ownership or account authorization. The verification HTML file returned 200; account acceptance of verification remains owner-only.

No local custom CMP/TCF implementation was identified. Live fresh-profile probes lacked `__tcfapi`/`googlefc`, but location was not region-emulated and delivery was time-limited. This proves neither compliance nor absence of remote messaging. AdSense can serve account-configured messaging remotely. [Google certified CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en) specify certified TCF-integrated CMPs for personalized ads to applicable EEA/UK/Swiss users; certification is not comprehensive legal clearance.

Owner actions, in order:

1. **Sites:** sign into the correct publisher account; record exact domain, ownership/verification result, approval/rejection status and date. Check www/apex coverage. Do not submit re-review yet.
2. **Policy Center:** record exact policy/regulatory labels, affected URLs, serving limits and available actions, with private details redacted. Broad email wording cannot reveal Google's exact reason.
3. **Privacy & Messaging:** inspect existing European-regulations messages before creating one. Record Draft/Published status, target domain, certified web CMP identity, geography/languages, privacy URL, purposes/vendors, refusal/manage-options and withdrawal access. Verify current certification/TCF integration; do not add a second competing or unapproved custom CMP.
4. **Regional matrix:** use actual EEA, UK and Swiss test connections, separately, with clean storage. Test first visit, refusal, accept, customized choices, returning visit and withdrawal/reset on Home, News, an article, Matches and Standings, desktop/mobile. Record location/date, UI, CMP identity, actual TCF event/signal state and relevant storage/network behavior. Check choices persist appropriately and withdrawal is accessible. Do not fabricate records or infer compliance from a missing global.
5. **ads.txt:** confirm account status recognizes the publicly served seller entry and correct publisher account; check crawler/last-seen warnings. HTTP 200 alone does not establish account recognition.
6. **Auto Ads:** inspect enabled formats, page/area exclusions, anchors/vignettes and ad-load settings in account preview and real regional devices. Check buttons/navigation, short archives, utility pages and empty/error API states. Approve any exclusions/configuration changes separately.
7. **Privacy/legal consistency:** owner reviews disclosures against actual providers, settings, consent choices and current streaming-disabled behavior. No legal language is changed here.

## Observed ads versus possible risks

An unmocked five-page probe at 1440/360px observed AdSense request/helper iframes on Home, Matches and Standings. All observed frames had zero dimensions; no visible ad frame or filled creative was demonstrated. Watch and Offline had no ad frames in those observations. Query/tracking parameters were removed from stored frame URLs; no ad clicks occurred. Evidence: `final-ad-observation-results.json`.

This cannot establish that ads never appear, or that all error states are excluded. Local failure tests mock external scripts and cannot assess real ad delivery. Possible risk: Auto Ads on transient loading/error/empty or very short utility screens, or ads obstructing navigation. Owner should verify actual configurations and populated placements before concluding compliance or changing settings.

[Google Publisher Policies](https://support.google.com/adsense/answer/10502938?hl=en) address low-value/absent publisher content, replication without added value, interference and intellectual property. These are comparison criteria, not proven violations attributed to TV96. General policy rejection must not be translated into a specific copyright, consent or low-value diagnosis without account evidence.

## Working-tree release review

Tracked pending changes group into approved article bodies/metadata and generated pages (3,9,21,22,24,32 plus related-card effects), approved Standings notice, Home archive/reading-time generation, 19 exact deployment exclusions, manifest streaming-description correction, updated preservation/browser/API guards and documentation/results. The manifest diff removes the live-HD-streaming promise; it does not enable media. `README` changes published count from 23 to 16. `api-smoke` changes tests only; API implementations remain protected. Article 32 changes in the pre-existing Git diff belong to the earlier approved archive work; this session did not change them.

Numerous untracked `.editorial` reports/evidence/scripts include unimplemented Article 32 image replacement patches. They are excluded from deployment and must not be mistaken for authorized implemented image changes. No unexplained public modification was identified after reconciling generated effects with the successive preservation guards. All public files matched the start-of-audit inventory hashes after this audit.

Audit reports and refreshed evidence are the only session changes. A temporary ad-observation result initially landed at the workspace root and was moved into excluded `.editorial` before completion; no public artifact remains. No deletion of originals occurred.

## Completed local regression checks

All passed: `generate-static.cjs --check`, `validate-content.cjs`, `p0-check.cjs`, `image-rights-check.cjs`, `article-24-tiebreak-check.cjs`, `article-24-revision-check.cjs`, `article-22-revision-check.cjs`, `article-21-revision-check.cjs`, `article-3-revision-check.cjs`, `article-9-revision-check.cjs`, `article-32-archive-check.cjs`, `standings-source-check.cjs`, `match-coverage-check.cjs`, `api-smoke.cjs`, `raw-html-check.cjs`, `legacy-exclusion-check.cjs`, `browser-check.cjs`, and `git diff --check` (per-command safecrlf warning suppression; configuration unchanged). No final regression failures.

Live HTTP/browser probes completed with the differences and limitations above; a zero exit is not a claim of deployment parity, licence clearance or AdSense approval. Source-link HTTP 500 findings remain unresolved. Production DOM observations and local deterministic regression tests answer different questions.

## Prioritized next actions and approvals

1. Owner establishes Article 32 publication rights and reviews other image/branding evidence; no image alteration is proposed or authorized.
2. Owner completes CMP/account/actual ad-layout verification. Keep re-review held.
3. Approve or revise the concrete Article 23 and Home/About proposals in CONSOLIDATED_APPROVAL_REQUEST.md, including narrow generated-card effects for Articles 9/21/24. No deployment approval is bundled into that request.
4. Prepare a separately reviewable repair for the two unreliable historical source links; preserve historical context/current LFP authority.
5. After any authorized implementation, rerun preservation/regressions; owner separately authorizes release of the reviewed patch bundle. Then verify live corrections, provenance, exclusion statuses, assets, sitemap and mobile/consent/ad behavior.
6. Only after owner evidence closes blockers, decide whether to submit the specific Sites/Policy Center action; no submission in this session.

Exact proposed text and the per-article and image inventory appendices follow. These proposals are not yet public content.

## Appendix A ? all 16 published article assessments

All use the organizational byline TV96 Live Editorial Team. These are content/claim-scope assessments, not independent re-reporting of every historical event. The 43-source HTTP check verifies availability only; exact rule/example checks are supported by the earlier implementation evidence and current targeted research. Full external fact/licensing review is not implied. Original dates, prior correction notices and authorization hashes pass existing guards.

### 3 ? How to Read World Cup Knockout Assist Statistics

684 words; exact sourced Netherlands?Argentina example separates FIFA assist credit, analysis and definitions. Earlier unsupported record claims remain removed. Stronger than the historical audit version; live is older. Preserve.

Evidence: `.editorial/article-content.js:5`, `.editorial/news-data.js:60`, `articles/3.html`. Publication: `2026-07-14T12:02:02+03:00`; latest metadata revision: `2026-10-12`. Existing sources:

- [FIFA: Netherlands–Argentina 2022 full-time match report (pages 2 and 5)](https://fdp.fifa.org/assetspublic/ce44/r2859/pdf/FullTimeMatchReport-English.pdf)
- [Opta Analyst: contemporary analysis of Messi’s pass to Molina](https://theanalyst.com/articles/lionel-messi-world-cup-stats-argentina-2022-final)
- [Stats Perform: Opta event definitions — Goal Assist and Fantasy Goal Assist](https://www.statsperform.com/opta-event-definitions/)
- [Further reading: TV96 Live expected goals explainer](https://www.tv96live.org/articles/16)

### 9 ? Reading a European Draw: Opponents, Travel and Fixture Context

742 words; sourced 2024/25 United Europa League draw/schedule/domestic-calendar example preserves timestamp limitations and earlier correction. Reader can reproduce the checklist; live is older. Preserve.

Evidence: `.editorial/article-content.js:11`, `.editorial/news-data.js:208`, `articles/9.html`. Publication: `2026-08-28T15:00:00+03:00`; latest metadata revision: `2026-10-12`. Existing sources:

- [UEFA: historical 2024/25 Europa League draw results (30 August 2024)](https://www.uefa.com/uefaeuropaleague/news/0290-1bbc3ce94923-e3a70688bbdd-1000--europa-league-league-phase-draw-contenders-set-for-competitions-new-era/)
- [UEFA: 2024/25 Europa League draw procedure and announced calendar-release date](https://www.uefa.com/uefaeuropaleague/news/028e-1b11797faef1-56c7d70b74aa-1000--uefa-europa-league-league-phase-draw/)
- [UEFA: published 2024/25 Europa League match calendar (PDF; no independently verified publication timestamp)](https://editorial.uefa.com/resources/0290-1bbea0181c18-c9285f327c80-1000/draw_results_-_uefa_-_uel_-_league_phase_draw_fixtures_by_matchday.pdf)
- [Manchester United: Tottenham coverage (29 September 2024)](https://www.manutd.com/en/news/erik-ten-hag-names-team-to-face-tottenham-on-29-september)
- [Manchester United: Aston Villa coverage (6 October 2024)](https://www.manutd.com/en/news/every-word-from-erik-ten-hag-press-conference-after-aston-villa-0-man-utd-0-on-6-october-2024)
- [Comparison reading: TV96 Live Champions League format explainer](https://www.tv96live.org/articles/14)
- [Comparison reading only: UEFA 2026/27 Champions League draw announcement; not evidence for the Europa League example](https://www.uefa.com/uefachampionsleague/news/02a8-215821715a96-9a3b43fad585-1000--uefa-champions-league-league-phase-draw/)

### 10 ? Álvarez in August 2026: Atlético's Statement and the Reported Meeting

324 words; short but focused archive distinguishes club statement from attributed private-meeting reporting and completed-transfer claims. Not automatically thin because of length. No present-day transfer claim is implied. Preserve chronology/correction.

Evidence: `.editorial/article-content.js:12`, `.editorial/news-data.js:246`, `articles/10.html`. Publication: `2026-08-28T15:30:00+03:00`; latest metadata revision: `2026-09-22`. Existing sources:

- [Atlético de Madrid](https://en.atleticodemadrid.com/noticias/unanimous-support-from-the-board-of-directors-for-the-club-s-strategy)
- [Cadena SER](https://cadenaser.com/nacional/2026/08/27/julian-alvarez-con-su-futuro-en-el-aire-ha-tenido-una-reunion-de-mas-de-cinco-horas-para-decidir-que-hacer-cadena-ser/)
- [Sky Sports](https://www.skysports.com/football/news/11095/13577751/julian-alvarez-transfer-news-atletico-madrid-wont-sell-striker-to-barcelona-with-arsenal-the-only-option)

### 12 ? How the Premier League Works: Complete Guide

881 words; useful fixture/points/game-in-hand examples and clear general Premier League framework. Further consequential-tie criteria summarized, not false; season-specific source coverage can be strengthened. Links distinguish beginner, survival and Europe purposes.

Evidence: `.editorial/article-content.js:14`, `.editorial/news-data.js:310`, `articles/12.html`. Publication: `2026-09-05T12:00:00+03:00`; latest metadata revision: `2026-09-22`. Existing sources:

- [Premier League: competition explained](https://www.premierleague.com/en/premier-league-explained)
- [Premier League: relegation and tiebreakers](https://www.premierleague.com/en/news/4657245/202526-premier-league-relegation-faq)
- [Premier League: European qualification routes](https://www.premierleague.com/en/news/373663)

### 13 ? How Champions League Qualification Works

823 words; exact UEFA 2026/27 Article 3/Annex A citations and conditional entry-stage distinction. Original explanatory value; a completed access-list example could reduce abstraction. Shared one-sentence citation bridge with Article 19 is minor repetition.

Evidence: `.editorial/article-content.js:15`, `.editorial/news-data.js:345`, `articles/13.html`. Publication: `2026-09-05T12:00:00+03:00`; latest metadata revision: `2026-09-22`. Existing sources:

- [UEFA: Champions League format and access](https://www.uefa.com/news-media/news/0268-12157d69ce2d-9f011c70f6fa-1000--how-clubs-qualify-for-europe/)
- [UEFA: European Performance Spots](https://www.uefa.com/uefachampionsleague/news/02a2-1fdbe9a25733-8d37ff5f9226-1000--202627-uefa-champions-league-which-teams-are-in-the-european-performance-spots-as-it-stands/)
- [UEFA 2026/27: Article 3 - entries, title holders and performance spots](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-3-Entries-for-the-competition-Online?contentId=EgXhqnzQsuW60mwbyCqWtw)
- [UEFA 2026/27: Annex A - access list](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Annex-A-Access-List-for-the-2026/27-UEFA-Club-Competitions-Online?contentId=aLaDNKItLtBltlOvVMG_jw)

### 14 ? Champions League Format Explained

951 words; UEFA 2026/27 format/ranking/knockout citations and aggregate examples. Useful distinction between match and aggregate scores. Does not fully enumerate draw/bracket exceptions; consult primary rules for particular scenarios, rather than inventing fixed pairings.

Evidence: `.editorial/article-content.js:16`, `.editorial/news-data.js:383`, `articles/14.html`. Publication: `2026-09-05T12:00:00+03:00`; latest metadata revision: `2026-09-22`. Existing sources:

- [UEFA: Champions League format and access](https://www.uefa.com/news-media/news/0268-12157d69ce2d-9f011c70f6fa-1000--how-clubs-qualify-for-europe/)
- [UEFA 2026/27: Article 17 - league phase and progression](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-17-Match-system-league-phase-Online?contentId=z80npkZwtB5MkmwVqnk6XA)
- [UEFA 2026/27: Article 18 - league-phase tiebreakers](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-18-Equality-of-points-league-phase-Online?contentId=d~m2tmtG82UhZujMH0i~aQ)
- [UEFA 2026/27: Article 20 - two legs and aggregate score](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-20-Match-system-knockout-phase-Online?contentId=5j1kwD2WHBsLErtGHWuxOA)
- [UEFA 2026/27: Article 21 - extra time and penalties](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-21-Knockout-system-extra-time-and-penalty-shoot-outs-Online?contentId=aBOyMYjtgYYIYwn~YRHF5Q)
- [UEFA 2026/27: Article 22 - the final](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-22-Match-system-final-Online?contentId=p6pndZ3IAsUzrTVR64sVPw)

### 15 ? What Is Goal Difference in Football?

782 words; reproducible signed GD and gap-swing calculations, points priority and interpretation limitations. Generic statistical subject has clear distinct educational purpose. Dated PL/Italian references should not be treated as universal rankings.

Evidence: `.editorial/article-content.js:17`, `.editorial/news-data.js:430`, `articles/15.html`. Publication: `2026-09-05T12:00:00+03:00`; latest metadata revision: `not recorded`. Existing sources:

- [Premier League: competition explained](https://www.premierleague.com/en/premier-league-explained)
- [Premier League: relegation and tiebreakers](https://www.premierleague.com/en/news/4657245/202526-premier-league-relegation-faq)
- [Lega Serie A: relegation play-off context](https://en.legaseriea.it/serie-a/news/the-final-reckoning-lecce-and-cremonese-face-a-decisive-final-day)

### 16 ? What Is Expected Goals (xG)?

823 words; clear xG probability/summation examples and provider/model limitations. Identifies no on-site xG feed; avoids rewriting results. One provider methodology source; real sourced shot case is an optional depth improvement.

Evidence: `.editorial/article-content.js:18`, `.editorial/news-data.js:463`, `articles/16.html`. Publication: `2026-09-05T12:00:00+03:00`; latest metadata revision: `not recorded`. Existing sources:

- [Hudl Statsbomb: expected goals methodology](https://statsbomb.com/soccer-metrics/expected-goals-xg-explained/)

### 17 ? How VAR Works in Football

839 words; IFAB 2026/27 source expressly includes clearly incorrect second caution and optional immediate corner correction, confirmed in this audit. Distinguishes check/review/final decision. Example remains hypothetical; no unsupported universal VAR availability.

Evidence: `.editorial/article-content.js:19`, `.editorial/news-data.js:489`, `articles/17.html`. Publication: `2026-09-05T12:00:00+03:00`; latest metadata revision: `not recorded`. Existing sources:

- [IFAB: VAR protocol (2026/27)](https://www.theifab.com/laws/latest/video-assistant-referee-var-protocol/)
- [IFAB: latest law changes](https://theifab.com/law-changes/latest/)

### 18 ? Premier League Relegation Explained

841 words; survival boundaries, realistic caution about mathematical safety and invented points examples. No obsolete fixed Championship playoff field reinstated. EFL exact announcement-body verification remains a limitation; a completed safety example would add value.

Evidence: `.editorial/article-content.js:20`, `.editorial/news-data.js:519`, `articles/18.html`. Publication: `2026-09-05T12:00:00+03:00`; latest metadata revision: `2026-09-22`. Existing sources:

- [Premier League: relegation and tiebreakers](https://www.premierleague.com/en/news/4657245/202526-premier-league-relegation-faq)
- [Premier League: competition explained](https://www.premierleague.com/en/premier-league-explained)
- [EFL: Championship play-off format change](https://www.efl.com/news/2026/march/05/efl-statement--sky-bet-championship-play-off-format/)

### 19 ? How European Qualification Works in the Premier League

904 words; separates league/cup/EPS/title-holder routes with current UEFA regulatory citations and conditional language. Useful checklist but no completed allocation case. Older PL explainer does not establish every current allocation; preserve sources and seek specific case approval.

Evidence: `.editorial/article-content.js:21`, `.editorial/news-data.js:553`, `articles/19.html`. Publication: `2026-09-05T12:00:00+03:00`; latest metadata revision: `2026-09-22`. Existing sources:

- [Premier League: European qualification routes](https://www.premierleague.com/en/news/373663)
- [UEFA: European Performance Spots](https://www.uefa.com/uefachampionsleague/news/02a2-1fdbe9a25733-8d37ff5f9226-1000--202627-uefa-champions-league-which-teams-are-in-the-european-performance-spots-as-it-stands/)
- [UEFA 2026/27: Article 3 - entries, title holders and performance spots](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-3-Entries-for-the-competition-Online?contentId=EgXhqnzQsuW60mwbyCqWtw)
- [UEFA 2026/27: Annex A - access list](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Annex-A-Access-List-for-the-2026/27-UEFA-Club-Competitions-Online?contentId=aLaDNKItLtBltlOvVMG_jw)

### 21 ? La Liga Guide

1083 words; approved RFEF final-table order and hypothetical worked tiebreak preserved, including final-vs-interim caution and documented circular season discrepancy. No new change proposed except optional Article 23 card-label permission. Live body older.

Evidence: `.editorial/article-content.js:23`, `.editorial/news-data.js:622`, `articles/21.html`. Publication: `2026-09-05T12:00:00+03:00`; latest metadata revision: `2026-10-13`. Existing sources:

- [RFEF: 2026/27 Primera and Segunda Division competition regulations - Article 10, pages 6-7](https://rfef.es/sites/default/files/pdf/circulares/1._Circular_84_-_CNL_Primera_y_Segunda_Division___Anexo.pdf?cb=6df81e55)
- [LALIGA: official standings and competition information](https://www.laliga.com/en-GB/laliga-easports/standing)

### 22 ? Serie A Guide

1168 words; approved FIGC 244/A example distinguishes hosting from survival and includes UEFA-finalist exception. Historical source label explicitly separates 2025/26. Existing historical source extra-time conflict is not imported into current procedure. Preserve; live older.

Evidence: `.editorial/article-content.js:24`, `.editorial/news-data.js:650`, `articles/22.html`. Publication: `2026-09-05T12:00:00+03:00`; latest metadata revision: `2026-10-13`. Existing sources:

- [FIGC: 2026/27 regulation 244/A — championship and survival ties, mini-table criteria and UEFA-finalist exception, clauses i–iv](https://files.figc.it/version/c%3AZmUzYzk0MzUtMzU0Zi00%3AYTk3YzZiZGEtYmExYi00/244%20-%20Deroga%20art.%2051%20NOIF%20-%20Determinazione%20classifica%20Campionato%20Serie%20A%20ss%202026%20-%202027.pdf)
- [Historical context: Lega Serie A — 2025/26 Lecce–Cremonese survival scenario; not authority for the 2026/27 procedure](https://en.legaseriea.it/serie-a/news/the-final-reckoning-lecce-and-cremonese-face-a-decisive-final-day)
- [Lega Serie A: the first unified championship](https://www.legaseriea.it/serie-a/news/96-anni-fa-l-inter-vinceva-il-primo-scudetto-a-girone-unico)

### 23 ? Bundesliga Guide

814 words; useful league-size arithmetic and relegation boundaries, but generic pressing advice lacks a sourced case. Exact historical Bochum example proposed. Both primary sources remain; original date preserved. No unsupported current-season schedule proposed.

Evidence: `.editorial/article-content.js:25`, `.editorial/news-data.js:682`, `articles/23.html`. Publication: `2026-09-05T12:00:00+03:00`; latest metadata revision: `not recorded`. Existing sources:

- [Bundesliga: promotion and relegation](https://www.bundesliga.com/en/bundesliga/news/how-does-promotion-and-relegation-work-in-the-bundesliga-10645)
- [Bundesliga: competition FAQ](https://www.bundesliga.com/en/faq/10-things-on-the-bundesliga)

### 24 ? Ligue 1 Guide

1205 words; approved LFP promotion/relegation correction and tiebreak calculation, first revision and appended note preserved. Exact unfinished-season condition distinguishes France. Two historical links intermittently fail directly; current rulebook supports current procedures. Preserve; live older.

Evidence: `.editorial/article-content.js:26`, `.editorial/news-data.js:712`, `articles/24.html`. Publication: `2026-09-05T12:00:00+03:00`; latest metadata revision: `2026-10-13`. Existing sources:

- [LFP: 2026/27 regulations — Article 519 (promotion/relegation), Article 519 ter (playoff format)](https://www.lfp.fr/assets/26_27_LFP_STATUTS_REGLEMENTS_08_09_2026_f2aaaaa325.pdf)
- [LFP: official 2026/27 Ligue 2 calendar and playoff pathway](https://www.lfp.fr/article/ligue-2-bkt-le-calendrier-de-la-saison-2026-2027)
- [Historical context (2024): Ligue 1 survival and relegation positions](https://ligue1.com/en/articles/l1_article_93-)
- [Historical context (11 May 2026, 2025/26 season): Ligue 2 play-off route](https://ligue1.com/en/articles/l1_article_5074-)
- [LFP: 2026/27 regulations — Article 518 ter, printed page 121: tiebreaking order and head-to-head applicability.](https://www.lfp.fr/assets/26_27_LFP_STATUTS_REGLEMENTS_08_09_2026_f2aaaaa325.pdf)

### 32 ? JJ Gabriel, 15, Asks to Leave Manchester United as Club Fight to Keep Highly Rated Prospect

956 words; locally explicit archive notice preserves original headline/date/body and current-age clarification. Distinguishes attributed request from confirmed transfer. Live older presentation remains a release defect; underlying real-photo-derived image rights unresolved. Frozen, no change proposed.

Evidence: `.editorial/article-content.js:28`, `.editorial/news-data.js:836`, `articles/32.html`. Publication: `2026-09-15T20:00:00+03:00`; latest metadata revision: `2026-10-11`. Existing sources:

- [BBC Sport: JJ Gabriel asks to leave Manchester United](https://www.bbc.co.uk/sport/football/articles/c95y4dxr0v6do)
- [Manchester Evening News: JJ Gabriel and Ryan Giggs context](https://www.manchestereveningnews.co.uk/sport/football/football-news/man-utd-jj-gabriel-carrick-34607865)

## Appendix B ? active editorial image paths and evidence limits

| Article | Source path (WebP delivery has the same basename) | Current recorded provenance | Remaining evidence |
|---|---|---|---|
| 3 | `No article image; shared geometric fallback` | Original TV96 Live text and geometric artwork | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 9 | `/images/articles/reading-european-draw.png` | AI-generated editorial illustration for TV96 Live | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 10 | `/images/articles/alvarez-meeting-report.png` | AI-generated editorial illustration for TV96 Live | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 12 | `/images/articles/premier-league-guide.png` | AI-generated editorial artwork for TV96 Live | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 13 | `/images/articles/champions-league-qualification.png` | AI-generated editorial artwork for TV96 Live | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 14 | `/images/articles/champions-league-format.png` | Original TV96 Live text and geometric artwork | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 15 | `/images/articles/goal-difference-football.png` | AI-generated editorial artwork for TV96 Live | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 16 | `/images/articles/expected-goals-xg.png` | AI-generated editorial artwork for TV96 Live | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 17 | `/images/articles/how-var-works.png` | AI-generated editorial artwork for TV96 Live | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 18 | `/images/articles/premier-league-relegation.png` | AI-generated editorial artwork for TV96 Live | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 19 | `/images/articles/premier-league-european-qualification.png` | AI-generated editorial artwork for TV96 Live | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 21 | `/images/articles/la-liga-guide.png` | AI-generated editorial artwork for TV96 Live | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 22 | `/images/articles/serie-a-guide.png` | AI-generated editorial artwork for TV96 Live | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 23 | `/images/articles/bundesliga-guide.png` | AI-generated editorial artwork for TV96 Live | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 24 | `/images/articles/ligue-1-guide.png` | AI-generated editorial artwork for TV96 Live | Metadata/hash integrity checked; generation inputs, ownership and branding permissions not independently cleared. |
| 32 | `/images/articles/jj-gabriel.png` | Image supplied by the TV96 Live publisher | Original photograph licence unestablished; owner confirms AI-edited Google Images download. |

## Appendix C ? exact proposed Article 23 text


After all three existing paragraphs under `The relegation play-off`, immediately before `Why the run-in has several boundaries`. New H3:

### Historical worked example: Bochum–Fortuna Düsseldorf, 2024

On 23 May 2024, VfL Bochum lost the first leg 0–3 to Fortuna Düsseldorf at the Vonovia Ruhrstadion in Bochum. The return took place on 27 May at the Merkur Spielarena in Düsseldorf. These dates belong to the 2023/24 promotion/relegation play-off, not the current season. [Official fixtures](https://www.bundesliga.com/en/2bundesliga/matchday/2023-2024/relegation), [first-leg match centre](https://www.bundesliga.com/en/bundesliga/matchday/2023-2024/relegation/vfl-bochum-1848-vs-fortuna-duesseldorf/liveticker), [return match centre](https://www.bundesliga.com/en/bundesliga/matchday/2023-2024/relegation/fortuna-duesseldorf-vs-vfl-bochum-1848/liveticker).

Bochum led the return 3–0 after normal time. Adding the two matches gave Bochum 0 + 3 = 3 goals and Düsseldorf 3 + 0 = 3: a 3–3 aggregate tie. Two 15-minute periods of extra time produced no further goal, so the tie went to penalties. [Official match report](https://www.bundesliga.com/en/bundesliga/news/bochum-fortuna-dusseldorf-relegation-play-off-free-highlights-live-blog-27447/), [play-off procedure](https://www.bundesliga.com/en/bundesliga/news/how-does-promotion-and-relegation-work-in-the-bundesliga-10645).

Bochum won the shoot-out 6–5 and retained its Bundesliga place for 2024/25. The shoot-out score is separate from the return's 3–0 match score and the 3–3 aggregate. Do not add those penalties to either club's goals in the two matches. [Official match report](https://www.bundesliga.com/en/bundesliga/news/bochum-fortuna-dusseldorf-relegation-play-off-free-highlights-live-blog-27447/).

The Bundesliga's play-off explanation dates removal of the away-goals rule to 2021/22, before this tie. A tied aggregate therefore required the remaining procedure rather than an away-goals decision. This is a historical example of why the match score, aggregate and shoot-out result answer different questions. [Away-goals and extra-time explanation](https://www.bundesliga.com/en/bundesliga/news/how-does-promotion-and-relegation-work-in-the-bundesliga-10645).


## Appendix D ? exact proposed Home/About text


H1 — Replace only the `index.html:181` paragraph under `About Us - TV96 Live`:

“TV96 Live brings together football fixtures, scores, standings and explanatory guides. Read worked examples of competition rules, compare results with table context, and explore clearly dated reporting in our News & Guides library. Match data can be delayed or unavailable.”

Link “fixtures, scores” to `/matches`, “standings” to `/standings` and “News & Guides library” to `/news`.

H2 — Add immediately after that paragraph:

“Start with our Premier League guide, learn how goal difference works, or compare the different survival routes in our league guides.”

Link “Premier League guide” to `/articles/12`, “how goal difference works” to `/articles/15` and “league guides” to `/news`.

H3 — Insert a static paragraph beneath the Today's Matches introductory copy, outside the JavaScript-replaced results container:

“Match lists need JavaScript and an available data feed. If they do not load, read the News & Guides library or check the competition’s official fixtures.”

Link “News & Guides library” to `/news`. This makes the limitation readable without JavaScript and does not replace loading/empty/error states.

H4 — Optional, owner-confirmed replacement of the TikTok invitation only:

“Follow TV96 Live on TikTok.”

Preserve its existing URL and button. No message will be sent to the channel.

## Exact proposed About changes

A1 — Replace only `What We Cover` introduction and list:

“TV96 Live currently provides:”

- “Fixtures, results and score updates for competitions available through our data provider.”
- “League standings with explanations of points, ranking and qualification rules.”
- “Original football explainers with worked examples and links to supporting sources.”
- “Dated reporting archives that identify the sources and period covered.”

Retain the existing availability/update caveat beneath the list.

A2 — Replace only the first provider paragraph under `Our Editorial Approach`:

“Fixtures, scores and standings use football-data.org through TV96 Live’s server-side API routes. The Standings page labels provider data and calculations from available results when source metadata is supplied; otherwise, it states that the data source is unavailable.”

Link “Standings page” to `/standings`. This wording describes the approved local UI; it must ship with that UI rather than ahead of it. It does not name an API as an official league authority or assert provider licensing.

A3 — Replace `Updated August 2026` with “Updated [actual implementation date]”. Retain the existing substantive transparency/corrections paragraphs and organizational byline. No new claim about editorial processes is proposed.



## Resumption completion record ? 17 October 2026

The four requested files were present at resumption. ARTICLE_23_BUNDESLIGA_PROPOSAL.md and HOME_ABOUT_CONTENT_AUDIT.md were substantively complete, including exact copy, insertion/replacement locations, metadata dependencies and preservation requirements; both are retained without alteration. This final audit and CONSOLIDATED_APPROVAL_REQUEST.md also contained their substantive sections; the missing resumption status, targeted-test disposition and current-session change record are supplied here and in the existing single approval request. No additional approval-request file is created.

Existing research, production probes, 25-route/50-observation browser review and completed regression suites were not repeated. Their October evidence is historical, not a claim of production state on 17 October. The six older live article bodies (3, 9, 21, 22, 24, 32), 19 publicly reachable legacy exclusions, Home overstatement, outdated About label, ad-probe limitations, unverified regional CMP behavior and two historical Ligue 1 citation HTTP 500 responses remain unresolved findings. No new critical violation is confirmed.

### Previously blocked targeted follow-up: environment limitation

Inspection of adsense-targeted-followup-results.json found 116 request records with fetch errors (checkedAt 2026-10-13T00:14:25.932Z), rather than successful HTTP observations. The older ADSENSE_FINAL_ACTION_PLAN.md statement that all 111 asset URLs returned 200 with matching bytes is not substantiated by this currently saved targeted JSON. Do not use that statement as verified evidence of all-asset availability or identity. This does not invalidate the separate final-legacy-live-results.json findings for the 19 exclusions, or prove any asset is unavailable.

A single safe read-only environment check requested https://www.tv96live.org/banner/banner1.jpg on 17 October 2026. Node fetch failed with cause EACCES before any HTTP response. The blocked full targeted follow-up was therefore not repeated; no successful website test, HTTP failure status or asset mismatch is inferred. No approval escalation was attempted and no automatic approval rejection occurred in this resumption. Existing JSON and rights inventory were preserved. Completing this follow-up requires an environment with permitted public network access; it is an outstanding verification limitation, not a failed website test. A later authorized run should preserve the old evidence and record new observations separately.

### Release and re-review gates at resumption

An unrestricted release represented as AdSense-ready remains blocked by unresolved rights evidence and owner verification. The prior report's technically-ready assessment of the approved local patch bundle is retained as the result of its completed checks; it was not re-tested in this report-only session. Any deployment still requires separate owner authorization, review of the exact release scope and post-deployment confirmation of the six article bodies, Standings labels, 19 exclusions and sitemap. Article 23 and Home/About remain unimplemented proposals.

AdSense re-review remains held pending rights/branding decisions (especially Article 32), account/Policy Center evidence, certified CMP configuration and actual EEA/UK/Swiss consent behavior, actual ad placement/exclusions including empty/error states, delivery and live verification of approved fixes, and owner decisions on the content proposals and historical citation repair. The blocked asset follow-up adds an evidence limitation; it is not a proven policy violation. Account and regional evidence cannot be replaced by local tests.

### Files changed in this resumption

Only FINAL_ADSENSE_READINESS_AUDIT.md and CONSOLIDATED_APPROVAL_REQUEST.md were appended. Article 23 and Home/About reports are complete and unchanged. All pre-existing working-tree modifications remain attributable to earlier work. No website content, images, APIs, generated public output or stored test evidence was changed; no commit, push, deployment or review submission occurred. Report completeness does not mean owner-side verification is complete.
