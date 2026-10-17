# Article 32 image replacement and deployment-exclusion review

11 October 2026, Africa/Nairobi. Existing branch: `adsense-readiness-2026-10-11`.

**Status: prepared for review; no new image created, no image substituted, no exclusion applied.** The owner confirms that the existing JJ Gabriel image is a ChatGPT-edited derivative of a real photograph downloaded through Google Images. No licence for that original photograph has been established. The PNG and its WebP derivative are neither originally AI-generated assets nor rights-cleared photographs. The existing `user-provided` classification describes how the file arrived; it does not establish permission. The source now records the confirmed provenance and `imageReviewRequired: true` privately, without altering generated public outputs.

## Every active use of the existing pair

| File / location | Existing use | Required future change |
|---|---|---|
| `.editorial/news-data.js:830` | Article 32 central `image` source points to `/images/articles/jj-gabriel.png`; adjacent alt/credit/provenance fields describe the current image. | Switch to a reviewed, independently created source asset and accurate generic alt/credit. Do not claim the old derivative was original. |
| `.editorial/news-data.js`, `editorialImageRegistry[32]` | Registers the PNG for Article 32. | Switch this entry to the same new source path. |
| `.editorial/optimized-images.json:154` | Source/delivery hashes, dimensions and byte counts for the old PNG/WebP pair. | Generate the new pair's real record; remove the old pair's active manifest entry while preserving it in the private historical evidence. Never invent hashes. |
| `news-data.js:511` | Generated public Article 32 metadata: `/images/articles/jj-gabriel.webp`, image alt and credit. | Regenerate from central sources; private rights fields stay excluded. |
| `index.html:88` | Raw HTML homepage lead image, eagerly loaded. | Regenerate to the new WebP and generic alt text. |
| `index.html:848`, central `renderHomeFeatured`/`renderHomeStory` | JavaScript homepage rendering reads the same generated Article 32 image metadata. | The same metadata update changes the enhanced homepage; no independent hardcoded substitution needed. |
| `news.html:209` | Raw HTML Article 32 News card, lazy-loaded. | Regenerate the new WebP and generic alt text. |
| `news.html:472`, central `renderNewsCard` | Filtering/pagination renders image from public metadata. | Regenerated metadata supplies the new image across categories/pages. |
| `articles/32.html:15` | Absolute Open Graph image URL. | Generator must emit `https://www.tv96live.org/images/articles/football-academy-generic.webp`. |
| `articles/32.html:19` | Article JSON-LD `image` property. | Emit the same absolute new WebP URL; preserve headline and `datePublished`. |
| `articles/32.html:332` | Article hero image and existing likeness/club alt text. | Regenerate the generic WebP hero and generic alt text. |
| `.editorial/generate-static.cjs` | Derives delivery path from source PNG and emits hero, OG, JSON-LD, public metadata and raw Home/News cards. | No generator code change needed for a normal new PNG/WebP pair. |
| `.editorial/optimize-article-images.cjs` | Selects Article 32 from the content model; writes its delivery asset/manifest. | Use `--article=32` only after the approved source image exists. |
| `.editorial/image-rights-check.cjs` | Validates image registry, manifest parity, WebP inventory and allowed public references. | Apply the narrow staged check change so retained, excluded old files are not treated as active assets; require both exclusions and zero old public references. |

Home and News **page-level OG images already use `/editorial-fallback.png`**, not the JJ Gabriel image. There is no separate Twitter image tag for this pair, and `sw.js` does not explicitly precache either filename. Browser/third-party/social caches may nevertheless retain previously fetched responses. Article 10's related link is text-only; changing Article 32 image metadata should not change Article 10 or other article outputs. No image appears inside Article 32's trusted body string: its hero comes from the template/generator.

`article-32-image-replacement-evidence.json` records exhaustive literal path references present at preparation time, classified as public source/output versus excluded private source/test/report, and the old pair's hashes. Six public literal image references were found: Home, News, public metadata, Article 32 OG, JSON-LD and hero. Private historical audits/JSON results contain documentary references, not additional deployed image placements. Keep those old evidence references clearly historical; do not rewrite the baseline to imply clearance. The original PNG has no public markup reference but was publicly reachable as a static file in the preceding audit.

## Proposed new asset — creation not authorized yet

Proposed filenames: `images/articles/football-academy-generic.png` and `images/articles/football-academy-generic.webp`. Neither file has been created. A supplied asset must meet the same brief and have documented provenance/usable publication permission. Do not rename an unrelated existing photograph, crop/blur the old image, use it as a reference, or feed it into an editing/generation request.

Proposed independent creation brief:

> Create a new, generic football editorial illustration from this text alone. A plain unbranded football, simple training cones and an empty fictional training pitch under soft floodlights. Calm navy and teal palette, clear graphic composition, 3:2 landscape, 1536 × 1024. No people, faces, portraits, silhouettes or identifiable player likenesses. No jerseys, club/sponsor logos, badges, lettering, trophies, brand names or watermarks. Use simple conventional ball panels with no star-ball or distinctive branded ball design. Do not reproduce a real stadium. This is an abstract illustration of football development, not a depiction of JJ Gabriel or an actual reported scene. Do not use any uploaded image, Google Images photograph, existing JJ Gabriel asset or image-to-image reference.

Proposed alt text: `Generic editorial illustration of a football, training cones and an empty pitch; no player depicted`.

Proposed credit for a genuinely new commissioned/generated illustration: `New generic editorial illustration created for TV96 Live; illustrative, not a photograph of JJ Gabriel`.

The staged source patch sets `original-editorial`, `reviewed` and `brandingReview: clear` **only for that new asset after independent creation/provenance and visual review**. These values do not apply to the current derivative and are not approval guarantees. If the owner supplies a third-party illustration instead, revise its classification/credit to the actual source and licence before applying any patch. Preserve the prompt/creation record, tool/date and final asset hashes privately. Review the actual output for inadvertent logos/design copying; the brief alone cannot establish the result is suitable.

## Exact staged changes and order

Review artifacts:

- `ARTICLE_32_IMAGE_REPLACEMENT.patch`: changes only Article 32's image metadata and its registry entry. Contains no story edit. Syntax/context checked with `git apply --check`; **not applied**.
- `ARTICLE_32_OLD_MANIFEST_RETIREMENT.patch`: removes only the old pair's active optimization record. Apply before optimizing the new asset so its actual record is subsequently added; old metadata remains in private historical evidence. Checked with `git apply --check`; **not applied**.
- `ARTICLE_32_IMAGE_CHECK_UPDATE.patch`: narrowly exempts the retained old WebP from active inventory parity while requiring both old paths to be excluded and absent from generated editorial outputs. All active image/manifest checks remain. Checked with `git apply --check`; **not applied**.
- `ARTICLE_32_DEPLOYMENT_EXCLUSIONS.proposed`: complete proposed `.vercelignore` contents, preserving `.editorial/`, excluding unused legacy images and the old Article 32 pair. **Not copied to `.vercelignore`**.

After explicit authorization of creation/substitution and the proposed exclusions, or receipt of a suitable asset with instruction to use it:

1. Create/receive the independently sourced illustration, inspect it and record provenance. Save the approved source at the proposed PNG path. Keep both old local files untouched. No approved new file means stop before applying the patch; never publish references to a missing asset.
2. Apply the reviewed Article 32 metadata/registry patch. Keep its headline, URL `/articles/32`, `publishedAt: 2026-09-15T20:00:00+03:00`, archive labels/notice, body, current revision date and cited reporting intact. A purely illustrative image change is not a new publication date or story update.
3. Apply the staged manifest-retirement patch, which removes **only** `/images/articles/jj-gabriel.png` from the active optimization manifest. Run `node .editorial/optimize-article-images.cjs --article=32`. This selects only Article 32 and adds its new real manifest record. Inspect the resulting WebP at its real bounded dimensions and review the new hashes/byte counts; other manifest entries must remain unchanged. Retain the old record in private historical inventory evidence. Do not delete old image files.
4. Apply the staged image-check patch and the approved `.vercelignore` contents in the same prepared change set. Both old Article 32 paths must be excluded together. Applying their exclusions while the current public references remain would break images; substitution and exclusions must be atomic in any later authorized release.
5. Run `node .editorial/generate-static.cjs`. Expected substantive generated changes are `articles/32.html`, `index.html`, `news.html` and public `news-data.js`. No shared template/API/AdSense change is needed. Sitemap, Article 10 and every other article should remain byte-identical; inspect and stop on unrelated differences.
6. Run generation `--check`, content validation, image checks, the archive preservation check, raw HTML and browser checks. Compare Article 32's original title/date/body hash with the captured evidence. Confirm no old path in any public HTML/JS/metadata, all new image URLs exist, OG/JSON-LD agree, mobile cards/hero have correct crops and alt text, and all 16 articles/redirects remain intact. The retained old WebP is excluded only under the explicitly checked exception, not a blanket orphan exemption.
7. Review the prepared deployment file set without deploying. A later owner-authorized preview must verify that excluded paths are absent/unavailable, including URL-encoded spaces, while the new image works. An ignore file governs future deployment uploads; it does not erase existing production responses, old deployment snapshots or social caches. Recheck canonical old URLs and any owner-controlled caches after an separately authorized release.

## Unused legacy photos and proposed exclusions

No current public HTML/JS/CSS/JSON/XML/SVG has a literal or URL-decoded reference to the following 19 files. Suppressed `imageCandidate` paths are private inside already excluded `.editorial/`. Existing audit evidence shows these files were publicly reachable despite being unused. No new live request was needed for this preparation; timestamps remain in the preceding targeted evidence. Static scanning is not proof that no external site links to them or that historical pages/caches never used them.

| Exact path(s) | Finding and proposed action |
|---|---|
| `news image/GettyImages-2166876546-2-scaled.jpg` | Visually inspected football celebration photograph, with branded kits/trophy. Getty-named file and baseline agency classification; no underlying licence supplied. Exclude through `news image/`; preserve locally. |
| `news image/GettyImages-2262861156.jpg.webp` | Visually inspected football portrait photograph. Getty-named file and baseline agency classification; no underlying licence supplied. Exclude through `news image/`; preserve locally. |
| `news image/fergusan.jpg`, `news image/images.jpg` | Visually inspected portrait/referee photography; no original source/licence established. Exclude through `news image/`; preserve locally. |
| `news image/1.jpg`, `news image/2.jpeg`, `news image/3.jpg`, `news image/4.jpg`, `news image/5.jpg`, `news image/6.webp`, `news image/7.webp`, `news image/8.png`, `news image/9.png`, `news image/10.png`, `news image/11.png` | Legacy suppressed/retired image candidates. Their records establish neither original authorship nor permission; not all are independently authenticated as photographs. Whole-folder exclusion covers photographic, edited and composite variants without asserting every file is third-party photography. |
| `banner/omar.jpg` | Visually inspected photographic referee/promotional composite with federation/competition marks; source/permission unknown. Proposed exact-file exclusion. |
| `banner/hero.jpg` | Visually inspected football-player composite/illustration with brand-like kit marks; generation/photographic derivation unknown. Proposed exact-file exclusion, not a claim that it is original or licensed. |
| `banner/banner.jpg` | Visually inspected football/pitch image, source/permission unknown. Proposed exact-file exclusion. |
| `banner/banner1.jpg` | Visually inspected generic football illustration, creation/licence unknown. Proposed exact-file exclusion as an unused unverified legacy asset, not a proven third-party photo. |

The broad `news image/` exclusion covers exactly 15 current files; exact paths, bytes/hashes and reference checks are recorded in `article-32-image-replacement-evidence.json`. This is an exclusion proposal, not an authorization to delete or apply it. Other team/competition icons, active illustrations, site logos and the dormant Watch poster `banner/poster .png` remain outside this targeted proposal. Do not blanket-exclude `banner/`, which would include a referenced poster. Their preexisting rights questions remain in the full inventory, not silently resolved here.

## Files changed now versus files requiring later changes

Changed now: `.editorial/news-data.js` (private provenance comment and review-required flag only); `.editorial/adsense-targeted-followup.cjs` (accurate owner-confirmed classification); regenerated private `ADSENSE_RIGHTS_EVIDENCE_INVENTORY.md` and `adsense-targeted-followup-results.json` using already collected network evidence; `ADSENSE_FINAL_ACTION_PLAN.md` receives a superseding rights note. New preparation script, evidence JSON, this plan and four staged patch/proposal files live only in excluded `.editorial/`.

Later replacement requires central image metadata/registry, new PNG/WebP files, the one optimization-manifest entry, narrowly scoped image-check changes, `.vercelignore` exclusions and the four generated public outputs listed above. **No Article 32 body/archive/headline/date edit, other story change, sitemap edit, API/streaming/AdSense setting change or commit is required.**

## Unresolved questions / authorization

- Original photograph source URL, photographer/agency, acquisition details and licence/derivative-publication scope remain unknown. Google Images discovery and ChatGPT editing do not supply that evidence. No rights clearance is claimed for either current file.
- No replacement asset or permission to create one has been provided. The generic brief and staged source patch await that authorization; actual output provenance and visual review are still required.
- Deployment exclusions have been proposed, not approved/applied. Previous production exposure remains until a separately authorized deployment and verification; retaining files locally does not remove public copies.
- Agency identifiers/licence documents for the Getty-named files and other legacy photo/composite sources remain unresolved. Filename/visual inspection is not a definitive rightsholder determination.
- Other active image/brand rights and regional CMP/account checks from the final action plan remain unresolved. **Hold AdSense re-review.** A technical regression pass does not authorize publishing the current derivative or establish full-site rights.

Verification performed for this preparation: generation `--check`, Article 32 archive preservation, image-registry/hash checks, patch dry checks, unused-reference scan and public-output/asset integrity comparisons. No published output or image asset was changed.
