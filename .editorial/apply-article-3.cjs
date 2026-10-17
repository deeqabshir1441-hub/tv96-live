// One-time implementation of the owner's exact Article 3 proposal.
const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const model = require('./content-model.cjs');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const bodyHash = text => hash(text.replace(/\r\n/g, '\n'));
const beforeBody = model.articleContent[3];
const heading = '<h2>A worked example: Netherlands–Argentina, 2022</h2>';
assert(!beforeBody.includes(heading), 'Approved example already implemented');
const insertion = heading + '\n' +
  '<p>Start with a defined counting window: one match, the Netherlands–Argentina quarter-final at the FIFA World Cup Qatar 2022 on 9 December 2022. FIFA’s match report records Nahuel Molina’s goal in the 35th minute, with Lionel Messi credited as the assister. On page 5, Messi’s row contains 1 in the AS column, which the report defines as Assist. <a href="https://fdp.fifa.org/assetspublic/ce44/r2859/pdf/FullTimeMatchReport-English.pdf">FIFA match report</a></p>\n' +
  '<p>To reproduce this example, first confirm that the fixture was a knockout match, then locate the goal event and check the player’s assist column. For a dataset containing only this fixture and using FIFA’s recorded credits, Messi’s total is one knockout assist. That is a match-specific result, not his tournament or career total.</p>\n' +
  '<p>The count and the description answer different questions. Opta Analyst discusses Messi’s pass to Molina as a line-breaking pass into the penalty area; that describes the play rather than adding another assist. Stats Perform also distinguishes conventional Goal Assist from broader Fantasy Assist categories. Name the source and category when comparing totals instead of assuming that every database counts the same events. <a href="https://theanalyst.com/articles/lionel-messi-world-cup-stats-argentina-2022-final">Opta analysis</a>, <a href="https://www.statsperform.com/opta-event-definitions/">Opta definitions</a></p>\n';
const revision = '<p><em>Revision, 12 October 2026: added a reproducible Netherlands–Argentina 2022 knockout-assist example, distinguishing FIFA’s recorded credit from Opta’s analysis and Stats Perform’s event definitions. The original publication date and previous correction notice are retained.</em></p>\n';
const anchor = '<h2>Compare opportunities as well as totals</h2>';
assert.equal(beforeBody.split(anchor).length, 2);
const afterBody = beforeBody.replace(anchor, insertion + anchor) + revision;
const files = Object.keys(require('./legacy-exclusion-results.json').snapshot.protectedHashes);
const evidence = {
  authorizedAt: '2026-10-12', authorization: 'Owner explicitly approved the exact Article 3 worked example, citations and dated revision in this session.',
  beforeBody, insertion, revision, beforeBodyHash: bodyHash(beforeBody), afterBodyHash: bodyHash(afterBody),
  articlesBefore: JSON.parse(JSON.stringify(model.articles)),
  bodyHashesBefore: Object.fromEntries(Object.entries(model.articleContent).map(([id,body])=>[id,bodyHash(body)])),
  publicFilesBefore: Object.fromEntries(files.map(file=>[file,hash(fs.readFileSync(file))]))
};
fs.writeFileSync('.editorial/article-3-revision-evidence.json', JSON.stringify(evidence,null,2)+'\n');
const contentFile = '.editorial/article-content.js';
const content = fs.readFileSync(contentFile,'utf8');
assert(content.includes(JSON.stringify(beforeBody)));
fs.writeFileSync(contentFile,content.replace(JSON.stringify(beforeBody),JSON.stringify(afterBody)));
const metaFile = '.editorial/news-data.js';
let metadata = fs.readFileSync(metaFile,'utf8');
const start = metadata.indexOf('"id": 3,');
const end = metadata.indexOf('"id": 4,', start);
assert(start>=0 && end>start);
let section = metadata.slice(start,end);
assert(section.includes('"updatedAt": "2026-09-06"'));
section = section.replace('"updatedAt": "2026-09-06"','"updatedAt": "2026-10-12"');
const sources = [
  {name:'FIFA: Netherlands–Argentina 2022 full-time match report (pages 2 and 5)',url:'https://fdp.fifa.org/assetspublic/ce44/r2859/pdf/FullTimeMatchReport-English.pdf'},
  {name:'Opta Analyst: contemporary analysis of Messi’s pass to Molina',url:'https://theanalyst.com/articles/lionel-messi-world-cup-stats-argentina-2022-final'},
  {name:'Stats Perform: Opta event definitions — Goal Assist and Fantasy Goal Assist',url:'https://www.statsperform.com/opta-event-definitions/'}
];
section = section.replace('"sources": [','"sources": [\n'+sources.map(s=>'            '+JSON.stringify(s)).join(',\n')+',');
fs.writeFileSync(metaFile,metadata.slice(0,start)+section+metadata.slice(end));
const reviewFile = '.editorial/p0-review.json';
const review = JSON.parse(fs.readFileSync(reviewFile,'utf8'));
assert.equal(evidence.beforeBodyHash,review.bodies[3].after);
assert(!review.followupRevision.bodies[3]);
review.followupRevision.bodies[3] = {authorizedAt:evidence.authorizedAt,authorization:evidence.authorization,reason:'Add exact owner-approved reproducible single-match assist example and revision note; preserve all earlier paragraphs/correction and original metadata.',before:evidence.beforeBodyHash,after:evidence.afterBodyHash};
fs.writeFileSync(reviewFile,JSON.stringify(review,null,2)+'\n');
console.log('Applied approved Article 3 insertion, source list and dated authorization.');
