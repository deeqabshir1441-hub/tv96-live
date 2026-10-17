const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const model = require('./content-model.cjs');
const files = [];
function walk(dir) {
    for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
        if(['.git','.qodo','.vscode'].includes(entry.name)) continue;
        const absolute=path.join(dir,entry.name);
        if(entry.isDirectory())walk(absolute);
        else if(entry.isFile()) {
            const relative=path.relative(root,absolute).replace(/\\/g,'/');
            if(relative.startsWith('.editorial/adsense-')&&relative.endsWith('results.json'))continue;
            const bytes=fs.readFileSync(absolute);
            files.push({path:relative,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
        }
    }
}
walk(root);
const meta=fs.readFileSync(path.join(__dirname,'news-data.js'),'utf8').split('\n');
const bodies=fs.readFileSync(path.join(__dirname,'article-content.js'),'utf8').split('\n');
const paragraphs=new Map();
const articles=model.getPublishedArticles().map(a=>{
    const body=model.articleContent[a.id];
    const text=body.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    for(const m of body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)){const p=m[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();if(p.length<100)continue;paragraphs.set(p,[...(paragraphs.get(p)||[]),a.id]);}
    return {...a,metadataLine:meta.findIndex(l=>l.trim()===`"id": ${a.id},`)+1,bodyLine:bodies.findIndex(l=>l.includes(`"${a.id}":`))+1,generatedPath:`articles/${a.id}.html`,words:a.wordCount,h2:(body.match(/<h2\b/g)||[]).length,internalLinks:[...body.matchAll(/href="(\/[^\"]*)"/g)].map(m=>m[1]),mediaElements:(body.match(/<(?:iframe|video|img)\b/g)||[]).length,visibleTextSha256:crypto.createHash('sha256').update(text).digest('hex')};
});
const report={checkedAt:new Date().toISOString(),files,counts:{files:files.length,published:articles.length,unpublished:model.articles.length-articles.length,sitemap:(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').match(/<loc>/g)||[]).length},articles,exactRepeatedParagraphs:[...paragraphs].filter(([,ids])=>new Set(ids).size>1).map(([text,ids])=>({text,ids})),retirements:require('./article-retirements.cjs')};
fs.writeFileSync(path.join(__dirname,'adsense-local-inventory-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({counts:report.counts,articles:articles.map(a=>({id:a.id,metadataLine:a.metadataLine,bodyLine:a.bodyLine,words:a.words,h2:a.h2,links:a.internalLinks.length})),repeatedParagraphs:report.exactRepeatedParagraphs.length},null,2));
