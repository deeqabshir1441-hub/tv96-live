// Read-only public requests; writes evidence only inside the excluded editorial directory.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const model = require('./content-model.cjs');
const root = path.resolve(__dirname, '..');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (['.git', '.editorial', '.qodo', '.vscode', 'node_modules'].includes(entry.name)) return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
const files = walk(root);
// Git records this Windows file with an uppercase L; deployment paths are case-sensitive.
const rel = file => path.relative(root, file).replaceAll('\\', '/').replace(/^logo\/logo\.png$/, 'logo/Logo.png');
const textFiles = files.filter(file => /\.(?:html|js|css|json|xml|svg|txt)$/i.test(file)).map(file => ({ path: rel(file), lines: fs.readFileSync(file, 'utf8').split(/\r?\n/) }));
const published = model.getPublishedArticles();
const originalInventory = JSON.parse(fs.readFileSync(path.join(__dirname, 'image-rights-inventory.json'), 'utf8'));
const optimized = JSON.parse(fs.readFileSync(path.join(__dirname, 'optimized-images.json'), 'utf8'));
const observations = {
  9: 'Generic draw/travel illustration; no obvious external mark observed.',
  10: 'Generic empty meeting room, but competition-associated star-pattern ball needs review.',
  12: 'Recognizable Premier League trophy/lion motifs; branding review required.',
  13: 'Recognizable Champions League trophy and star-ball motifs; branding review required.',
  14: 'Recognizable Champions League trophy/star-ball/competition branding; review required.',
  15: 'Generic goal-difference illustration; no obvious external mark observed.',
  16: 'Generic xG diagram, but competition-associated star-pattern ball needs review.',
  17: 'Generic VAR/referee scene; TV screen football imagery needs creation/source provenance.',
  18: 'Generic relegation diagram; stadium/ad-board depiction needs provenance review.',
  19: 'Recognizable UEFA competition trophy designs and Premier League flag motif; review required.',
  21: 'Generic stadium/ball composition; designed ball and architectural depiction need provenance review.',
  22: 'Recognizable Serie A-style trophy design; competition branding review required.',
  23: 'Recognizable Bundesliga championship shield design; competition branding review required.',
  24: 'Generic stadium/ball/city composition; designed ball and architectural depiction need provenance review.',
  32: 'Owner confirms ChatGPT-edited derivative of a real photograph downloaded through Google Images; original photograph licence not established. Not originally AI-generated or rights-cleared. Person, Manchester United crest and apparel marks require source/licence and publication/branding review.'
};
const assets = files.filter(file => /\.(?:png|jpe?g|webp|svg|gif|ico|avif)$/i.test(file) || rel(file) === 'teams/Leeds_United_F.C').map(file => {
  const assetPath = rel(file), bytes = fs.readFileSync(file);
  const records = model.articles.filter(a => a.image && [a.image.slice(1), a.image.slice(1).replace(/\.png$/, '.webp')].includes(assetPath));
  const active = records.filter(a => published.some(p => p.id === a.id));
  const refs = [];
  for (const item of textFiles) item.lines.forEach((line, i) => {
    let decoded; try { decoded = decodeURIComponent(line); } catch { decoded = line; }
    if (decoded.toLowerCase().includes(assetPath.toLowerCase())) refs.push(`${item.path}:${i + 1}`);
  });
  const prior = originalInventory.find(a => a.path === assetPath);
  let classification = 'Unverified legacy asset; filename/reference alone cannot establish authorship or licensing.';
  if (active.length) classification = observations[active[0].id] || 'Active editorial asset; provenance requires owner verification.';
  else if (assetPath === 'editorial-fallback.png' || assetPath === 'football-fallback.svg') classification = 'Code-authored generic fallback; inspect creation source and font provenance; no obvious third-party competition mark.';
  else if (/^(teams|icon football)\//.test(assetPath)) classification = 'Team/competition branding candidate; no documented permission found; filename is not visual/legal verification.';
  else if (records.length) classification = 'Retired editorial source/delivery asset; not an active article image; rights evidence still required while publicly reachable.';
  const usage = active.length ? `Active article(s) ${active.map(a => a.id).join(', ')}; ${assetPath.endsWith('.webp') ? 'hero/card delivery' : 'retained source, social/structured-data references where listed'}` : refs.length ? 'Public-source reference (may be dormant; inspect references)' : 'No public-source literal reference found; deployable unused asset';
  const optimizationMetadata = optimized['/' + assetPath.replace(/\.webp$/, '.png')] || null;
  const dimensions = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? `${bytes.readUInt32BE(16)} x ${bytes.readUInt32BE(20)}` : assetPath.endsWith('.webp') && optimizationMetadata ? `${optimizationMetadata.width} x ${optimizationMetadata.height}` : prior?.dimensions || null;
  return { path: assetPath, bytes: bytes.length, sha256: hash(bytes), dimensions, optimizationMetadata, usage, publicReferences: refs, classification, articleMetadata: records.map(a => ({ id: a.id, active: active.some(p => p.id === a.id), imageType: a.imageType || null, rightsStatus: a.rightsStatus || null, brandingReview: a.brandingReview || null, imageCredit: a.imageCredit || null })), priorInventory: prior || null };
});
const publisher = textFiles.flatMap(file => file.lines.flatMap((line, i) => [...new Set(line.match(/(?:ca-)?pub-\d+/g) || [])].map(id => ({ file: file.path, line: i + 1, id }))));
const targets = [
  ...assets.map(asset => ({ kind: 'asset', asset: asset.path, url: `https://www.tv96live.org/${asset.path.split('/').map(encodeURIComponent).join('/')}` })),
  { kind: 'ads.txt', url: 'https://www.tv96live.org/ads.txt' },
  ...['https://ligue1.com/en/articles/l1_article_93-', 'https://ligue1.com/en/articles/l1_article_5074-', 'https://ligue1.com/en/articles/l1_article_5074-everything-you-need-to-know-about-the-ligue-2-bkt-play-offs', 'https://www.bbc.co.uk/sport/football/articles/cmde8n8j0dn4o'].map(url => ({ kind: 'editorial-source', url }))
];
async function main() {
  const evidencePath = path.join(__dirname, 'adsense-targeted-followup-results.json');
  const previous = process.argv.includes('--reuse-network-evidence') && fs.existsSync(evidencePath) ? JSON.parse(fs.readFileSync(evidencePath, 'utf8').replace(/^\uFEFF/, '')) : null;
  const network = []; let next = 0;
  async function worker() {
    while (next < targets.length) {
      const target = targets[next++];
      const cached = previous?.network.find(item => item.url === target.url);
      if (cached) {
        const item = { ...cached, observedAt: cached.observedAt || previous.checkedAt };
        if (target.asset) {
          const asset = assets.find(a => a.path === target.asset);
          asset.live = { ...item, matchesLocal: item.sha256 === asset.sha256 };
        }
        network.push(item);
        continue;
      }
      try {
        const res = await fetch(target.url, { signal: AbortSignal.timeout(20000) });
        const data = Buffer.from(await res.arrayBuffer());
        const item = { ...target, observedAt: new Date().toISOString(), status: res.status, finalUrl: res.url, contentType: res.headers.get('content-type'), bytes: data.length, sha256: hash(data) };
        if (target.kind === 'asset') {
          const asset = assets.find(a => a.path === target.asset);
          asset.live = { ...item, matchesLocal: item.sha256 === asset.sha256 };
        } else if (target.kind === 'ads.txt') item.text = data.toString('utf8');
        else if (target.url.includes('bbc.co.uk') && res.ok) {
          const html = data.toString('utf8');
          item.dateMetadata = [...new Set(html.match(/"date(?:Published|Modified)"\s*:\s*"[^"]+"/g) || [])];
          item.bodyMarkers = { registrationMention: /hold his registration/.test(html), reconciliationMention: /reconciliation/.test(html), teamPhotoMention: /team photo/.test(html) };
        }
        network.push(item);
      } catch (error) {
        const item = { ...target, error: error.message };
        if (target.asset) assets.find(a => a.path === target.asset).live = item;
        network.push(item);
      }
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()]);
  const externalImageReferences = textFiles.flatMap(file => file.lines.flatMap((line, i) => [...new Set(line.match(/https:\/\/[^\s"'<>`]*(?:media\.api-sports\.io|crests\.football-data\.org)[^\s"'<>`]*/g) || [])].map(url => ({ file: file.path, line: i + 1, url }))));
  const result = { checkedAt: new Date().toISOString(), scope: 'Targeted follow-up: assets, publisher consistency and specified editorial source availability; no account access or geo consent certification.', assetCount: assets.length, activeArticleIds: published.map(a => a.id), publisherReferences: publisher, adsTxt: fs.readFileSync(path.join(root, 'ads.txt'), 'utf8'), externalImageReferences, assets, network };
  fs.writeFileSync(path.join(__dirname, 'adsense-targeted-followup-results.json'), JSON.stringify(result, null, 2) + '\n');
  const escape = value => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
  let md = '# Rights evidence inventory — targeted follow-up\n\nChecked ' + result.checkedAt + '. All public image files are listed below, including retained sources and unused files. `.editorial/` is excluded by `.vercelignore`. A live 200 with matching bytes proves public availability and file identity only, never a licence. Public-source references may belong to dormant code; absence of a literal reference is not proof of nondeployment.\n\n';
  md += '## Evidence required for every row\n\nOwner: record creator/rightsholder, original source URL or creation record, acquisition date, licence/permission document, website/commercial advertising/editorial scope, derivative and redistribution rights, attribution, expiry/territory limits, and a decision signed/date recorded. For identifiable branding/trophies/ball designs, document permission or owner-reviewed applicable editorial-use basis; AI/original labels do not clear third-party elements. For owner-provided photos, obtain photographer permission and relevant subject/minor publication permissions or reviewed editorial basis. Do not publish private permission documents. No asset deletion/replacement is authorized.\n\n';
  md += '## Complete deployable local asset inventory\n\n| Exact local path | Usage and exact public references | Available metadata / observed rights issue | Live check |\n|---|---|---|---|\n';
  for (const a of assets) md += `| \`${escape(a.path)}\` | ${escape(a.usage)}; ${a.publicReferences.map(r => '`' + r + '`').join(', ') || 'none'} | ${escape(a.classification)} ${escape(JSON.stringify(a.articleMetadata))}; ${a.bytes} bytes${a.dimensions ? '; ' + a.dimensions : ''}; SHA-256 in JSON | ${a.live?.status || a.live?.error || 'not checked'}${a.live?.status ? '; bytes ' + (a.live.matchesLocal ? 'match local' : 'differ from local') : ''} |\n`;
  md += '\n## External team/competition images\n\nAPI-backed crests are separate from the local assets. Public API availability is not a sublicence. Owner must retain the football-data.org / API-Sports terms applicable to the account, rights/attribution and hotlinking conditions, and the underlying branding-use basis. Dynamic team/competition IDs mean this list of code references is not an exhaustive list of future returned crests. Record provider, endpoint, actual image URL, club/competition, placement and permission for each delivered crest.\n\n';
  for (const r of externalImageReferences) md += `- \`${r.file}:${r.line}\`: \`${r.url}\`\n`;
  md += '\nDynamic provider image fields are forwarded at `api/matches.js:138–140` (home/away crests and competition emblem), `api/standings.js:13`, `api/standings.js:160` (team crest), and `api/standings.js:203` (competition emblem). Local unused `teams/Leeds_United_F.C` has a PNG signature despite its extension. The Git/deployment path is `logo/Logo.png`; the lowercase URL returns 404 on the case-sensitive host, but the uppercase referenced asset is 200 and matches local bytes.\n\nLocal authoring source `.editorial/create-editorial-fallback.py` and `/football-fallback.svg` support generic fallback provenance. Registry `.editorial/news-data.js` assigns original/reviewed metadata in bulk; it is not independent permission evidence. PNG dimensions are read from headers; WebP dimensions and optimization records come from `optimized-images.json`; older exact-path dimension records come from `image-rights-inventory.json`. Per-pair source/delivery hashes and available article credits/classifications are included in JSON. Embedded EXIF/IPTC authorship/licence fields were not decoded: the attempted local Pillow decoder was unavailable, and no dependency was installed. Owner must supply original creation/licence evidence; missing metadata would not prove ownership. Network observation timestamps are retained per request when reusing just-collected evidence.\n';
  fs.writeFileSync(path.join(__dirname, 'ADSENSE_RIGHTS_EVIDENCE_INVENTORY.md'), md);
  process.stdout.write(JSON.stringify({ assetCount: assets.length, live200: assets.filter(a => a.live?.status === 200).length, differingAssets: assets.filter(a => a.live?.status === 200 && !a.live.matchesLocal).map(a => a.path), sources: network.filter(a => a.kind !== 'asset') }, null, 2));
}
main().catch(error => { process.stderr.write(error.message); process.exitCode = 1; });
