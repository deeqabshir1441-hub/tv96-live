# TV96 Live — AdSense content-quality audit

Audit date: **12 October 2026, Africa/Nairobi**. Branch: `adsense-readiness-2026-10-11`. Scope: all **16 currently published articles**, the eight principal pages, editorial presentation, data-page value and image provenance. This is an audit only. No published content, Article 32, legal wording, advertising settings, APIs or deployment configuration was changed.

## Assessment and evidence boundaries

The owner's reported rejection was the general “Meet AdSense programme policies” category, with advice about quality and sufficiency. The complete email and account Policy Center were not inspected. **This audit does not identify Google's exact rejection reason or establish an account-specific policy violation.**

The library contains substantive introductory guides with worked arithmetic and useful distinctions. It is not uniformly thin. The strongest content is the goal-difference, xG and competition-format teaching. The weaker areas are distinctive reporting/analysis, the largely generic league-guide sections, incomplete claim-level sourcing, and a public presentation that still promotes dated reporting as current news. Article count, body length, structured data and passing technical tests are not proof of approval readiness.

**Recommendation: hold re-review.** Resolve the live/local presentation gap, strengthen the weakest reader outcomes, and complete rights and consent verification first. These are priorities for this site, not a guarantee that Google will approve it.

Evidence collected:

- Read every published body from `.editorial/article-content.js` and its metadata/source list in `.editorial/news-data.js`; inspected the generated article pages and all eight principal page bodies.
- Read the rendering/template, standings API and frontend, image registry, existing rights inventory and previous audit/implementation evidence. Earlier reports are historical evidence, not descriptions of today's deployment.
- Fresh read-only HTTPS requests to the public site returned **200 for all 24 pages**: eight principal routes and 16 article routes. Fresh `/news-data.js` contains exactly IDs **3, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 32**. Requests occurred on 12 October 2026 around 20:50–21:00 EAT. These were HTML requests, not ad-rendering browser sessions.
- Fresh public HTML contains the exact current local body string for **14 articles**. Articles **24 and 32 do not match**. Public Article 24 lacks the newly added LFP PDF; public Article 32 lacks the archive notice and still contains “Breaking news”. Public Home and News still identify that story as Latest News. This is a confirmed deployment gap, consistent with the explicit no-deployment instructions.
- The web retrieval service returned a three-week-old News snapshot with 24 cards. That cached count is **not** the current live count; the fresh public metadata establishes 16. Cached search extracts were not used to diagnose the present deployment.
- Compared normalized paragraph text across the 16 local bodies. Only **one exact shared paragraph longer than 100 characters** was found, between Articles 13 and 19, identifying UEFA Article 3. This limited test does not measure paraphrased overlap or external plagiarism.
- Consulted current Google guidance and selected primary sporting sources through the web tool. Availability and factual support are separate questions. Not every historical, tactical or biographical sentence was independently corroborated.
- Existing local browser evidence is dated `2026-10-12T17:41:57.383Z` in `.editorial/browser-results.json`: all 16 routes, three related links each, no-JavaScript content and mobile/desktop checks. `.editorial/raw-html-results.json` records local HTML/schema/link/routing checks. These checks use modeled routing and mocked external services. They were **read, not rerun**, for this read-only audit and do not verify real Auto Ads or remote CMP settings.

## Severity and evidence classes

**Critical:** established severe active harm or a directly demonstrated serious policy breach requiring immediate intervention. **No Critical finding was established.**

**High:** material readiness, trust or reader-value concern; resolve before re-review. **Medium:** meaningful editorial or transparency improvement. **Low:** narrower presentation or maintenance issue. Severity does not imply a policy violation.

Evidence labels: **Confirmed** = directly observed local/live fact; **Editorial judgment** = assessment of usefulness or depth; **Potential risk** = a possible policy consequence that has not been demonstrated; **Owner verification** = evidence or account/rights access is missing.

| ID | Severity / class | Evidence and implication | Prioritized action |
| --- | --- | --- | --- |
| Q1 | High — Confirmed | Public `/articles/32` still says Breaking news and lacks the local archive notice; public Home/News say Latest News. Local references: `.editorial/news-data.js:825`, `.editorial/article-content.js:28`, `articles/32.html:333`, `index.html:94`, `news.html:183`. A September account is being foregrounded as current in October. | Owner-controlled release review must distinguish already approved archive presentation from the current public version. Article 32 remains frozen in this task; no further edit is authorized. |
| Q2 | High — Owner verification / potential rights risk | Owner confirms the JJ Gabriel image was edited with ChatGPT from a photograph found through Google Images, with no established original license. Exact assets: `images/articles/jj-gabriel.png` and `.webp`; metadata at `.editorial/news-data.js:825`. | Obtain original provenance and permission evidence; otherwise obtain separate authorization and a suitable independent replacement. Do not call it originally AI-generated, licensed or proven infringing. |
| Q3 | High — Editorial judgment | Article 3 has no external statistical/definition source; Article 9 offers a cautionary framework without applying it to an actual verified draw. League guides 21–24 repeatedly use general tactical viewing advice. Source/body references are in the individual assessments below. | Demonstrate distinct reader outcomes through a small number of sourced cases, explanatory tables or original analysis. Do not merely lengthen articles or publish more interchangeable guides. |
| Q4 | High — Potential inventory-value risk | AdSense loaders exist on Home, News, Matches, Standings, About, Privacy and articles. Matches/Standings can be empty, loading or failed. Existing explanations help, but actual ad serving/Auto Ads exclusions were not inspected. See `matches.html:17`, `standings.html:24`, `privacy.html` advertising loader and Google inventory policies below. | Owner should inspect actual ad-bearing states and exclude utility/non-content/error inventory where appropriate. A loader is not evidence that an ad was served or that a violation occurred. No settings changed. |
| Q5 | High — Owner verification | No documented certified regional CMP verification in the available evidence. Privacy disclosures alone do not establish consent behavior. See `privacy.html`, `.editorial/ADSENSE_FINAL_ACTION_PLAN.md` and `.editorial/ADSENSE_IMPLEMENTATION_FOLLOWUP.md`. | Verify Google-certified CMP configuration and actual applicable EEA/UK/Swiss behavior. Missing globals in an unspecified region establish neither compliance nor noncompliance. |
| Q6 | Medium — Confirmed source/display gap | Article 24's approved local correction and current LFP sources are absent from its live page. Local `articles/24.html:366`, `.editorial/news-data.js:702`; public HTML lacks `26_27_LFP_STATUTS`. | Include the approved Article 24 outputs in a separately authorized release and verify the public revision/source list afterward. No repeat editorial correction is needed locally. |
| Q7 | Medium — Confirmed transparency limitation | All articles use the organizational byline; no named responsible editor, contributor biography or ownership description is supplied in the reviewed About text. `.editorial/article-template.html:292`, `about.html:94`, `about.html:139`. | Add truthful ownership/editorial responsibility and process details if the owner supplies them. Organizational authorship is not itself prohibited; do not fabricate names, credentials or headshots. |
| Q8 | Medium — Confirmed code fact / potential accuracy risk | API returns `standingsSource`, including `calculated-from-finished-matches`; frontend does not disclose it. Fallback sorts points/GD/GF/name and reconstructs points from results. `api/standings.js:9`, `:74`, `:194`, `:210`; `standings.html:808`, `:823`, `:833`. | Propose a visible official-provider-versus-calculated label and limitations. Do not claim fallback currently produced a wrong table; deductions and full league-specific tiebreaks are potential omissions. |
| Q9 | Medium — Confirmed promise/evidence mismatch | Home calls the site a “large platform” and promises “latest transfer market news”, while current dated reporting is August/September archives. `index.html:181`; newest article original publication is 15 September. | Describe the actual guide/archive service and genuine update cadence. The scale claim is unsubstantiated in the inspected materials, not proven false. |
| Q10 | Medium — Confirmed completeness limitation | Article 21 description promises head-to-head ranking context, but its body supplies only a conditional example and directs readers elsewhere for the actual Spanish order. `.editorial/news-data.js:614`, `.editorial/article-content.js:23`. | Obtain current Spanish rules and add a verified explanation, or propose a narrower description; do not guess the hierarchy. |
| Q11 | Medium — Owner verification / source gaps | All 15 registered active image records retain `brandingReview: required`; the registry assigns `rightsStatus: reviewed` programmatically for original-editorial records. `.editorial/news-data.js:865`–`:898`. Several images depict recognizable competition objects. | Complete an evidence-based artwork/branding review. Internal labels, optimization and hashes do not establish legal permission. |
| Q12 | Medium — Editorial judgment / incomplete current-season verification | Articles 12/15/18 use a 2025/26 PL FAQ, Article 22 a 2025/26 survival example, Article 23 a general Bundesliga explainer, and 21 a standings page. They are useful sources but do not jointly verify every 2026/27 rule or historical claim. | Record which season and claim each source supports; prioritize current rulebooks for exact rules rather than adding more general links. |
| Q13 | Low — Confirmed narrow presentation issue | Raw Standings initially says “2026/27 Season”, but JavaScript resets it to Current season and formats the provider season. `standings.html:523`, `:690`, `:793`, `:823`. | Consider neutral initial wording in a future UI change. This is not evidence that loaded standings always show the wrong season. |

## Individual article assessments

Word counts are the current generator's body counts, including correction/revision notes. They describe scope, **not a Google minimum**. Originality below refers to visible synthesis, examples and purpose; it is not a plagiarism clearance or a claim of first-hand reporting. Each article has a publication date, organizational author, source/further-reading block, contextual links and three generated related links. Source sufficiency is assessed separately.

### 3 — How to Read World Cup Knockout Assist Statistics — 466 words

**Priority: High improvement; no established policy breach.** Evidence: `.editorial/article-content.js:5`, `.editorial/news-data.js:60`, `articles/3.html:332`, sources at `:350`.

- **Originality/depth:** Useful synthesis about counting boundaries, assist definitions and opportunity denominators. The four-assists/eight-versus-sixteen appearances example teaches a distinct point. However, it never applies the lesson to a traceable real World Cup dataset.
- **Accuracy/sources:** The visible correction honestly withdraws unsupported Messi-record assertions. Those removed claims must not be reported as current false statements. The only listed source is internal Article 16, not an assist-definition or tournament-data authority; provider variation is asserted without a concrete provider comparison.
- **Readability/usefulness:** Clear headings and limited scope. The practical question remains partly unanswered: readers cannot reproduce a verified knockout-only assist comparison from this page.
- **Proposal:** Add a sourced definition and one reproducible example with tournament/stage/date coverage and counting method. Preserve the correction record. No active hero photograph; the retired image must not be reintroduced automatically.

### 9 — Reading a European Draw: Opponents, Travel and Fixture Context — 477 words

**Priority: High improvement.** Evidence: `.editorial/article-content.js:11`, `.editorial/news-data.js:205`, `articles/9.html:333`, sources at `:351`.

- **Originality/depth:** Provides a sensible checklist distinguishing opponents, schedules, travel and predictions. Added interpretation is present, but most paragraphs tell readers what not to infer rather than demonstrate analysis of a confirmed draw.
- **Accuracy/sources:** The correction removes unsubstantiated opponent/date/venue lists; those are not active assertions. Metadata includes a UEFA Champions League draw announcement plus internal comparison reading. A Champions League source does not establish Europa League/Conference League rules; the body explicitly warns about that distinction.
- **Readability/usefulness:** Coherent and easy to scan, with substantial thematic overlap with the schedule warnings in Articles 13/14 and league guides. Its Europa League category makes the actual worked context especially important.
- **Proposal:** Apply the checklist to one official draw and fixture announcement in the chosen competition, with a dated rest/travel comparison and clear limitations. Do not resurrect the unsupported club list.

### 10 — Álvarez in August 2026: Atlético's Statement and the Reported Meeting — 324 words

**Priority: Medium.** Evidence: `.editorial/article-content.js:12`, `.editorial/news-data.js:238`, `articles/10.html:333`, sources at `:348`.

- **Originality/depth:** A compact chronology adds useful distinctions between a club's Barcelona stance, private-meeting reporting and Arsenal speculation. It is short, but fulfills a narrow archival purpose; word count alone does not make it thin.
- **Accuracy/sources:** The [official Atlético statement](https://en.atleticodemadrid.com/noticias/unanimous-support-from-the-board-of-directors-for-the-club-s-strategy) was retrieved again and supports the board's stated refusal to negotiate with Barcelona. The meeting and Arsenal accounts remain explicitly attributed to Cadena SER/Sky, not club-confirmed facts. Their precise timestamps were not independently reverified in this audit.
- **Readability/usefulness:** Date-led headings, archive framing and the revision history are strong. There is no evidence here of a completed transfer or independently obtained interview.
- **Proposal:** Preserve the archive and, if publishing a follow-up, use a separately dated outcome with evidence. Improve chronology presentation only if it helps readers; do not pad the story or change an old timestamp to appear fresh. Image/branding provenance remains open.

### 12 — How the Premier League Works: Complete Guide — 881 words

**Priority: Medium.** Evidence: `.editorial/article-content.js:14`, `.editorial/news-data.js:302`, `articles/12.html:333`, sources at `:363`.

- **Originality/depth:** Strong beginner structure, explicit 20-team/38-match/380-fixture arithmetic, points examples and games-in-hand reasoning. These offer educational value beyond copying a table.
- **Accuracy/sources:** The inspected [2025/26 PL FAQ](https://www.premierleague.com/en/news/4657245/202526-premier-league-relegation-faq) supports bottom-three relegation and GD/goals-scored ordering in that season. It is not a full current-season rulebook. Numerical examples are internally consistent; further tiebreaks and European entry conditions are deliberately summarized.
- **Readability/usefulness:** Clear sequence and contextual links to Articles 15/18/19. “Complete Guide” is broader than the actual treatment of exceptional tied positions and current allocations, though the linked detailed guides help.
- **Proposal:** Add a compact verified ranking checklist and current-season source mapping; consider a more precise promise if exceptions remain outside scope. Reduce overlapping introductions rather than duplicating Articles 18/19. Trophy/branding evidence is unresolved.

### 13 — How Champions League Qualification Works — 823 words

**Priority: Medium.** Evidence: `.editorial/article-content.js:15`, `.editorial/news-data.js:337`, `articles/13.html:333`, sources at `:361`.

- **Originality/depth:** Distinguishes domestic qualification, entry stages, association/club coefficients, paths, EPS and title-holder vacancies. The invented champion-versus-runner-up example helps explain access rather than ranking sporting merit.
- **Accuracy/sources:** Current [UEFA 2026/27 Article 3](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-3-Entries-for-the-competition-Online?contentId=EgXhqnzQsuW60mwbyCqWtw) was readable in this audit. It supports access allocation, title-holder entry/rebalancing and EPS under paragraphs 3.01–3.09. Earlier inability to retrieve substantive rules is no longer a blanket current finding. No exact country quota is independently certified here.
- **Readability/usefulness:** Helpful verification method, but complex exception paragraphs remain abstract. The shared UEFA-source paragraph with Article 19 is small and functional, not evidence of site-wide duplication.
- **Proposal:** Add one clearly dated, fully sourced access-path example or flow diagram. Keep entry into qualifying separate from confirmed league-phase participation. Competition-themed imagery still needs provenance/branding review.

### 14 — Champions League Format Explained — 951 words

**Priority: Low editorial improvement; Medium image review.** Evidence: `.editorial/article-content.js:16`, `.editorial/news-data.js:375`, `articles/14.html:333`, sources at `:365`.

- **Originality/depth:** One of the stronger guides: a complete progression overview, hypothetical aggregate examples and explanation of why match score alone is insufficient.
- **Accuracy/sources:** [UEFA Article 17](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-17-Match-system-league-phase-Online?contentId=z80npkZwtB5MkmwVqnk6XA) confirms the eight matches/four home/four away and 36-team progression boundaries; [Article 18](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-18-Equality-of-points-league-phase-Online?contentId=d~m2tmtG82UhZujMH0i~aQ) confirms the first tiebreakers. [Article 21](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-21-Knockout-system-extra-time-and-penalty-shoot-outs-Online?contentId=aBOyMYjtgYYIYwn~YRHF5Q) supports extra time/penalties on equal aggregate. Actual current rule text was retrieved, not merely HTTP 200.
- **Readability/usefulness:** The three outcomes list and aggregate arithmetic directly answer common questions. Pairing and home-leg details are deferred, avoiding a guessed unrestricted redraw rule.
- **Proposal:** An original bracket illustration could improve comprehension without adding prose. Review the recognizable trophy/star-ball imagery and the evidence behind its credit; no rights clearance follows from the “original artwork” label.

### 15 — What Is Goal Difference in Football? — 782 words

**Priority: Low.** Evidence: `.editorial/article-content.js:17`, `.editorial/news-data.js:422`, `articles/15.html:333`, sources at `:361`.

- **Originality/depth:** Strong self-contained lesson: positive/zero/negative GD, the four-goal swing from a 2–0 head-to-head result, and a positive-GD/low-points counterexample.
- **Accuracy/sources:** The worked arithmetic checks out. League-specific claims are limited; the PL FAQ and the dated Serie A example support the distinction between GD arithmetic and ranking rules. Those examples should not be presented as all leagues' full 2026/27 hierarchy.
- **Readability/usefulness:** Clear abbreviation definitions and invented examples. Provides an answer without requiring users to open the data feed first; useful independently of Articles 12/18.
- **Proposal:** A concise table could make the worked examples easier to compare. Keep this page focused on the calculation; do not inflate it into another general league guide. The registered illustration still carries the common branding-review flag.

### 16 — What Is Expected Goals (xG)? — 823 words

**Priority: Low.** Evidence: `.editorial/article-content.js:18`, `.editorial/news-data.js:455`, `articles/16.html:333`, sources at `:362`.

- **Originality/depth:** Substantive beginner explanation of model variation, calibration, shot summation, game state, non-penalty context and non-shot/rebound limitations. The independent-chance calculation adds useful depth: 1.00 summed xG is not certainty of scoring.
- **Accuracy/sources:** The [Hudl Statsbomb explainer](https://www.hudl.com/blog/expected-goals-xg-explained) now receives the old Statsbomb URL redirect and supports the model/probability and provider-feature explanations. The 0.10 + 0.25 + 0.40 = 0.75 and 75% hypothetical calculations are internally correct. The independence assumption is explicit.
- **Readability/usefulness:** Avoids pretending the site supplies xG data. Headings make a technical topic accessible, and limitations are relevant rather than generic filler.
- **Proposal:** Optionally add a provenance-backed diagram or sourced example using one named model. Never invent match xG or mix provider totals without explanation. Generic artwork can still contain designed motifs requiring review.

### 17 — How VAR Works in Football — 839 words

**Priority: Low.** Evidence: `.editorial/article-content.js:19`, `.editorial/news-data.js:481`, `articles/17.html:333`, sources at `:363`.

- **Originality/depth:** Distinguishes checks/reviews, factual/subjective judgments and final decision authority. Location/contact examples and a reporting checklist add value beyond a definition.
- **Accuracy/sources:** The current [IFAB VAR protocol](https://www.theifab.com/laws/latest/video-assistant-referee-var-protocol/) supports correction of a clearly incorrect second caution causing dismissal. It also explicitly excludes intervention merely for a missed potential second caution. The article does not state a general right to appeal all yellow cards. Its optional-corner provision must remain competition-dependent; it is not a claim that every league has adopted it.
- **Readability/usefulness:** Good explanation of what a screen message or delay actually establishes. No motive or private referee-room conversation is invented.
- **Proposal:** Add a compact “eligible / not eligible” reference if useful and keep the law edition dated. Future law changes need factual review, not automatic date refreshing. Artwork provenance remains subject to the registry's review flag.

### 18 — Premier League Relegation Explained — 841 words

**Priority: Medium.** Evidence: `.editorial/article-content.js:20`, `.editorial/news-data.js:511`, `articles/18.html:333`, sources at `:364`.

- **Originality/depth:** Distinct survival-focused purpose despite overlap with Article 12. The invented Green Town/Red United comparison, remaining-points bound and explanation of why a single pairwise calculation may be insufficient are useful.
- **Accuracy/sources:** PL positions and basic comparison match the dated official FAQ. The [EFL format announcement](https://www.efl.com/news/2026/march/05/efl-statement--sky-bet-championship-play-off-format/) was reachable but its substantive article text was not exposed by this audit's retrieval. The body wisely does not assert a fixed playoff field from an old format. Current promotion details remain a source-verification item.
- **Readability/usefulness:** Avoids a universal “40 points guarantees safety” claim. The commercial paragraph is appropriately non-numerical, but adds breadth without a concrete sourced club example.
- **Proposal:** A small worked survival scenario with all relevant teams/fixtures would better satisfy readers wanting to calculate safety. Do not turn it into an unverified live predictor. Preserve the caveat about exact current EFL rules.

### 19 — How European Qualification Works in the Premier League — 904 words

**Priority: Medium.** Evidence: `.editorial/article-content.js:21`, `.editorial/news-data.js:545`, `articles/19.html:333`, sources at `:365`.

- **Originality/depth:** The league/cup/EPS/title-holder sequence is a useful organizing method, with a distinct English domestic question from Article 13.
- **Accuracy/sources:** Current UEFA Article 3 supports EPS and title-holder/rebalancing cautions; EPS allocation follows vacancy handling rather than a simple extra-place addition. The article avoids a permanent English fifth-place guarantee. Its English cup-route description still needs claim-level current domestic source mapping for a complete scenario.
- **Readability/usefulness:** Mostly conditional prose. A reader can follow the checklist but cannot use it alone to resolve a particular final table; that is a completeness limitation rather than an observed incorrect allocation.
- **Proposal:** Add a clearly labeled current-season allocation table and one verified overlap scenario, with league/UEFA evidence for each step. Keep standard entitlement separate from final adapted access and qualifying-round entry. Recognizable UEFA trophy/PL motifs remain unresolved artwork review items.

### 21 — La Liga Guide — 777 words

**Priority: Medium, with a specific promise gap.** Evidence: `.editorial/article-content.js:23`, `.editorial/news-data.js:614`, `articles/21.html:333`, sources at `:363`.

- **Originality/depth:** Includes useful beginner structure and tactical observation prompts, but wide-player positioning, compact blocks, transitions and venue comparisons would fit several other league guides unchanged.
- **Accuracy/sources:** The [official LALIGA standings](https://www.laliga.com/en-GB/laliga-easports/standing) were reachable. A standings page does not independently establish the complete current tiebreaking regulations. The body labels its head-to-head example conditional, while the description promises head-to-head ranking context.
- **Readability/usefulness:** Readable and avoids reducing Spain to two clubs. Readers who came for the Spanish ranking procedure still need another authority; no actual order is supplied.
- **Proposal:** Prioritize verified current Spanish ranking rules and one worked tied-points case. Replace some generic tactical material with a sourced league-specific example if approved. Do not infer a rule from the displayed GD order. Image-generation/original-source evidence remains unverified.

### 22 — Serie A Guide — 849 words

**Priority: Medium.** Evidence: `.editorial/article-content.js:24`, `.editorial/news-data.js:641`, `articles/22.html:333`, sources at `:364`.

- **Originality/depth:** Its strongest distinctive element is the Italian decisive-tie example. The formation/wing-back and dropping-forward sections explain useful football concepts but are not specifically demonstrated in a sourced Serie A match.
- **Accuracy/sources:** The [official Lecce/Cremonese account](https://en.legaseriea.it/serie-a/news/the-final-reckoning-lecce-and-cremonese-face-a-decisive-final-day) was retrieved and expressly concerns 2025/26. It supports the article's dated playoff example, not a blanket assertion of every 2026/27 regulation. The 1929/30 history has a separate league citation; its full support was not rechecked here.
- **Readability/usefulness:** Good separation of league/cup results and tables/official decisions. Repeated “check current rules” language is responsible but leaves readers without the complete exceptional-tie procedure.
- **Proposal:** Obtain the current rulebook and explain a defined two-team versus multi-team example. Preserve the historical example as historical. Investigate recognizable trophy artwork; no image substitution is proposed without approval.

### 23 — Bundesliga Guide — 814 words

**Priority: Medium.** Evidence: `.editorial/article-content.js:25`, `.editorial/news-data.js:672`, `articles/23.html:333`, sources at `:365`.

- **Originality/depth:** Provides correct 34-game/306-fixture arithmetic and cross-league points-rate context. The 16th-place distinction is concrete, while pressing/counterattack paragraphs are more general.
- **Accuracy/sources:** The [official promotion/relegation explainer](https://www.bundesliga.com/en/bundesliga/news/how-does-promotion-and-relegation-work-in-the-bundesliga-10645) supports 16th versus second-tier third over two legs. It mixes general rules with 2025/26 examples, so exact future schedules are not verified from it. Arithmetic such as 102 versus 114 maximum points is correct. The 1963 historical claim is not freshly verified here.
- **Readability/usefulness:** Clearly separates automatic relegation, playoff and safety. Avoids treating all German teams as tactically identical.
- **Proposal:** A compact comparison against the verified Ligue 1 pathway could make the difference immediately useful. Keep league-specific ranking and history citations precise. The recognizable championship-shield depiction needs separate rights/branding evidence.

### 24 — Ligue 1 Guide — 904 local words; older live body

**Priority: Medium; local source correction completed, public gap confirmed.** Evidence: `.editorial/article-content.js:26`, `.editorial/news-data.js:702`, `articles/24.html:333`, source list at `:366`, `.editorial/ARTICLE_24_IMPLEMENTATION_REPORT.md`.

- **Originality/depth:** Useful 18-club versus former 20-club comparison and 51/34 = 1.5 example. The corrected fifth-at-fourth, winner-at-third pathway adds specific utility that a Bundesliga-style assumption would miss.
- **Accuracy/sources:** The local approved correction cites [LFP 2026/27 regulations](https://www.lfp.fr/assets/26_27_LFP_STATUTS_REGLEMENTS_08_09_2026_f2aaaaa325.pdf), Articles 519/519 ter, and the [current Ligue 2 calendar](https://www.lfp.fr/article/ligue-2-bkt-le-calendrier-de-la-saison-2026-2027). PDF verification belongs to the recorded previous source review; repeat PDF access timed out then. The calendar was retrieved again in this audit. Historical Ligue 1 citations are clearly labeled locally. Live HTML still has the older two-source version.
- **Readability/usefulness:** Correction retains original publication date and adds an honest revision note. Youth-development/tactical sections remain general; the 1930s history is not supported by the promotion rules alone.
- **Proposal:** Verify the already approved release separately, then consider claim-level history/structure references and a short pathway graphic. Do not perform another body edit or silently refresh the publication date in this audit.

### 32 — JJ Gabriel, 15, Asks to Leave Manchester United as Club Fight to Keep Highly Rated Prospect — 956 local words; older live body

**Priority: High for public freshness and unresolved image permissions.** Evidence: `.editorial/article-content.js:28`–`:50`, `.editorial/news-data.js:825`, `articles/32.html:333`, source list at `:358`, `images/articles/jj-gabriel.png`, `images/articles/jj-gabriel.webp`.

- **Originality/depth:** The account combines BBC/MEN reporting with contextual distinctions about registration, selection and transfer. However, request-versus-completed-departure and undisclosed-reasons cautions recur in the opening, “What has happened?”, “What happens next?” and conclusion. Length therefore overstates the amount of new information.
- **Accuracy/sources:** Claims remain attributed; no first-hand confirmation is claimed. BBC could not be retrieved through the web tool in this audit, so academy honours, hat-trick, senior appearance and dispute details were not freshly independently verified. The local archive notice explicitly states that ages/fixture expectations describe 15 September and that he turned 16 on 6 October, with a club-profile reference. Local text does not purport to establish today's registration status.
- **Readability/usefulness:** Local archive framing preserves historical integrity. Public HTML has no archive notice and still says Breaking news; public Home/News feature the old Latest News description. That is a verified presentational freshness problem, not evidence that the historical request never happened.
- **Image provenance:** Owner-confirmed photograph-derived ChatGPT edit, original found through Google Images; original license unresolved. “User-provided” does not mean licensed. No inference of infringement or original AI generation is warranted.
- **Disposition:** **Do not edit this article, its metadata or images in this task.** Record blockers and require separate owner direction for any future action. An evidence-backed follow-up would need a new dated verification, not invented registration/transfer news.

## Page-by-page audit

### Home — `/`, `index.html`

**High live freshness; Medium value/promise concerns.** References: featured block `index.html:94`, match display `:142`, social promotion `:176`, description `:181`.

Home performs a useful discovery function: guide cards, current-match interface and league shortcuts connect several reader tasks. It is not an empty landing page. Its standalone editorial value is modest because its text is mostly summaries, links and promotional copy. The local first featured item is an archive, while the live version still presents Latest News. Newest-by-publication selection makes an old story prominent without showing a new reporting outcome. “Large platform” and latest-transfer promises should be justified or narrowed by the owner. A clearer audience promise, topic-led entry points and a genuinely sourced weekly overview would improve distinctiveness; no such content was manufactured here. TikTok's “latest highlights” promise is an outbound-service claim, not evidence that licensed highlights or active streaming exist on this site.

### News — `/news`, `news.html`

**High live freshness; Medium discovery improvement.** References: intro `news.html:177`, featured cards `:182`, generated library block `:209`, sidebar update implementation around `:542`.

The current library has 16 items, full static discovery plus filtering/pagination and recommended reading. News is useful as an index; card duplication between Featured and the full library is normal navigation, not article plagiarism. Its main limitation is showing archives and evergreen teaching under a latest-reporting promise. The local archive filter helps, but the live featured account still says Latest News. Distinguish news date, actual revision date and guide type visibly when later approved. A purpose-based grouping such as “read a table” versus “competition rules” could help readers choose; empty category/search results should remain navigable and not become ad-focused screens. Source reading alone does not prove current live sidebar error handling matches the locally reviewed fix.

### Matches — `/matches`, `matches.html`, `matches-data.js`, `api/matches.js`

**Medium limited differentiation; High potential ad-state review.** References: main display `matches.html:109`, refreshed label `:114`, coverage/context `:130`–`:135`, refresh text `:207`.

Adds genuine functional value through grouped live/fixture/result presentation, East Africa Time day selection, overnight-live handling and competition aggregation. The public page includes the coverage/time explanation; this is more than an unexplained third-party feed. It identifies the provider, explains that an empty day is not proof no football exists and distinguishes display refresh from provider confirmation. Raw HTML has the explanations but no populated match list without JavaScript. JavaScript dependence alone is not an AdSense violation.

The weaker aspect is that the actual match facts remain provider facts and there is little match-specific original context, no documented editorial methodology for featured fixtures and no on-page provider-confirmed freshness time. A useful next proposal would connect a fixture to a relevant sourced guide or dated short explanation of its table/aggregate context, avoiding automated unsourced predictions. Empty/error screens require owner review of actual ad behavior; no claim is made that these states are currently being monetized improperly.

### Standings — `/standings`, `standings.html`, `api/standings.js`

**Medium transparency/standalone value; High potential ad-state review.** References: season placeholder `standings.html:523`, table glossary/caveats `:589`–`:595`, season handling `:690`, data fetch/render `:808`–`:863`; fallback `api/standings.js:9`–`:85`, `:194`–`:210`.

The glossary, qualification cautions and links to six competition guides are meaningful additional context. Live raw HTML includes them. Nevertheless, the main task depends on JavaScript/upstream availability; without rows it becomes a generic table-reading page. Form display is useful formatting, not original match research.

The API can return an official table or a calculated fallback. The latter reconstructs results and sorts points/GD/GF/name; it cannot independently incorporate all disciplinary decisions or league-specific ranking rules. The API labels that source internally, but the UI does not disclose it. This is a confirmed transparency gap and a potential accuracy risk, not proof a specific displayed team position is wrong. Position colours are explicitly indicative, which reduces misleading qualification claims. Propose a visible source/freshness/limitations label and league-specific rule links; changes to ranking logic require separate scope and regression testing.

### About — `/about`, `about.html`

**Medium transparency improvement.** References: Who We Are `about.html:94`, editorial approach `:121`–`:139`, corrections `:141`, contact `:170`.

Substantial purpose, coverage, editorial attribution and correction policy; explicitly disclaims official league/club/broadcast status. This is useful trust content rather than filler. It explains organizational authorship and illustrates a responsible distinction between reporting and analysis. It does not identify the person/business responsible for publication or substantiate editorial experience. Add truthful owner-approved details where appropriate, without claiming a named author profile or street address is universally required by AdSense. The August update label should be reviewed against actual revision history; no unsupported replacement date is proposed.

### Contact — `/contact`, `contact.html`

**Low standalone publisher-content value, but useful utility page.** References: email `contact.html:66`, corrections `:77`, rights concerns `:86`, technical issues `:97`.

Clear mailto contacts for general, factual, rights and technical questions; candidly states that there is no web form. Absence of a contact form is not an established policy breach. Repeated email instructions are appropriate for this purpose, not a reason to turn the page into a long article. No AdSense loader was found on this page. Inbox existence, delivery and response practice require owner verification; no test email was sent. Keep the page usable for visitors without a configured mail application through the visible address.

### Privacy Policy — `/privacy`, `privacy.html`

**High consent/account verification; Medium feature-description review.** References: policy date `privacy.html` main heading area; sections Advertising, Cookies/Local Storage, Football Data and Media, and Your Choices and Rights.

Describes Vercel, Umami, AdSense, theme storage, caching, third-party media, external resources and contact rights. It has meaningful trust/utility value and should remain accessible. The wording also refers to match-related media/HLS services although streaming is currently disabled. That is a feature-description review item; it does not prove unlawful processing. Exact controller details, retention settings and regional consent mechanisms cannot be legally validated from HTML alone. Its ad loader warrants owner review of whether this utility page should receive Auto Ads. **No legal wording should be changed without owner/legal review.** Browser cookie controls and generic privacy statements are not substitutes for applicable CMP configuration.

### Terms — `/terms`, `terms.html`

**Low content concern; owner/legal verification remains.** References: service description `terms.html:88`, football data `:102`, intellectual property `:126`, availability `:150`, contact `:181`.

Plain service, permitted-use, third-party, accuracy and rights terms, without representing the site as an official broadcaster. Useful support content, not a substantive editorial destination or a source of image licenses. The rights disclaimer explicitly says marks belong to their owners; that does not grant permission to use photographs or branding. No AdSense loader was found. Legal enforceability, governing arrangements and accurate owner identity are outside this content audit; do not revise disclaimers or invent legal assurances.

### Ancillary low-value screens

`watch-live.html` is a disabled utility page, not an active broadcast service; `site-config.js:2` keeps streaming off. Offline/error/retired/unknown routes are not additional substantive articles. Prior local checks show noindex/redirect/exclusion protections and no advertising loader on disabled Watch/offline pages. Those prior local observations are not certification of every live ad state. They should not be counted toward content sufficiency or re-enabled as an approval tactic. Source files containing dormant stream endpoints do not establish currently active playback.

## Originality, repetition, linking and editorial transparency

The published library has **12 competition/statistics guides (12–19 and 21–24), two analytical explainers (3 and 9), and two reporting archives (10 and 32)**. It contains no demonstrated first-hand interview, original statistical dataset or observed match-analysis case study in the reviewed bodies. That does not make explanatory writing worthless; it does make a broad “latest news / analysis” promise harder to substantiate.

The strongest original contribution is explanatory organization and invented worked examples. The clearest thematic repetition is between general league guides 21–24 (structure, European conditionality, tactical observation, follow Matches/Standings), and between 12/18/19 (points/tables and conditional qualification). Different reader questions justify separate pages, but generic concluding warnings should not replace a distinct answer on each page. The exact repeated UEFA paragraph between 13/19 is minor. No external plagiarism conclusion was established, and the audit does not infer AI authorship of the article prose from writing style or publication timestamps.

All local article bodies are server-delivered, with descriptive internal links and three related items; no orphan in the current 16-page sitemap was identified from the available link evidence. Main navigation and footer links connect core service and policy pages. Existing browser evidence supports filtering, mobile menus, themes and related cards. This is a strength. More links are not automatically better; place a link where it helps resolve the reader's next question, and label cross-competition examples as comparisons.

Sources are often grouped at the bottom, leaving history or specific tactical claims without an immediate provenance trail. Improve claim-to-source mapping, current-versus-historical labels and date-specific sign-off. Group bylines are acceptable presentation, but readers should be able to learn who is accountable and how corrections are reviewed. Accurate authorship/process details should come from the owner; do not invent expert reviewers or assert that AI assistance alone is prohibited.

## Image provenance and unresolved permissions

Technical registration/hashes verify file consistency, not authorship, licensing, subject permission or trademark clearance. The current internal loop assigns reviewed status to original-editorial records while all active registered images still require branding review. Treat those statuses as workflow fields.

| Active use / exact source and delivery paths | Evidence category and remaining question |
| --- | --- |
| Article 3 | No active hero image; its older candidate is suppressed. Do not infer rights clearance for retired stored assets. |
| Article 9: `images/articles/reading-european-draw.png`, `images/articles/reading-european-draw.webp` | Recorded as original editorial/AI illustration; retain generation/reference evidence and inspect motifs. |
| Article 10: `images/articles/alvarez-meeting-report.png`, `images/articles/alvarez-meeting-report.webp` | Generic meeting-room illustration; earlier visual review noted a competition-associated ball pattern. Creation evidence and motif review still needed. |
| Article 12: `images/articles/premier-league-guide.png`, `images/articles/premier-league-guide.webp` | Earlier inventory identifies recognizable trophy/lion motifs. Original rendering does not resolve branded-element permissions. |
| Article 13: `images/articles/champions-league-qualification.png`, `images/articles/champions-league-qualification.webp` | Recognizable trophy/star-ball motifs; verify creation inputs and branding treatment. |
| Article 14: `images/articles/champions-league-format.png`, `images/articles/champions-league-format.webp` | Recognizable trophy/star-ball depiction; recorded original-artwork credit is not licensing evidence. |
| Article 15: `images/articles/goal-difference-football.png`, `images/articles/goal-difference-football.webp` | Diagram/illustrative category; retain creation evidence and review any included designed objects/marks. |
| Article 16: `images/articles/expected-goals-xg.png`, `images/articles/expected-goals-xg.webp` | Generic xG diagram with a previously noted patterned ball; verify independent creation and motifs. |
| Article 17: `images/articles/how-var-works.png`, `images/articles/how-var-works.webp` | VAR/editorial illustration; internal original-editorial status and required branding review, not legal clearance. |
| Article 18: `images/articles/premier-league-relegation.png`, `images/articles/premier-league-relegation.webp` | Generic diagram/stadium scene; underlying reference and ad-board provenance should be recorded. |
| Article 19: `images/articles/premier-league-european-qualification.png`, `images/articles/premier-league-european-qualification.webp` | Earlier inventory identifies UEFA trophies/PL motif; permissions remain unverified. |
| Article 21: `images/articles/la-liga-guide.png`, `images/articles/la-liga-guide.webp` | Stadium/ball artwork, recorded AI generation; designed ball/architecture and inputs need review. |
| Article 22: `images/articles/serie-a-guide.png`, `images/articles/serie-a-guide.webp` | Recognizable trophy-style depiction; retain generation evidence and branding review. |
| Article 23: `images/articles/bundesliga-guide.png`, `images/articles/bundesliga-guide.webp` | Recognizable championship shield; distinct branded elements require review. |
| Article 24: `images/articles/ligue-1-guide.png`, `images/articles/ligue-1-guide.webp` | Stadium/ball/city artwork; creation/reference provenance and motifs unresolved. |
| Article 32: `images/articles/jj-gabriel.png`, `images/articles/jj-gabriel.webp` | **Owner-confirmed photograph-derived edit, not originally AI-generated. Original photograph license unestablished.** Identifiable person and club/sponsor marks raise separate questions; no infringement conclusion. Frozen unchanged. |

Delivery WebP is used for article heroes/cards and social/structured-data images; PNG originals remain local/public assets according to the current deployment rules. See each article's generated image metadata at `articles/ID.html:15` and its source metadata reference above. Home/News also reuse selected editorial delivery images; Article 32 provenance is therefore not limited to its article URL.

Shared `logo/Logo.png`, `icon-192.png`, `icon-512.png`, `editorial-fallback.png`, `football-fallback.svg`, upstream team crests and competition emblems also need provenance records appropriate to their use. Downloadability from an API host is not a license. Generic/code-authored shapes and text have different evidence needs from identifiable photographs or competition designs; none should be automatically grouped as infringement.

The previously approved **19 unused legacy originals** include `news image/GettyImages-2166876546-2-scaled.jpg` and `news image/GettyImages-2262861156.jpg.webp`, 13 other `news image/` assets and four `banner/` assets. Exact exclusions remain in `.vercelignore:3`–`:21`, with reference checks and original fingerprints in `.editorial/legacy-exclusion-results.json`. Local originals are preserved. Prior public availability was recorded on 11 October; this audit did not newly test every public asset or deploy the exclusions. Other retired illustrations and unused competition icons in the rights inventory are not automatically covered by those 19 exclusions. Further exclusion/removal requires its own usage check and owner approval.

## Comparison with Google guidance

| Official reference, consulted 12 October 2026 | Relevant standard | What this audit establishes |
| --- | --- | --- |
| [AdSense eligibility](https://support.google.com/adsense/answer/9724?hl=en) and [site readiness](https://support.google.com/adsense/answer/7299563) | Original, useful content and clear navigation matter. | Examples/navigation are strengths; distinctiveness and promise gaps are editorial concerns. These pages do not establish a fixed article/word quota. |
| [Screens without publisher content](https://support.google.com/publisherpolicies/answer/11112688) | Google-served ads must not monetize low-value, empty, construction or behavioral screens. | Utility/error states need actual ad-state review. No improper served impression was demonstrated. |
| [Replicated content](https://support.google.com/publisherpolicies/answer/11190248) | Copied/embedded material needs added commentary, curation or value. | Data formatting, teaching and attribution add some value; limited original case analysis warrants improvement. Neither all API use nor every attributed summary is proven prohibited. |
| [Google Publisher Policies](https://support.google.com/adsense/answer/10502938?hl=en) | Intellectual property, honest representation, privacy and ad interaction standards apply. | Rights evidence gaps, old live labels and service promises need review. No legal determination, account violation or live ad-placement finding is claimed. |
| [AdSense Program policies](https://support.google.com/adsense/answer/48182?hl=en) | Navigation and advertised functionality must be honest; invalid ad interactions are prohibited. | Streaming remains disabled. No incentivized clicking, active unauthorized playback, malware or deceptive ad placement was established in the reviewed material. Traffic/account history was not inspected. |
| [Certified consent requirements](https://support.google.com/adsense/answer/13554116?hl=en) | Applicable EEA/UK/Swiss ad serving needs the required certified consent setup. | Owner/regional verification remains outstanding; a privacy page or unspecified-region observation cannot resolve it. |
| [Search Central helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) | Useful originality, accurate authorship and reader purpose are quality diagnostics. | Supports improving accountability and specific outcomes. This is supplementary Search guidance, not an independent diagnosis of an AdSense rejection or a compulsory author-profile checklist. |

No blanket AI-content ban, minimum 30-article requirement, mandatory 1,000-word target, minimum traffic threshold or required comment system was inferred. The evidence does not support “all content is copied”, “all images infringe” or “Google rejected the site because of Article 32”.

## Prioritized improvements and review gates

1. **High — reconcile public presentation with authorized work.** Owner separately reviews/releases approved outputs and verifies the live article labels/source lists. This audit authorizes no release and no Article 32 edit. Confirm the real public 16-item inventory rather than relying on old search caches.
2. **High — resolve media provenance, beginning with Article 32.** Obtain original photograph/source/permission evidence or commission a separately approved independent alternative. Keep all originals intact. Finish documented review for recognizable branding and third-party media/data use.
3. **High — verify consent and actual ad-bearing states.** Owner checks Privacy & Messaging, regional consent behavior, Auto Ads/page exclusions and empty/error inventory; review the actual rejection/Policy Center wording. No account configuration was inspected or changed here.
4. **High — strengthen the weakest substantive outcomes.** Start with Article 3's reproducible statistical example and Article 9's verified draw/schedule case, then Article 21's actual ranking explanation. Agree precise source-backed proposals before publication. One useful case is preferable to several generic new articles.
5. **Medium — improve league-guide specificity and source mapping.** For 21–24, verify current league rules/history and replace some interchangeable tactical prose with a sourced competition-specific example. For 12/18/19, maintain distinct beginner/survival/Europe purposes and use current-season domestic/UEFA authority where exact allocations are stated.
6. **Medium — make data reliability visible.** Propose provider-versus-calculated standings labels, meaningful freshness/coverage states and carefully verified table/aggregate context. Do not invent team predictions or treat fallback rankings as official. Any API change needs separate authorization/scope.
7. **Medium — add truthful editorial accountability.** Owner supplies real ownership/responsibility, review process and any relevant experience. Preserve group bylines if appropriate, link to accurate information, and retain material correction histories and original publication dates.
8. **Medium/Low — align Home/News promises and utility pages.** Describe the actual guide/archive/data service, choose topic-led discovery, and review legal/service disclosures with the owner. Do not fill Contact/Privacy/Terms with unrelated prose to inflate word counts.

Acceptance should be judged by reader tasks: can someone reproduce the statistical example, resolve the explained competition case, tell an archive from current reporting, identify the source/age of a table, and understand who is accountable? Those outcomes are more informative than article length alone. Approval remains Google's decision; no improvement guarantees it.

## Work performed and remaining limits

Created only **`.editorial/ADSENSE_CONTENT_QUALITY_AUDIT.md`**, excluded from deployment by the existing `.editorial/` rule. Read-only public requests and local analysis were used; existing test result files were preserved. No content generation, article/image replacement, legal revision, API edit, stream activation, commit, push, deployment or AdSense review submission occurred.

Article 32 remains unchanged, including its existing local archive notice, headline, timestamp, body, image and metadata. The gap between that local presentation and today's live page is recorded rather than silently corrected. The current approved Article 24 correction is preserved. A focused preservation fingerprint covers both central article sources, review/optimization records, the 16 generated article files and core pages/APIs/settings; no change to those files is needed for this audit.

Remaining uncertainty: Google account/rejection details; actual served Auto Ads and regional consent; original creation/licensing records; external originality comparisons; exact current regulations where not retrieved; fresh verification of every historical/tactical/biographical claim; live browser/upstream behavior beyond raw HTML. None is converted into an invented policy violation.
