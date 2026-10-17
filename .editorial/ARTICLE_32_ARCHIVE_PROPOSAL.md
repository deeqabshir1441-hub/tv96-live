# Article 32 archive proposal — approved and implemented

Prepared 11 October 2026. The owner explicitly approved this proposal in this session. The archive notice, revision note and labels have been implemented locally; historical headline, publication date and reporting remain intact. Generated Home/News/article outputs now carry the archive presentation. No deployment occurred.

## Evidence and limits

- The historical publication date is `2026-09-15T20:00:00+03:00`. The headline's age 15 was correct on that date. Manchester United's [official player profile](https://www.manutd.com/en/teams/under-18s-team/joseph-gabriel) gives 6 October 2010 as his birth date, making him 16 on the audit date. The profile's continued presence does not independently establish his registration status or reconciliation.
- [Sky Sports, 6 October 2026, 23:44 UK](https://www.skysports.com/football/news/13595519/jj-gabriel-man-utd-prodigy-still-expected-to-leave-despite-first-team-photo-inclusion-this-is-how-it-unfolded) reported that he remained registered then, reconciliation attempts had made no progress, and the subsequently released squad photograph had been taken on 8 September. Attribute these as dated reporting; they do not prove an outcome on 11 October. Do not import that article's family motives, transfer predictions, legal assertions or fixture descriptions without independent verification.
- [BBC's newer report](https://www.bbc.co.uk/sport/football/articles/cmde8n8j0dn4o) was directly retrieved with HTTP 200. Its structured publication/revision timestamps are both `2026-10-05T19:13:15.047Z`. It attributes continuing registration and unsuccessful reconciliation to its reporting and club-side sources. Its relative birthday wording is not a reliable independent chronology; use the official birth date. Search snippets and mirrors were not used as substitutes for the original article.
- The published September story's future Brighton appearance, birthday and ongoing negotiations are time-bound. Its award, training, internal club discussions, Giggs and private-registration assertions remain attributed historical claims; this follow-up has not independently reverified every one. No official cancellation, completed transfer or reconciliation announcement was verified. Absence of an announcement is not evidence that nothing changed.
- Homepage: there is no literal "Breaking news" banner on the homepage. It promotes this story first, with a present-tense headline and `Manchester United / Latest News` category. The article itself has `articleType: "Breaking news"`. Both presentations merit a dated archive treatment.

## Proposed published change

Keep URL `/articles/32`, the historical publication timestamp, original headline/age, existing sources, image and article count. Change the category to `Manchester United / Archived Reports`, section to `Archived Reports`, and article type to `Archived report` in `.editorial/news-data.js`. Proposed description:

> Archived report first published 15 September 2026: BBC Sport reported that JJ Gabriel had requested cancellation of his Manchester United registration. This account describes the situation reported at that time.

Prepend this notice to the body in `.editorial/article-content.js`:

> Archived report — first published 15 September 2026. Ages, fixture expectations and attributed statements below describe that date. This page does not establish Gabriel's registration status today. Manchester United lists his date of birth as 6 October 2010; he turned 16 on 6 October 2026.

Link the birth-date sentence to the official profile. Add an explicit revision note and `updatedAt` only using the actual approved implementation date; retain `publishedAt`. Generated homepage/News cards must carry the archive category and original visible publication date. Verify that homepage prominence clearly indicates a historical story; removing it from the lead is a separate owner choice, not part of this proposed minimal archive correction. Regenerate static pages and rerun content/raw HTML/browser checks. If the approved source-revision registry requires a new revision record, add a documented record for the approved archive notice; do not weaken integrity checks.

Alternative: a separately dated, attributed update could cite Sky's 6 October report and the club's birth-date profile, explicitly stating that no later outcome was verified. That would be a more material story revision and needs separate approval. Neither option silently changes historical age 15 to 16 or fabricates a completed departure.

Approval was obtained because the user explicitly reserved material published-story changes. Implementation date: 11 October 2026. The original P0 revision record is preserved; a separate follow-up hash record in `p0-review.json` records the authorized notice. `article-32-archive-check.cjs` additionally verifies that the historical reporting is byte-identical after removing the new notice and revision note.
