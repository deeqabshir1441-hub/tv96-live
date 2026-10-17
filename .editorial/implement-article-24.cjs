// Owner-authorized correction, 12 October 2026. Run once against the approved prior text.
const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const model = require('./content-model.cjs');
const hash = s => crypto.createHash('sha256').update(s.replace(/\r\n/g, '\n')).digest('hex');
const old = [
  'The clubs finishing 17th and 18th go down automatically. The team in 16th enters a promotion-relegation play-off against the winner of the Ligue 2 play-off route. That opponent is not necessarily the club that finished third in the second division.',
  'Under the established Ligue 2 route, clubs finishing third, fourth and fifth contest the play-off pathway before its winner faces the Ligue 1 side. The top two Ligue 2 clubs gain automatic promotion. Check the current official schedule for the dates and tie arrangements.'
];
const replacement = [
  'Under the LFP’s 2026/27 regulations, the clubs finishing 17th and 18th in Ligue 1 are relegated automatically. Ligue 2’s top two clubs gain automatic promotion, subject to meeting Ligue 1 participation requirements. Ligue 1’s 16th-placed club faces the Ligue 2 playoff winner over two legs.',
  'The Ligue 2 playoffs involve the clubs finishing third, fourth and fifth. Fifth plays away at fourth in a single match; the winner then plays away at third in another single match. The winner advances to the promotion-relegation playoff, with the Ligue 2 club hosting the first leg and the Ligue 1 club the return. Exceptional interruption and reinstatement provisions can affect final outcomes.'
];
const note = '<p><em>Revision, 12 October 2026: verified the promotion, relegation and playoff pathway against Articles 519 and 519 ter of the official LFP 2026/27 regulations and the official 2026/27 Ligue 2 calendar. The original publication date is retained.</em></p>\n';
let body = model.articleContent[24];
for (let i = 0; i < 2; i++) {
  assert.equal(body.split(old[i]).length, 2, 'Approved prior paragraph must occur exactly once');
  body = body.replace(old[i], replacement[i]);
}
body = body.replace('<h2>Relegation and the play-off route</h2>', note + '<h2>Relegation and the play-off route</h2>');
const before = model.articles.find(a => a.id === 24);
const snapshot = {
  authorizedAt: '2026-10-12',
  bodies: Object.fromEntries(Object.entries(model.articleContent).map(([id, text]) => [id, hash(text)])),
  article24: JSON.parse(JSON.stringify(before)),
  article32: JSON.parse(JSON.stringify(model.articles.find(a => a.id === 32))),
  article32Page: hash(fs.readFileSync('articles/32.html', 'utf8')),
  article32Images: Object.fromEntries(['png','webp'].map(ext => [ext, crypto.createHash('sha256').update(fs.readFileSync('images/articles/jj-gabriel.' + ext)).digest('hex')])),
  replacement, revisionNote: note, beforeBody: model.articleContent[24]
};
fs.writeFileSync('.editorial/article-24-revision-evidence.json', JSON.stringify(snapshot, null, 2) + '\n');
const contentFile = '.editorial/article-content.js';
const content = fs.readFileSync(contentFile, 'utf8');
assert(content.includes(JSON.stringify(model.articleContent[24])));
fs.writeFileSync(contentFile, content.replace(JSON.stringify(model.articleContent[24]), JSON.stringify(body)));
const metaFile = '.editorial/news-data.js';
let metadata = fs.readFileSync(metaFile, 'utf8');
const start = metadata.indexOf('"id": 24');
const end = metadata.indexOf('"id": 25', start);
let section = metadata.slice(start, end);
section = section.replace('"sources": [', '"updatedAt": "2026-10-12",\n        "sources": [\n            {\n                "name": "LFP: 2026/27 regulations — Article 519 (promotion/relegation), Article 519 ter (playoff format)",\n                "url": "https://www.lfp.fr/assets/26_27_LFP_STATUTS_REGLEMENTS_08_09_2026_f2aaaaa325.pdf"\n            },\n            {\n                "name": "LFP: official 2026/27 Ligue 2 calendar and playoff pathway",\n                "url": "https://www.lfp.fr/article/ligue-2-bkt-le-calendrier-de-la-saison-2026-2027"\n            },');
section = section.replace('Ligue 1: survival and relegation positions', 'Historical context (2024): Ligue 1 survival and relegation positions');
section = section.replace('Ligue 1: the Ligue 2 play-off route', 'Historical context (11 May 2026, 2025/26 season): Ligue 2 play-off route');
fs.writeFileSync(metaFile, metadata.slice(0, start) + section + metadata.slice(end));
const reviewFile = '.editorial/p0-review.json';
const review = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
assert.equal(review.bodies[24].after, hash(model.articleContent[24]));
review.followupRevision.bodies[24] = {
  authorizedAt: '2026-10-12',
  authorization: 'Owner approved the exact two-paragraph Article 24 correction and revision note in this session.',
  reason: 'Verify current-season promotion/relegation under LFP 2026/27 Articles 519 and 519 ter; retain unrelated text and original publication metadata.',
  before: hash(model.articleContent[24]), after: hash(body)
};
fs.writeFileSync(reviewFile, JSON.stringify(review, null, 2) + '\n');
console.log('Applied approved Article 24 correction and recorded authorization; no Article 32 changes.');
