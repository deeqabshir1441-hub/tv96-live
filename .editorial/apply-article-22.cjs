const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),m=require('./content-model.cjs');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),bh=x=>hash(x.replace(/\r\n/g,'\n')),read=f=>fs.readFileSync(f,'utf8');
const url='https://files.figc.it/version/c%3AZmUzYzk0MzUtMzU0Zi00%3AYTk3YzZiZGEtYmExYi00/244%20-%20Deroga%20art.%2051%20NOIF%20-%20Determinazione%20classifica%20Campionato%20Serie%20A%20ss%202026%20-%202027.pdf';
const paragraphs=[
`<a href="${url}">FIGC\u2019s regulation 244/A</a> applies to 2026/27. Clause i provides a single-match play-off for two teams tied for the championship, hosted by the better mini-table-ranked club. A draw after normal time goes directly to penalties, without extra time.`,
'Clause ii provides a two-leg play-off for a final 17th/18th-place points tie. The better mini-table-ranked club hosts the second leg. The higher aggregate goals total wins; an aggregate tie goes directly to penalties, without extra time. Clause iv provides an exception.',
'The mini-table criteria listed in clause iii are, in order: points in matches among the tied clubs; goal difference in those matches; overall league goal difference; overall league goals scored; and drawing lots.',
'For a hypothetical example, assume only Club A and Club B finish tied on 37 points at the survival boundary and neither is a UEFA finalist. All clubs, totals and results here are invented. Club A wins their first league meeting 2\u20130; the return finishes 1\u20131.',
'Step 1: confirm the final points tie. Step 2: count their head-to-head points: Club A earns 3 + 1 = 4; Club B earns 0 + 1 = 1. Step 3: Club A therefore hosts the second leg. That hosting advantage does not award survival; the play-off still decides it.',
`<a href="${url}">Under clause iv</a>, if a club involved is a finalist in a UEFA competition, the championship or survival decision instead follows the clause iii mini-table criteria. The play-off procedure is replaced, rather than merely rescheduled.`
];
const table=`<table aria-label="Hypothetical Serie A survival-tie hosting calculation" style="width:100%;table-layout:fixed;overflow-wrap:anywhere">
<thead><tr><th scope="col">Hypothetical calculation</th><th scope="col">Club A</th><th scope="col">Club B</th></tr></thead>
<tbody>
<tr><th scope="row">Final league points</th><td>37</td><td>37</td></tr>
<tr><th scope="row">Points from first meeting</th><td>3</td><td>0</td></tr>
<tr><th scope="row">Points from return meeting</th><td>1</td><td>1</td></tr>
<tr><th scope="row">Head-to-head points</th><td><strong>4</strong></td><td><strong>1</strong></td></tr>
<tr><th scope="row">Play-off hosting order</th><td>Second leg</td><td>First leg</td></tr>
</tbody></table>\n`;
const insertion='<h3>Which ties require a play-off in 2026/27?</h3>\n'+paragraphs.map((p,i)=>'<p>'+p+'</p>\n'+(i===3?table:'')).join('');
const revision='<p><em>Revision, 13 October 2026: added the 2026/27 championship and survival tiebreak provisions, a clearly labeled hypothetical hosting calculation and the UEFA-finalist exception, citing FIGC regulation 244/A. The original publication date and historical context are retained.</em></p>\n';
const anchor='<h2>Europe and the second division</h2>',beforeBody=m.articleContent[22];assert.equal(beforeBody.split(anchor).length,2);assert(!beforeBody.includes('Which ties require'));
const source={name:'FIGC: 2026/27 regulation 244/A \u2014 championship and survival ties, mini-table criteria and UEFA-finalist exception, clauses i\u2013iv',url};
const historicalLabel='Historical context: Lega Serie A \u2014 2025/26 Lecce\u2013Cremonese survival scenario; not authority for the 2026/27 procedure';
const e={authorizedAt:'2026-10-13',authorization:'Owner approved exact Article 22 addition and only generated Article 22 related-card reading-time change in Article 21.',beforeBody,insertion,paragraphs,table,revision,source,historicalLabel,beforeBodyHash:bh(beforeBody),afterBodyHash:bh(beforeBody.replace(anchor,insertion+anchor)+revision),articlesBefore:JSON.parse(JSON.stringify(m.articles)),bodyHashesBefore:Object.fromEntries(Object.entries(m.articleContent).map(([id,b])=>[id,bh(b)])),publicFilesBefore:Object.fromEntries(Object.keys(require('./legacy-exclusion-results.json').snapshot.protectedHashes).map(f=>[f,hash(fs.readFileSync(f))])),sourceFilesBefore:Object.fromEntries(['.editorial/article-content.js','.editorial/news-data.js'].map(f=>[f,hash(fs.readFileSync(f))])),article21Before:read('articles/21.html')};
const review=JSON.parse(read('.editorial/p0-review.json'));assert.equal(review.bodies[22].after,e.beforeBodyHash);assert(!review.followupRevision.bodies[22]);
fs.writeFileSync('.editorial/article-22-revision-evidence.json',JSON.stringify(e,null,2)+'\n');
const f='.editorial/article-content.js';fs.writeFileSync(f,read(f).replace(JSON.stringify(beforeBody),JSON.stringify(beforeBody.replace(anchor,insertion+anchor)+revision)));
const meta='.editorial/news-data.js',text=read(meta),start=text.indexOf('"id": 22,'),end=text.indexOf('"id": 23,',start);assert(start>=0&&end>start);let section=text.slice(start,end);assert(section.includes('"updatedAt": "2026-09-22"'));
section=section.replace('"updatedAt": "2026-09-22"','"updatedAt": "2026-10-13"').replace('"sources": [','"sources": [\n            '+JSON.stringify(source)+',').replace('Lega Serie A: relegation play-off context',historicalLabel);
fs.writeFileSync(meta,text.slice(0,start)+section+text.slice(end));
review.followupRevision.bodies[22]={authorizedAt:e.authorizedAt,authorization:e.authorization,reason:'Exact approved FIGC rules, hypothetical table and exception; preserve every earlier paragraph.',before:e.beforeBodyHash,after:e.afterBodyHash};
fs.writeFileSync('.editorial/p0-review.json',JSON.stringify(review,null,2)+'\n');
console.log('Applied exact approved Article 22 addition and additive authorization.');
