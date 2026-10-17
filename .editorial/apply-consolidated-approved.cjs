// One controlled local implementation of the owner's attached conditional approval.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const m=require('./content-model.cjs');
const read=f=>fs.readFileSync(f,'utf8'),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const evidencePath='.editorial/consolidated-implementation-evidence.json';
assert(!fs.existsSync(evidencePath),'Implementation evidence already exists; do not reapply');
assert.equal(execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),'adsense-readiness-2026-10-11');
function walk(dir='.') {return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{if(['.git','node_modules'].includes(e.name))return [];const f=path.posix.join(dir,e.name);return e.isDirectory()?walk(f):[f];});}
const files=walk(),beforeHashes=Object.fromEntries(files.map(f=>[f,hash(fs.readFileSync(f))]));
const publicFiles=files.filter(f=>!f.startsWith('.editorial/'));
const snapshots=['index.html','about.html','articles/9.html','articles/21.html','articles/23.html','articles/24.html','.editorial/article-content.js','.editorial/news-data.js'];
const beforeTexts=Object.fromEntries(snapshots.map(f=>[f,read(f)]));
const proposal=read('.editorial/ARTICLE_23_BUNDESLIGA_PROPOSAL.md');
const block=proposal.split('### Historical worked example: ')[1].split('\n## Metadata')[0].trim();
const [title,...paragraphs]=block.split(/\r?\n\s*\r?\n/);
assert.equal(paragraphs.length,4);
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const markdown=s=>esc(s).replace(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/g,'<a href="$2">$1</a>');
const insertion='<h3>Historical worked example: '+esc(title)+'</h3>\n'+paragraphs.map(p=>'<p>'+markdown(p)+'</p>\n').join('');
const date='2026-10-17',displayDate='17 October 2026';
const revision='<p><em>Revision, '+displayDate+': added a sourced historical 2024 relegation play-off example separating match scores, aggregate goals and shoot-out penalties. The original publication date is retained.</em></p>\n';
const beforeBody=m.articleContent[23],anchor='<h2>Why the run-in has several boundaries</h2>';
assert.equal(beforeBody.split(anchor).length,2);assert(!beforeBody.includes(title));
const afterBody=beforeBody.replace(anchor,insertion+anchor)+revision;
const links=[...insertion.matchAll(/href="([^"]+)"/g)].map(x=>x[1]);
const sources=[...new Set(links)].filter(url=>!m.articles.find(a=>a.id===23).sources.some(s=>s.url===url)).map(url=>({name:url.includes('/2bundesliga/')?'Bundesliga: official 2023/24 relegation play-off fixtures':url.includes('vfl-bochum-1848-vs-fortuna')?'Bundesliga: Bochum–Fortuna Düsseldorf first-leg match centre, 23 May 2024':url.includes('/liveticker')?'Bundesliga: Fortuna Düsseldorf–Bochum return match centre, 27 May 2024':'Bundesliga: historical Bochum–Fortuna Düsseldorf play-off report, May 2024',url}));
assert.equal(sources.length,4);
const changes=[];
function replace(file,before,after){assert.equal(read(file).split(before).length,2,'Unique authorized replacement '+file);fs.writeFileSync(file,read(file).replace(before,after));changes.push({file,before,after});}
const e={authorizedAt:date,authorization:'Owner attached conditional approval: exact Article 23, Home H1–H3, About A1–A3; no H4; local generation/evidence/guards/tests only.',beforeHashes,publicFiles,beforeTexts,articlesBefore:JSON.parse(JSON.stringify(m.articles)),bodyHashesBefore:Object.fromEntries(Object.entries(m.articleContent).map(([id,b])=>[id,hash(b)])),beforeBody,afterBody,insertion,paragraphs,title,revision,sources,beforeBodyHash:hash(beforeBody),afterBodyHash:hash(afterBody),sourceFiles:{},generatedFiles:{},changes};
fs.writeFileSync(evidencePath,JSON.stringify(e,null,2)+'\n');
replace('.editorial/article-content.js',JSON.stringify(beforeBody),JSON.stringify(afterBody));
const meta='.editorial/news-data.js',text=read(meta),start=text.indexOf('"id": 23,'),end=text.indexOf('"id": 24,',start);
assert(start>=0&&end>start);const original=text.slice(start,end);let section=original;
section=section.replace('"sources": [','"updatedAt": "'+date+'",\n        "sources": [\n'+sources.map(s=>'            '+JSON.stringify(s)+',').join('\n'));
replace(meta,original,section);
replace('index.html','<p>TV96 Live is a large platform built for football fans wherever they are. We provide live match results (Live Scores), fact-based analysis, and the latest transfer market news. Our goal is to connect fans with their teams.</p>','<p>TV96 Live brings together football <a href="/matches">fixtures, scores</a>, <a href="/standings">standings</a> and explanatory guides. Read worked examples of competition rules, compare results with table context, and explore clearly dated reporting in our <a href="/news">News &amp; Guides library</a>. Match data can be delayed or unavailable.</p>\n     <p>Start with our <a href="/articles/12">Premier League guide</a>, learn <a href="/articles/15">how goal difference works</a>, or compare the different survival routes in our <a href="/news">league guides</a>.</p>');
replace('index.html','<div><h2 id="matches-heading">Today&rsquo;s Matches</h2><p>Live scores and upcoming fixtures</p></div>','<div><h2 id="matches-heading">Today&rsquo;s Matches</h2><p>Live scores and upcoming fixtures</p><p>Match lists need JavaScript and an available data feed. If they do not load, read the <a href="/news">News &amp; Guides library</a> or check the competition’s official fixtures.</p></div>');
const about=read('about.html');
const cover=about.match(/<p>Our football coverage may include:<\/p>[\s\S]*?<\/ul>/)[0];
replace('about.html',cover,'<p>TV96 Live currently provides:</p>\n                <ul>\n                    <li>Fixtures, results and score updates for competitions available through our data provider.</li>\n                    <li>League standings with explanations of points, ranking and qualification rules.</li>\n                    <li>Original football explainers with worked examples and links to supporting sources.</li>\n                    <li>Dated reporting archives that identify the sources and period covered.</li>\n                </ul>');
const provider=about.match(/<p>\s*Match information may be obtained[\s\S]*?<\/p>/)[0];
replace('about.html',provider,'<p>Fixtures, scores and standings use football-data.org through TV96 Live’s server-side API routes. The <a href="/standings">Standings page</a> labels provider data and calculations from available results when source metadata is supplied; otherwise, it states that the data source is unavailable.</p>');
replace('about.html','Updated August 2026','Updated '+displayDate);
const review=JSON.parse(read('.editorial/p0-review.json'));
assert.equal(review.bodies[23].after,e.beforeBodyHash);assert(!review.followupRevision.bodies[23]);
review.followupRevision.bodies[23]={authorizedAt:date,authorization:e.authorization,reason:'Exact approved historical example and revision; all original text retained.',before:e.beforeBodyHash,after:e.afterBodyHash};
fs.writeFileSync('.editorial/p0-review.json',JSON.stringify(review,null,2)+'\n');
execFileSync(process.execPath,['.editorial/generate-static.cjs'],{stdio:'inherit'});
for(const f of ['articles/9.html','articles/21.html','articles/24.html']){
 const old=e.beforeTexts[f],card=[...old.matchAll(/<article class="editorial-summary">[\s\S]*?<\/article>/g)].find(x=>x[0].includes('href="/articles/23"'))[0];
 assert(card.includes('4 min read'));assert.equal(read(f),old.replace(card,card.replace('4 min read','5 min read')),'STOP: protected-page scope '+f);
}
const allowed=['index.html','about.html','articles/23.html','articles/9.html','articles/21.html','articles/24.html','news-data.js','news.html','sitemap.xml'];
for(const f of publicFiles){const after=hash(fs.readFileSync(f));if(after!==beforeHashes[f]){assert(allowed.includes(f),'STOP: unexpected public file '+f);e.generatedFiles[f]={before:beforeHashes[f],after};}}
for(const f of ['.editorial/article-content.js','.editorial/news-data.js'])e.sourceFiles[f]={before:beforeHashes[f],after:hash(fs.readFileSync(f))};
e.readingTimeBefore=m.getArticleReadingTime(m.articles.find(a=>a.id===23));
delete require.cache[require.resolve('./content-model.cjs')];const next=require('./content-model.cjs');e.readingTimeAfter=next.getArticleReadingTime(next.articles.find(a=>a.id===23));e.wordCountAfter=next.articles.find(a=>a.id===23).wordCount;
fs.writeFileSync(evidencePath,JSON.stringify(e,null,2)+'\n');
console.log(JSON.stringify({changedPublic:Object.keys(e.generatedFiles),readingTimeBefore:e.readingTimeBefore,readingTimeAfter:e.readingTimeAfter,words:e.wordCountAfter}));
