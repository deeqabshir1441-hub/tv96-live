const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),m=require('./content-model.cjs');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),bh=x=>hash(x.replace(/\r\n/g,'\n')),read=f=>fs.readFileSync(f,'utf8');
const url='https://www.lfp.fr/assets/26_27_LFP_STATUTS_REGLEMENTS_08_09_2026_f2aaaaa325.pdf';
const paragraphs=[
`<a href="${url}#page=121">Article 518 ter of the LFP\u2019s 2026/27 regulations</a> ranks clubs level on points by: overall goal difference; head-to-head points; head-to-head goal difference; overall goals scored; total wins; away wins; the lower disciplinary-points total; and drawing lots. The disciplinary scale assigns one point per warning and three per red card.`,
'For this hypothetical example, assume only Club A and Club B are tied on 50 league points, both have +5 overall goal difference, and both meetings have been played. Every club, total and result here is invented. Club A wins the first meeting 2\u20130, and the return finishes 1\u20131.',
'Step 1: league points are equal. Step 2: overall goal difference is also equal. Step 3: compare head-to-head points. Club A earns 3 + 1 = 4; Club B earns 0 + 1 = 1. Criterion 2 therefore ranks Club A higher. Club B\u2019s greater overall goals-scored total does not override that decision.',
`<a href="${url}#page=121">The same article</a> limits when head-to-head criteria apply: criteria 2 and 3 require both relevant meetings to have been played. Until then, after overall goal difference, criteria 4\u20137 take priority in their listed order: overall goals scored, total wins, away wins and disciplinary points. One completed meeting alone does not activate the head-to-head comparison used above.`
];
const table=`<table aria-label="Hypothetical Ligue 1 two-club tiebreak calculation" style="width:100%;table-layout:fixed;overflow-wrap:anywhere">
<thead><tr><th scope="col">Hypothetical calculation</th><th scope="col">Club A</th><th scope="col">Club B</th></tr></thead>
<tbody>
<tr><th scope="row">League points</th><td>50</td><td>50</td></tr>
<tr><th scope="row">Overall goals scored</th><td>45</td><td>50</td></tr>
<tr><th scope="row">Overall goals conceded</th><td>40</td><td>45</td></tr>
<tr><th scope="row">Overall goal difference</th><td>45 \u2212 40 = <strong>+5</strong></td><td>50 \u2212 45 = <strong>+5</strong></td></tr>
<tr><th scope="row">Points from first meeting</th><td>3</td><td>0</td></tr>
<tr><th scope="row">Points from return meeting</th><td>1</td><td>1</td></tr>
<tr><th scope="row">Head-to-head points</th><td><strong>4</strong></td><td><strong>1</strong></td></tr>
</tbody></table>\n`;
const insertion='<h3>A hypothetical Ligue 1 tiebreak, step by step</h3>\n'+paragraphs.map((p,i)=>'<p>'+p+'</p>\n'+(i===1?table:'')).join('');
const revision='<p><em>Revision, 13 October 2026: added a clearly labeled hypothetical Ligue 1 tiebreak calculation and the unfinished-season head-to-head condition, citing Article 518 ter of the LFP 2026/27 regulations. The original publication date and previous promotion/relegation correction are retained.</em></p>\n';
const anchor='<h2>History and development</h2>',beforeBody=m.articleContent[24];assert.equal(beforeBody.split(anchor).length,2);assert(!beforeBody.includes('A hypothetical Ligue 1 tiebreak'));
const source={name:'LFP: 2026/27 regulations \u2014 Article 518 ter, printed page 121: tiebreaking order and head-to-head applicability.',url};
const e={authorizedAt:'2026-10-13',authorization:'Owner approved exact Article 24 tiebreak insertion and only Article 24 related-card reading-time change in Article 23.',beforeBody,insertion,paragraphs,table,revision,source,beforeBodyHash:bh(beforeBody),afterBodyHash:bh(beforeBody.replace(anchor,insertion+anchor)+revision),articlesBefore:JSON.parse(JSON.stringify(m.articles)),bodyHashesBefore:Object.fromEntries(Object.entries(m.articleContent).map(([id,b])=>[id,bh(b)])),publicFilesBefore:Object.fromEntries(Object.keys(require('./legacy-exclusion-results.json').snapshot.protectedHashes).map(f=>[f,hash(fs.readFileSync(f))])),sourceFilesBefore:Object.fromEntries(['.editorial/article-content.js','.editorial/news-data.js'].map(f=>[f,hash(fs.readFileSync(f))])),article23Before:read('articles/23.html')};
const review=JSON.parse(read('.editorial/p0-review.json')),prior=review.followupRevision.bodies[24];assert.equal(prior.after,e.beforeBodyHash);assert(!prior.revisions);
fs.writeFileSync('.editorial/article-24-tiebreak-evidence.json',JSON.stringify(e,null,2)+'\n');
const f='.editorial/article-content.js';assert(read(f).includes(JSON.stringify(beforeBody)));fs.writeFileSync(f,read(f).replace(JSON.stringify(beforeBody),JSON.stringify(beforeBody.replace(anchor,insertion+anchor)+revision)));
const meta='.editorial/news-data.js',text=read(meta),start=text.indexOf('"id": 24,'),end=text.indexOf('"id": 25,',start);assert(start>=0&&end>start);let section=text.slice(start,end);assert(section.includes('"updatedAt": "2026-10-12"'));
section=section.replace('"updatedAt": "2026-10-12"','"updatedAt": "2026-10-13"');
const last=JSON.stringify(m.articles.find(a=>a.id===24).sources[3].url);assert(section.includes(last));section=section.replace(last+'\n            }',last+'\n            },\n            '+JSON.stringify(source));
fs.writeFileSync(meta,text.slice(0,start)+section+text.slice(end));
prior.revisions=[{authorizedAt:e.authorizedAt,authorization:e.authorization,reason:'Approved hypothetical Article 518 ter calculation; preserve all prior correction text and citations.',before:e.beforeBodyHash,after:e.afterBodyHash}];
fs.writeFileSync('.editorial/p0-review.json',JSON.stringify(review,null,2)+'\n');
console.log('Applied exact approved Article 24 tiebreak addition; original approval record retained.');
