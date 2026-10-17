# AdSense implementation follow-up

11 October 2026, Africa/Nairobi. Branch `adsense-readiness-2026-10-11`. This follows the full readiness audit and final action plan; it does not replace their historical evidence. The latest instruction supersedes prior Article 32 replacement approvals: **Article 32's image, central metadata, archive notice, headline, dates, trusted body and URL were not modified.** Its ChatGPT-edited, Google-Images-sourced photographic derivative still has no established underlying licence and remains an outstanding AdSense-readiness blocker.

## Implemented: exactly 19 legacy exclusions

`.vercelignore` now excludes the following exact paths, retaining `.editorial/`. All original files remain locally with unchanged SHA-256 hashes. No entire image or banner directory was excluded, and neither `jj-gabriel.png` nor `jj-gabriel.webp` is excluded/replaced.

```text
news image/1.jpg
news image/10.png
news image/11.png
news image/2.jpeg
news image/3.jpg
news image/4.jpg
news image/5.jpg
news image/6.webp
news image/7.webp
news image/8.png
news image/9.png
news image/GettyImages-2166876546-2-scaled.jpg
news image/GettyImages-2262861156.jpg.webp
news image/fergusan.jpg
news image/images.jpg
banner/banner.jpg
banner/banner1.jpg
banner/hero.jpg
banner/omar.jpg
```

The fresh reference scan covered 49 public HTML/generated, CSS, JavaScript, JSON/data, XML and SVG/text files, checking URL-decoded paths, escaped slash/space variants, exact filenames and directory fragments that could participate in dynamic construction. Provider URLs such as API-Sports `/leagues/10.png` are distinct external assets, not local `news image/10.png`; those basename collisions were examined and excluded from local-use findings. No deployed code builds a path under `news image/` or references the four proposed banner names. Private suppressed image candidates and historical audit references remain in excluded `.editorial/`. Home/News's dynamic renderers use published metadata; the football API returns provider crests/emblems, not these legacy image paths.

`legacy-exclusion-check.cjs` verifies the exact 19-rule allowlist, preservation of every preexisting public file except the intentionally edited ignore file, all 19 local originals, Article 32's complete metadata/body and both image bytes. The existing local production-style server reads `.vercelignore`: all 19 excluded URL-encoded image paths return 404 and **22 detected active local image URLs** return 200, including Article 32, site branding, article images, CSS image URLs, manifest icons and the retained Watch poster. Browser/raw HTML checks additionally verify current rendered routes and assets. No active local image was broken by the exclusions.

This confirms local configuration/test behavior, not production removal. No deployment occurred; existing production/old deployment/cache copies may remain reachable. Authorized preview/production verification is still required before claiming exclusion is live. The filename/agency metadata and preserved hashes do not demonstrate licences for the old files.

## Consent and CMP

The existing AdSense loader remains unchanged on Home, News, Matches, Standings, About, Privacy and each of 16 articles. No local `__tcfapi`, Google messaging/Funding Choices integration or custom CMP implementation was found. That absence does not establish what the account remotely injects, or compliance/noncompliance in an unspecified region. Remote CMP publication, actual choices and real consent signals **were not verified**. Local tests mock external advertising scripts. No consent records or TCF signals were fabricated; no banner/CMP or legal wording was changed.

Owner steps in **AdSense → Privacy & messaging → European regulations**:

1. Inspect existing messages before adding another: selected domain/site, Draft/Published status, geography, languages, privacy URL, refusal/manage/accept choices, purposes, vendors and withdrawal controls. Identify any externally managed CMP to avoid duplicate conflicting integrations.
2. Confirm a currently Google-certified **web** CMP and TCF integration for applicable personalized-ad traffic in the EEA, UK and Switzerland. Google documents this requirement for personalized ads; eligibility for nonpersonalized/limited ads does not automatically remove storage/processing consent obligations or prove legal compliance. [Google's CMP requirement and certified list](https://support.google.com/adsense/answer/13554116?hl=en-GB).
3. Configure actual `tv96live.org` / canonical `www.tv96live.org` coverage, applicable EEA/UK/Swiss geography, appropriate languages, real partner choices and the accurate privacy URL. Use current provider-supported TCF settings; check Additional Consent if applicable. Obtain owner/legal review for disclosure mismatches rather than changing the privacy text here. [European message documentation](https://support.google.com/adsense/answer/10961068?hl=en).
4. Owner must publish the intended message and verify accessible refusal, granular management, saved choices and persistent withdrawal/reopen behavior. Test fresh sessions before decision, refusal, acceptance, reload and withdrawal using documented EEA, UK and Swiss regional exits/testers. Record dates, region evidence, real CMP identity/event state and actual requests/storage; redact identifiers. A script fetch or missing global is not a full processing audit.
5. Google-message preview URLs such as `https://www.tv96live.org/?fc=alwaysshow&fctype=gdpr` and equivalent News/article/Privacy URLs can inspect a published message's presentation. This deliberately ignores region; it cannot verify regional enforcement. Follow with unforced, documented-region tests and a nonregional control. [Official message testing parameters](https://support.google.com/adsense/answer/10924669?hl=en).

The full step-by-step region/choice/failure matrix remains in `ADSENSE_FINAL_ACTION_PLAN.md`. All account changes require owner action; none were made here.

## AdSense technical checks

`adsense-scope-followup-results.json` records checks across 26 public pages. Every present AdSense client identifier is `ca-pub-9924964891667864`; `ads.txt` agrees on `pub-9924964891667864`, DIRECT and Google's seller certification identifier. No conflicting publisher ID was found. This is public implementation consistency, not account ownership/approval. No token or credential was disclosed.

`robots.txt` permits crawling and advertises the canonical sitemap. The sitemap has 24 unique canonical URLs, including all 16 published articles and no unpublished stories. All present page canonicals match their clean public routes under `https://www.tv96live.org`. Existing content/raw HTTP validation confirms titles/descriptions, publication/revision dates, article JSON-LD, Open Graph, one H1, internal/related links, sitemap parity, existing merge/legacy redirects and retired/internal 404s. No new local publisher, robots, sitemap, canonical or article-metadata defect was found requiring a production-file change. Offline/disabled utility pages retain their existing noindex/advertising restrictions; streaming stays disabled.

Account-only owner checks remain:

- **Sites:** correct domain, verification method/artifact, account publisher match, exact approval/rejection state and rejection email. Search Console verification is separate from AdSense site verification.
- **Policy Center:** exact issue type/reason, example URLs, screenshots, serving restrictions and regulatory/CMP reports. No actual Google rejection reason is inferred from this audit.
- **ads.txt status:** recognized/authorized state and account crawler errors; matching public content does not prove the account has processed it.
- **Ads / Auto Ads preview:** present enablement, formats/density, excluded pages/areas and desktop/mobile placement near navigation, tables and consent controls. Existing loader presence does not establish account settings.
- **Privacy & messaging:** published configuration and real regional delivery/choice evidence above. Do not submit site approval or Policy Center review until blockers are resolved.

Owner navigation and official help links are retained in `ADSENSE_FINAL_ACTION_PLAN.md`; nothing in an external account was changed.

## Article 24

`ARTICLE_24_SOURCE_CORRECTION_PROPOSAL.md` maps individual claims to evidence and provides proposed dated wording. Both published Ligue 1 citations still return **HTTP 500 directly**; the web service can retrieve their content. The survival citation is a 2024 account; the playoff explainer is dated 11 May 2026 and describes the preceding season. They cannot by themselves establish every 2026/27 rule. No guessed replacement URL was published.

New primary evidence: the [LFP 2026/27 calendar announcement](https://www.lfp.fr/article/publication-du-calendrier-general-de-la-ligue-1-mcdonald-s-pour-la-saison-2026-2027) is directly HTTP 200 and supports 34 matchdays and the two-legged matchup between 16th in Ligue 1 and the Ligue 2 playoff winner. Its publication date is 4 December 2025, and it notes subsequent FFF validation, so future precise scheduling should still be rechecked. The [official 2026/27 club-return article](https://ligue1.com/en/articles/l1_article_5328-when-does-the-season-start-for-ligue-1-mc-donald-s-clubs) supports 18 clubs through web-service retrieval but also returns 500 directly.

The main issue is citation age/scope and reliability, not a demonstrated change to the rules. Automatic promotion/relegation positions, full current playoff conditions, points rules and historical details need better current/appropriate primary citations. The proposed passage dates the old third/fourth/fifth pathway to its reported season and uses the current LFP source for the verified pairing. No body, metadata or source-list change was made to Article 24. Material paragraph changes await approval and evidence verification; the concrete proposed text is ready for review.

## Regression results

| Check | Final result |
|---|---|
| `generate-static.cjs --check` | PASS — 16 generated articles and publication outputs current; no generation mutation needed |
| `validate-content.cjs` | PASS — content, P0 protections, shared chrome, metadata, publication dates, protected files |
| `image-rights-check.cjs` | PASS — asset registry/hash parity; this is not licence verification |
| `article-32-archive-check.cjs` | PASS — existing archive labels/notice, historical headline/date/body preserved |
| `match-coverage-check.cjs` | PASS — all 12 competitions, EAT boundaries, cache/failure cases, deduplication and token isolation |
| `api-smoke.cjs` | PASS — existing API guards, logos/scores, official standings and calculated fallback |
| `raw-html-check.cjs` | PASS — 16 article responses, 24 sitemap URLs, metadata, assets, redirects/exclusions |
| `browser-check.cjs` | PASS — 16 articles, no-JS content, News filters, dynamic Home, matches/standings, themes, menu, mobile and disabled Watch |
| `legacy-exclusion-check.cjs` | PASS — 19 exact exclusions, 22 active local image URLs, originals/public files/Article 32 preserved |
| `adsense-scope-followup.cjs --sources` | PASS local publisher/canonical/sitemap checks; source availability issues explicitly recorded |

Final existing regression failures: **none**. During development, the added exclusion checker caught external basename collisions and initially treated the intentionally changed ignore file and Vercel's hosted analytics endpoint as ordinary local resources. Those test-harness assumptions were corrected; no production page/API was changed to make checks pass. Live upstream/CMP/ad delivery and actual Vercel upload behavior are outside mocked local regressions.

## Files modified in this follow-up

- `.vercelignore`: the 19 exact-path deployment exclusions only.
- `.editorial/browser-results.json`, `.editorial/raw-html-results.json`: refreshed test evidence.
- `.editorial/ADSENSE_FINAL_ACTION_PLAN.md`, `.editorial/ADSENSE_RIGHTS_EVIDENCE_INVENTORY.md`: superseding follow-up notes; historical evidence remains identified.
- New: this implementation report; `ARTICLE_24_SOURCE_CORRECTION_PROPOSAL.md`; `legacy-exclusion-check.cjs`; `legacy-exclusion-results.json`; `adsense-scope-followup.cjs`; `adsense-scope-followup-results.json`.

Earlier uncommitted branch changes remain from prior authorized work. No additional image file, Article 32 record, article body, generated page, publisher setting, API, streaming code or privacy text was changed in this follow-up. Local originals are retained; historical image-replacement patches remain unapplied and are not authorization under the latest instruction.

## Remaining blockers / release decision

**Hold AdSense re-review.** Article 32's underlying photograph licence remains unestablished; the owner explicitly instructed leaving that image and its metadata unchanged. Other active artwork/branding/provider-image rights still require evidence. Remote CMP setup and EEA/UK/Swiss behavior remain unverified; account-specific Sites/Policy Center reasons, verification, ads.txt recognition and Auto Ads settings require owner inspection. Article 24 source reliability/current-rule scope remains open despite the newly verified LFP pairing source.

The exact legacy-exclusion configuration is ready for an owner-authorized preview/release, but no deployment occurred and this is not full-site legal/rights clearance. Seek approval before applying the Article 24 material correction, changing legal wording or making any new asset/Article 32 changes. No commit, push, external account change, streaming activation, deployment or review submission occurred.
