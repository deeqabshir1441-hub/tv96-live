// Owner-approved Article 21 insertion; RFEF source gate verified before execution.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const model=require('./content-model.cjs');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const bodyHash=x=>hash(x.replace(/\r\n/g,'\n'));
const read=f=>fs.readFileSync(f,'utf8');
const url='https://rfef.es/sites/default/files/pdf/circulares/1._Circular_84_-_CNL_Primera_y_Segunda_Division___Anexo.pdf?cb=6df81e55';
const insertion=`<h3>The 2026/27 final-table rules</h3>
<p><a href="${url}">Article 10 of RFEF\u2019s 2026/27 competition regulations</a> gives this order for two clubs finishing level on points: goal difference in their league matches against each other; overall league goal difference; overall goals scored; fair-play ranking; and, if necessary, a match on neutral ground.</p>
<p>For three or more tied clubs, first compare points earned in matches among those clubs, then goal difference in those matches, overall league goal difference, overall goals scored and fair-play ranking, with a neutral-ground match as the final listed mechanism. This is a separate procedure, not a series of isolated two-team comparisons.</p>
<h3>A hypothetical worked example: head-to-head before overall GD</h3>
<p>These invented figures illustrate the 2026/27 two-club rule; they are not real results. Assume only Club A and Club B finish level on 60 points. Club A wins their first league meeting 2\u20130, and Club B wins the return 1\u20130.</p>
<table aria-label="Hypothetical two-club final-table tiebreak calculation" style="width:100%;table-layout:fixed;overflow-wrap:anywhere">
<thead><tr><th scope="col">Measure</th><th scope="col">Club A</th><th scope="col">Club B</th></tr></thead>
<tbody>
<tr><th scope="row">Final league points</th><td>60</td><td>60</td></tr>
<tr><th scope="row">Overall league GD</th><td>+5</td><td>+20</td></tr>
<tr><th scope="row">Goals scored against the other club</th><td>2</td><td>1</td></tr>
<tr><th scope="row">Goals conceded against the other club</th><td>1</td><td>2</td></tr>
<tr><th scope="row">Head-to-head GD</th><td>2 \u2212 1 = <strong>+1</strong></td><td>1 \u2212 2 = <strong>\u22121</strong></td></tr>
</tbody></table>
<p>Start with the equal league points, then apply the first tiebreaker. Club A\u2019s head-to-head goal difference is +1 and Club B\u2019s is \u22121, so Club A ranks above Club B. The procedure stops there: Club B\u2019s better overall goal difference does not override the first criterion.</p>
<p>Article 10 addresses the final classification. While the season is underway, the relevant head-to-head fixtures may be incomplete. An interim table should not be treated as proof of the eventual tiebreak outcome; check its provider\u2019s explanation and the official standings.</p>
`;
const revision='<p><em>Revision, 13 October 2026: added the 2026/27 final-table tiebreaking order and a clearly labeled hypothetical calculation, citing Article 10 of the RFEF competition regulations. The original publication date is retained.</em></p>\n';
const beforeBody=model.articleContent[21],anchor='<h2>European places and relegation</h2>';
assert.equal(beforeBody.split(anchor).length,2);assert(!beforeBody.includes('<h3>The 2026/27'));
const afterBody=beforeBody.replace(anchor,insertion+anchor)+revision;
const source={name:'RFEF: 2026/27 Primera and Segunda Division competition regulations - Article 10, pages 6-7',url};
const e={authorizedAt:'2026-10-13',authorization:'Owner approved Article 21 insertion subject to official RFEF PDF verification; gate passed before editing.',sourceVerification:{url,verifiedAt:'2026-10-13',cover:'Circular 84 has a 2025/2026 cover heading; operative publication paragraph and attached title explicitly identify 2026/2027.',seasonClauses:['Article 1, printed page 3','Article 4(2), printed page 4'],ruleClauses:['Article 10, two-team paragraph (a)-(e), printed page 6','Article 10, multi-team paragraph (a)-(f), printed page 7'],limitation:'Final-table rules only; no universal interim provider sorting rule established.'},beforeBody,insertion,revision,source,beforeBodyHash:bodyHash(beforeBody),afterBodyHash:bodyHash(afterBody),articlesBefore:JSON.parse(JSON.stringify(model.articles)),bodyHashesBefore:Object.fromEntries(Object.entries(model.articleContent).map(([id,b])=>[id,bodyHash(b)])),publicFilesBefore:Object.fromEntries(Object.keys(require('./legacy-exclusion-results.json').snapshot.protectedHashes).map(f=>[f,hash(fs.readFileSync(f))])),sourceFilesBefore:Object.fromEntries(['.editorial/article-content.js','.editorial/news-data.js'].map(f=>[f,hash(fs.readFileSync(f))]))};
const p='.editorial/p0-review.json',review=JSON.parse(read(p));
assert.equal(review.bodies[21].after,e.beforeBodyHash);assert(!review.followupRevision.bodies[21]);
review.followupRevision.bodies[21]={authorizedAt:e.authorizedAt,authorization:e.authorization,reason:'Exact owner-approved 2026/27 rules and hypothetical calculation after RFEF source gate; preserve all existing paragraphs and metadata.',before:e.beforeBodyHash,after:e.afterBodyHash};
fs.writeFileSync('.editorial/article-21-revision-evidence.json',JSON.stringify(e,null,2)+'\n');
const bodyFile='.editorial/article-content.js';assert(read(bodyFile).includes(JSON.stringify(beforeBody)));
fs.writeFileSync(bodyFile,read(bodyFile).replace(JSON.stringify(beforeBody),JSON.stringify(afterBody)));
const metaFile='.editorial/news-data.js',metadata=read(metaFile),start=metadata.indexOf('"id": 21,'),end=metadata.indexOf('"id": 22,',start);
assert(start>=0&&end>start);let section=metadata.slice(start,end);
assert(section.includes('"updatedAt": "2026-09-22"'));
section=section.replace('"updatedAt": "2026-09-22"','"updatedAt": "2026-10-13"').replace('"sources": [','"sources": [\n            '+JSON.stringify(source)+',');
fs.writeFileSync(metaFile,metadata.slice(0,start)+section+metadata.slice(end));
fs.writeFileSync(p,JSON.stringify(review,null,2)+'\n');
console.log('Applied approved Article 21 insertion, citation, dated revision and additive authorization record.');
