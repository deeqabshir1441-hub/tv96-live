const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const evidenceFile = path.join(__dirname, 'legacy-exclusion-results.json');
const priorPlan = require('./article-32-image-replacement-evidence.json');
const candidates = priorPlan.unusedDeploymentCandidates.map(a => a.path);
assert.equal(candidates.length, 19);
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => {
    if (['.git','.editorial','.qodo','.vscode','node_modules'].includes(e.name)) return [];
    const file=path.join(dir,e.name); return e.isDirectory()?walk(file):[path.relative(root,file).replaceAll('\\','/')];
  });
}
const publicFiles = walk(root);
const sourceFiles = publicFiles.filter(f => /\.(html|js|css|json|xml|svg|txt)$/i.test(f));
const hits=[];
for(const file of sourceFiles) fs.readFileSync(path.join(root,file),'utf8').split(/\r?\n/).forEach((line,i)=>{
  let text; try{text=decodeURIComponent(line);}catch{text=line;}
  text=text.replace(/\\\//g,'/').replace(/\\x20|\\u0020/g,' ').toLowerCase();
  // Provider league/10.png is a separate external resource, not news image/10.png.
  text=text.replace(/https?:\/\/[^\s"'<>`]+/g,url=>/^https?:\/\/(?:www\.)?tv96live\.org\//.test(url)?url:'');
  for(const asset of candidates) {
    const name=path.basename(asset).toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const basename=new RegExp('(^|[^a-z0-9_.-])'+name+'(?=$|[^a-z0-9_.-])');
    if(text.includes(asset.toLowerCase()) || basename.test(text) || (asset.startsWith('news image/') && text.includes('news image'))) hits.push({file,line:i+1,asset});
  }
});
assert.deepEqual(hits,[], 'Legacy filename/directory fragments occur in deployed code; inspect dynamic construction before exclusion');
const model=require('./content-model.cjs');
const article32=JSON.parse(JSON.stringify(model.articles.find(a=>a.id===32)));
const snapshot={article32, article32BodyHash:crypto.createHash('sha256').update(model.articleContent[32]).digest('hex'), protectedHashes:Object.fromEntries(publicFiles.map(f=>[f,hash(f)])), candidates:candidates.map(f=>({path:f,sha256:hash(f)}))};
if(process.argv.includes('--snapshot')) {
  fs.writeFileSync(evidenceFile,JSON.stringify({snapshotAt:new Date().toISOString(),snapshot},null,2)+'\n');
  console.log(`PASS: ${sourceFiles.length} public static/generated/CSS/JS/data/SVG files scanned, 19 candidates have no full-path, basename or directory-fragment references; preservation snapshot saved.`);
} else (async()=>{
  const baseline=JSON.parse(fs.readFileSync(evidenceFile,'utf8'));
  assert.deepEqual(snapshot.article32,baseline.snapshot.article32,'Article 32 metadata changed');
  assert.equal(snapshot.article32BodyHash,baseline.snapshot.article32BodyHash,'Article 32 body changed');
  const article24Revision = require('./article-24-revision-evidence.json');
  for(const [file,digest] of Object.entries(baseline.snapshot.protectedHashes)) if(file!=='.vercelignore') {
    const standingsRevision = require('./standings-source-revision.json');
    const approval = file === 'standings.html' ? {before:standingsRevision.beforeRaw,after:standingsRevision.afterRaw} : article24Revision.generatedFiles?.[file];
    if(approval) assert.equal(approval.before,digest,`Article 24 revision baseline: ${file}`);
    const article3Approval = require('./article-3-revision-evidence.json').generatedFiles[file];
    if(article3Approval) assert.equal(article3Approval.before,approval?.after || digest,`Article 3 preserves prior approved public baseline: ${file}`);
    const article9Approval = require('./article-9-revision-evidence.json').generatedFiles[file];
    if(article9Approval)assert.equal(article9Approval.before,article3Approval?.after || approval?.after || digest,`Article 9 preserves prior approved public baseline: ${file}`);
    assert.equal(hash(file),require('./article-21-preservation.cjs').file(file,article9Approval?.after || article3Approval?.after || approval?.after || digest),`Public file changed/deleted: ${file}`);
  }
  for(const a of baseline.snapshot.candidates) assert.equal(hash(a.path),a.sha256,`Legacy original changed/deleted: ${a.path}`);
  const rules=fs.readFileSync(path.join(root,'.vercelignore'),'utf8').split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('#'));
  assert.deepEqual(rules,['.editorial/',...candidates], 'Only the 19 exact approved legacy paths may be newly excluded');
  const server=http.createServer(require('./static-server.cjs'));
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`, active=new Set();
  try {
    for(const asset of candidates) assert.equal((await fetch(origin+'/'+asset.split('/').map(encodeURIComponent).join('/'))).status,404,`Excluded asset served: ${asset}`);
    for(const file of sourceFiles.filter(f=>/\.(html|css|js|json)$/i.test(f))) {
      const text=fs.readFileSync(path.join(root,file),'utf8');
      for(const m of text.matchAll(/(?:src|poster)=["']([^"']+)["']|url\(\s*["']?([^)'"\s]+)["']?\s*\)/g)) {
        const value=m[1]||m[2]; if(/^(https?:|data:|#|\/\/)/.test(value)||value.includes('${')||! /\.(png|webp|jpe?g|svg|gif|ico|avif)(?:\?|$)/i.test(value))continue;
        active.add(new URL(value,origin+'/'+file).pathname);
      }
      for(const m of text.matchAll(/["'](\/[A-Za-z0-9_ /().-]+\.(?:png|webp|jpe?g|svg))["']/g))active.add(new URL(m[1],origin).pathname);
    }
    for(const icon of JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8')).icons) active.add(new URL(icon.src,origin+'/manifest.json').pathname);
    for(const route of active) assert.equal((await fetch(origin+route)).status,200,`Active local image/CSS resource broken: ${route}`);
    baseline.checkedAt=new Date().toISOString();baseline.result={status:'pass',publicFilesScanned:sourceFiles.length,unusedPaths:candidates,referenceHits:hits,localExcludedUrls404:19,activeLocalResourceUrls200:active.size,article32AndPublicFilesPreserved:true,all19OriginalsPreserved:true,limit:'Static/directory-fragment analysis plus current render regression; does not prove absence of historical external links or production cache copies. Local server models Vercel exclusions; no deployment.'};
    fs.writeFileSync(evidenceFile,JSON.stringify(baseline,null,2)+'\n');
    console.log(`PASS: 19 exclusions return local 404; ${active.size} active local resource URLs return 200; all public files, Article 32 metadata/body/images and 19 original files unchanged.`);
  } finally {await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
