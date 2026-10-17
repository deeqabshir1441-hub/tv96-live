// One-time implementation of the owner-approved historical Article 9 example.
const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const model = require('./content-model.cjs');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const bodyHash = text => hash(text.replace(/\r\n/g,'\n'));
const beforeBody = model.articleContent[9];
const heading = '<h2>Historical worked example: Manchester United’s 2024/25 Europa League draw</h2>';
assert(!beforeBody.includes(heading),'Example already implemented');
const insertion = heading + '\n' +
  '<p>Start with the competition and season. UEFA’s Europa League league-phase draw on 30 August 2024 assigned Manchester United four home opponents—Rangers, PAOK, Bodø/Glimt and Twente—and four away opponents—Porto, Fenerbahçe, Viktoria Plzeň and FCSB. Those allocations established opponents and home-or-away status, not the order or dates of United’s matches. <a href="https://www.uefa.com/uefaeuropaleague/news/0290-1bbc3ce94923-e3a70688bbdd-1000--europa-league-league-phase-draw-contenders-set-for-competitions-new-era/">UEFA draw results</a></p>\n' +
  '<p>Next, check the separate schedule. UEFA’s draw instructions said the calendar would be available on 31 August 2024. Its published match calendar lists United at home to Twente on Wednesday 25 September and away to Porto on Thursday 3 October. The draw announcement and match calendar therefore answer different questions: who and where, then when. <a href="https://www.uefa.com/uefaeuropaleague/news/028e-1b11797faef1-56c7d70b74aa-1000--uefa-europa-league-league-phase-draw/">UEFA draw procedure</a>, <a href="https://editorial.uefa.com/resources/0290-1bbea0181c18-c9285f327c80-1000/draw_results_-_uefa_-_uel_-_league_phase_draw_fixtures_by_matchday.pdf">UEFA match calendar</a></p>\n' +
  '<p>Then bring domestic fixtures into the comparison. United’s club coverage confirms a home Premier League match against Tottenham on 29 September and an away match at Aston Villa on 6 October. Porto on 3 October sits between those domestic dates. That identifies a sequence worth examining, without establishing the team’s travel arrangements or exact recovery time. <a href="https://www.manutd.com/en/news/erik-ten-hag-names-team-to-face-tottenham-on-29-september">United’s Tottenham coverage</a>, <a href="https://www.manutd.com/en/news/every-word-from-erik-ten-hag-press-conference-after-aston-villa-0-man-utd-0-on-6-october-2024">United’s Villa coverage</a></p>\n' +
  '<p>Finally, keep interpretation separate from confirmation. An away European fixture between domestic matches raises questions about preparation and rotation; it does not prove fatigue, predict a lineup or guarantee a result. This is a dated 2024/25 example of the checklist, not a fixture announcement for the current season.</p>\n';
const revision = '<p><em>Revision, 12 October 2026: added a sourced historical Europa League example distinguishing draw allocations, the separate match calendar and domestic fixture context. The original publication date and previous correction notice are retained.</em></p>\n';
const anchor = '<h2>Use the right competition rules</h2>';
assert.equal(beforeBody.split(anchor).length,2);
const afterBody = beforeBody.replace(anchor,insertion+anchor)+revision;
const sourceNames = [
  'UEFA: historical 2024/25 Europa League draw results (30 August 2024)',
  'UEFA: 2024/25 Europa League draw procedure and announced calendar-release date',
  'UEFA: published 2024/25 Europa League match calendar (PDF; no independently verified publication timestamp)',
  'Manchester United: Tottenham coverage (29 September 2024)',
  'Manchester United: Aston Villa coverage (6 October 2024)'
];
const sources = [...insertion.matchAll(/href="([^"]+)"/g)].map((m,i)=>({name:sourceNames[i],url:m[1]}));
assert.equal(sources.length,5);
const read = file=>fs.readFileSync(file,'utf8');
const evidence = {
  authorizedAt:'2026-10-12',authorization:'Owner approved the exact Article 9 historical example, five source links, comparison citation label and dated revision in this session.',
  beforeBody,insertion,revision,beforeBodyHash:bodyHash(beforeBody),afterBodyHash:bodyHash(afterBody),sources,
  articlesBefore:JSON.parse(JSON.stringify(model.articles)),
  bodyHashesBefore:Object.fromEntries(Object.entries(model.articleContent).map(([id,body])=>[id,bodyHash(body)])),
  publicFilesBefore:Object.fromEntries(Object.keys(require('./legacy-exclusion-results.json').snapshot.protectedHashes).map(file=>[file,hash(fs.readFileSync(file))])),
  sourceFilesBefore:Object.fromEntries(['.editorial/article-content.js','.editorial/news-data.js'].map(file=>[file,hash(fs.readFileSync(file))]))
};
fs.writeFileSync('.editorial/article-9-revision-evidence.json',JSON.stringify(evidence,null,2)+'\n');
const contentFile = '.editorial/article-content.js';
assert(read(contentFile).includes(JSON.stringify(beforeBody)));
fs.writeFileSync(contentFile,read(contentFile).replace(JSON.stringify(beforeBody),JSON.stringify(afterBody)));
const metaFile = '.editorial/news-data.js';
const metadata = read(metaFile),start=metadata.indexOf('"id": 9,'),end=metadata.indexOf('"id": 10,',start);
assert(start>=0&&end>start);
let section=metadata.slice(start,end);
assert(section.includes('"updatedAt": "2026-09-06"'));
section=section.replace('"updatedAt": "2026-09-06"','"updatedAt": "2026-10-12"');
section=section.replace('"sources": [','"sources": [\n'+sources.map(s=>'            '+JSON.stringify(s)).join(',\n')+',');
section=section.replace('UEFA: 2026/27 draw announcement and separate fixture-list confirmation','Comparison reading only: UEFA 2026/27 Champions League draw announcement; not evidence for the Europa League example');
fs.writeFileSync(metaFile,metadata.slice(0,start)+section+metadata.slice(end));
const reviewFile='.editorial/p0-review.json',review=JSON.parse(read(reviewFile));
assert(!review.bodies[9]&&!review.followupRevision.bodies[9]);
const context=vm.createContext({});
vm.runInContext(execFileSync('git',['show',review.baseCommit+':.editorial/article-content.js'],{encoding:'utf8'})+'\nglobalThis.baselineBody=articleContent[9];',context);
assert.equal(bodyHash(context.baselineBody),evidence.beforeBodyHash,'Preserve P0-era Article 9 baseline');
review.bodies[9]={authorizedAt:evidence.authorizedAt,authorization:evidence.authorization,reason:'Owner-approved historical worked example and dated revision; all prior Article 9 paragraphs/correction retained.',before:evidence.beforeBodyHash,after:evidence.afterBodyHash};
fs.writeFileSync(reviewFile,JSON.stringify(review,null,2)+'\n');
console.log('Applied exact approved Article 9 example, source list and dated body authorization.');
