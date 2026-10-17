# Home and About content audit — 13 October 2026

Read-only assessment; exact text below is proposed, not implemented. Branch `adsense-readiness-2026-10-11`.

## Findings and classifications

| ID | Class / priority | Evidence and effect |
|---|---|---|
| HB1 | Content-quality improvement / Medium | `index.html:181` calls TV96 a “large platform” and promises “the latest transfer market news.” The current 16-article library mainly contains explanatory guides and two reporting archives. Scale and continuous latest-news coverage are not substantiated. |
| HB2 | Verified defect / Low | `about.html:77` says Updated August 2026 despite editorial-transparency text introduced in the September review; the date no longer reflects those changes. Set an accurate date when the proposed update is actually implemented. |
| HB3 | Content-quality improvement / Medium | `about.html:105` coverage list includes news/transfer developments and match previews without explaining the current emphasis on guides and dated archives. Use demonstrable services. |
| HB4 | Content-quality improvement / Medium | Home explains neither provider limitations nor how guides help read results. Add a concise reader route; retain static Featured content which remains useful when APIs fail. |
| HB5 | Owner decision required / Low | `index.html:173` promises latest TikTok highlights/videos. Ownership, update cadence and media permissions for that external channel are not verified. A neutral follow invitation avoids an unsupported cadence/content promise; owner must confirm the intended channel. |
| HB6 | No change needed | Working local navigation, mobile menu, theme controls, install prompt, footer Privacy/Terms/Contact links and SEO canonicals pass existing browser/HTML checks. Standings is reachable through league chips, Matches and editorial links although absent from the primary nav; adding another nav item is optional, not a broken-link defect. |
| HB7 | No change needed | Live viewing is explicitly unavailable, configuration is false and local match cards omit streaming links/badges. “Live scores” describes score updates rather than a broadcast. Do not enable or redesign streaming. |
| HB8 | Owner decision required / Medium | About's organizational byline and corrections contact are supported by the existing site. Mailbox access, response handling and ongoing review practice need owner confirmation; no staff names, offices, credentials or business registration have been invented. |
| HB9 | Content-quality improvement / Low | Values/Vision and repeated contact wording are generic but not false. Retain them during a focused edit; do not expand marketing prose. |

## Exact proposed Home changes

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

## Dependencies and preservation

Home Featured content between `BEGIN STATIC HOME` markers is generated from `.editorial/news-data.js` via `.editorial/generate-static.cjs`; do not edit those generated cards manually. H1–H4 are outside that generated block and belong to the authored `index.html` source. About is authored directly in `about.html`; it is not generated article HTML. Proposed edits therefore use those authored sources, then run generator parity normally. No shared template/CSS or SEO metadata changes are needed.

Privacy/Terms/Contact are linked and readable, with correction and rights-reporting routes. Privacy's conditional media/HLS disclosure and actual remote consent settings require owner/legal review; no legal text change is proposed in this batch. Contact mailbox functionality cannot be established by a `mailto:` link.

Retain design identity, heading structure, navigation/footer, links, canonical/OG metadata, app controls, API polling and all Article 32 content/image. Extend relevant source preservation guards only for exact approved prose. Test Home with working, empty and failed API data and JavaScript disabled; verify static editorial links remain visible. Run mobile/desktop/theme/navigation checks, raw HTML links and metadata, all article preservation guards and generator parity. The comprehensive production findings and ad/CMP limits are in FINAL_ADSENSE_READINESS_AUDIT.md.
