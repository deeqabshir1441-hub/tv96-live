# Article 23 proposal — 13 October 2026

Research/proposal only. Branch `adsense-readiness-2026-10-11`. No editorial or public file changes.

## Current article and preservation

Read the complete `.editorial/article-content.js` entry 23 (line 25) and `.editorial/news-data.js` entry 23 (line 682). Title: Bundesliga Guide; 814 derived words / four minutes; published `2026-09-05T12:00:00+03:00`; no `updatedAt` field. Author: TV96 Live Editorial Team; related IDs `[24,15,13]`; image `/images/articles/bundesliga-guide.png` with registered WebP delivery. Preserve all these fields and every existing paragraph.

Current sections explain 18 clubs, 34 matches/306 fixtures, points-per-game comparisons, ranking's first criteria, relegation/play-off boundaries, historical context, tactical pressing and site navigation. Existing sources are the Bundesliga promotion/relegation explainer and competition FAQ. The P0 preservation history records a standings-link correction; the current body still matches its approved hash. Article 24's reading-time change in this page is already authorized and must remain intact.

The gap is a reproducible real play-off example. The current invented run-in scenario contains no numerical comparison and does not demonstrate aggregate goals or penalties.

## Verified evidence

| Fact | Evidence |
|---|---|
| First leg: 23 May 2024, Bochum 0–3 Fortuna Düsseldorf | Official 2023/24 fixture listing and first-leg match centre |
| First-leg venue: Vonovia Ruhrstadion, Bochum | First-leg match centre |
| Return: 27 May 2024, Fortuna Düsseldorf 0–3 Bochum after extra time | Official fixture listing, return match centre and retrospective report |
| Return venue: Merkur Spielarena, Düsseldorf | Return match centre |
| Aggregate: 3–3 | Retrospective report; 0+3 versus 3+0 |
| Extra time: two 15-minute periods; no additional goal | Official play-off explainer and report/match centre |
| Shoot-out: Bochum won 6–5 | Official report, confirmed by DFL economic report summary |
| Outcome: Bochum retained Bundesliga membership for 2024/25 | Official report |
| Away-goals tiebreak removed from 2021/22 | Official play-off explainer; applicable to this 2023/24 tie |

Sources, inspected on 13 October 2026:

1. [Official 2023/24 fixture listing](https://www.bundesliga.com/en/2bundesliga/matchday/2023-2024/relegation).
2. [First-leg match centre](https://www.bundesliga.com/en/bundesliga/matchday/2023-2024/relegation/vfl-bochum-1848-vs-fortuna-duesseldorf/liveticker).
3. [Return match centre](https://www.bundesliga.com/en/bundesliga/matchday/2023-2024/relegation/fortuna-duesseldorf-vs-vfl-bochum-1848/liveticker).
4. [Official retrospective report](https://www.bundesliga.com/en/bundesliga/news/bochum-fortuna-dusseldorf-relegation-play-off-free-highlights-live-blog-27447/) — its displayed publication date is 29 May 2024, not the match date.
5. [Official play-off explanation](https://www.bundesliga.com/en/bundesliga/news/how-does-promotion-and-relegation-work-in-the-bundesliga-10645).
6. [DFL 2023/24 economic report](https://report.dfl.de/2324/en/_assets/downloads/rep-german-licensed-football-dfl-er24.pdf) — corroborates comeback and penalties; optional further reading, not needed as another public source entry.

Source cautions: the fixture listing presents the return with a combined 5–9 display; do not interpret that as nine match goals. The narrative report explicitly separates 0–3 match goals, 3–3 aggregate and 6–5 penalties. Its first-leg subsection also incorrectly says entry for 2023/24; the main report establishes 2024/25 survival. No conflicting score is selected from those presentation errors.

## Exact proposed insertion

After all three existing paragraphs under `The relegation play-off`, immediately before `Why the run-in has several boundaries`. New H3:

### Historical worked example: Bochum–Fortuna Düsseldorf, 2024

On 23 May 2024, VfL Bochum lost the first leg 0–3 to Fortuna Düsseldorf at the Vonovia Ruhrstadion in Bochum. The return took place on 27 May at the Merkur Spielarena in Düsseldorf. These dates belong to the 2023/24 promotion/relegation play-off, not the current season. [Official fixtures](https://www.bundesliga.com/en/2bundesliga/matchday/2023-2024/relegation), [first-leg match centre](https://www.bundesliga.com/en/bundesliga/matchday/2023-2024/relegation/vfl-bochum-1848-vs-fortuna-duesseldorf/liveticker), [return match centre](https://www.bundesliga.com/en/bundesliga/matchday/2023-2024/relegation/fortuna-duesseldorf-vs-vfl-bochum-1848/liveticker).

Bochum led the return 3–0 after normal time. Adding the two matches gave Bochum 0 + 3 = 3 goals and Düsseldorf 3 + 0 = 3: a 3–3 aggregate tie. Two 15-minute periods of extra time produced no further goal, so the tie went to penalties. [Official match report](https://www.bundesliga.com/en/bundesliga/news/bochum-fortuna-dusseldorf-relegation-play-off-free-highlights-live-blog-27447/), [play-off procedure](https://www.bundesliga.com/en/bundesliga/news/how-does-promotion-and-relegation-work-in-the-bundesliga-10645).

Bochum won the shoot-out 6–5 and retained its Bundesliga place for 2024/25. The shoot-out score is separate from the return's 3–0 match score and the 3–3 aggregate. Do not add those penalties to either club's goals in the two matches. [Official match report](https://www.bundesliga.com/en/bundesliga/news/bochum-fortuna-dusseldorf-relegation-play-off-free-highlights-live-blog-27447/).

The Bundesliga's play-off explanation dates removal of the away-goals rule to 2021/22, before this tie. A tied aggregate therefore required the remaining procedure rather than an away-goals decision. This is a historical example of why the match score, aggregate and shoot-out result answer different questions. [Away-goals and extra-time explanation](https://www.bundesliga.com/en/bundesliga/news/how-does-promotion-and-relegation-work-in-the-bundesliga-10645).

## Metadata and generated effects

Retain both existing sources and add four entries: historical fixture listing, first-leg match centre, return match centre and official retrospective report. Reuse the existing play-off source for the procedure; do not duplicate its source-list entry. Preserve headline, description, category, URL, image/rights fields, author, related IDs and original publication timestamp. Set `updatedAt` to the actual implementation date.

Append: “Revision, [implementation date]: added a sourced historical 2024 relegation play-off example separating match scores, aggregate goals and shoot-out penalties. The original publication date is retained.”

Expected reading time: four to five minutes; final generator result must be checked. Incoming related cards are in Articles 9, 21 and 24. Their bodies/metadata must remain unchanged; implementation requires explicit narrow approval for only Article 23's generated reading-time labels in those protected pages. Home, News, public metadata and sitemap also regenerate. Source files: `.editorial/article-content.js`, `.editorial/news-data.js`; additive authorization/evidence/guards. Do not hand-edit generated HTML.

## Tests after approval

Exact insertion and four paragraphs; preserve original body and prior related-card changes; historical dates/venues and source consistency; 0+3=3, 3+0=3 and penalty distinction; unchanged publication/image/author/related metadata; actual revision date; no-JavaScript/mobile/theme rendering; generator parity; exact reverse-substitution comparisons for protected related cards; every existing content/image/API/raw HTML/browser/preservation suite and `git diff --check`. No APIs, standings calculations, streaming, images or Article 32 changes.
