// Unmocked, read-only production DOM checks. No video playback or ad clicks.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawn} = require('node:child_process');
const pause = ms => new Promise(r=>setTimeout(r,ms));
const origin = 'https://www.tv96live.org';
const temp = fs.mkdtempSync(path.join(os.tmpdir(),'tv96-live-audit-'));
let browser, socket;
(async()=>{
    const executable = ['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p=>fs.existsSync(p));
    if(!executable) throw Error('No installed Chromium');
    browser=spawn(executable,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${temp}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
    const portFile=path.join(temp,'DevToolsActivePort');
    for(let i=0;i<100&&!fs.existsSync(portFile);i++) await pause(100);
    const port=fs.readFileSync(portFile,'utf8').split('\n')[0];
    const target=await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'}).then(r=>r.json());
    socket=new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
    let seq=0;const pending=new Map();let events=[];
    function send(method,params={}) {return new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method));},20000);pending.set(id,{resolve:r=>{clearTimeout(timer);resolve(r);},reject:e=>{clearTimeout(timer);reject(e);}});socket.send(JSON.stringify({id,method,params}));});}
    socket.onmessage=event=>{const m=JSON.parse(event.data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')events.push({type:'exception',message:m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text});else if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')events.push({type:'console',message:m.params.args.map(a=>a.value||a.description).join(' ')});else if(m.method==='Network.loadingFailed')events.push({type:'network',message:m.params.errorText});else if(m.method==='Network.responseReceived'&&m.params.response.status>=400)events.push({type:'http',status:m.params.response.status,url:m.params.response.url});};
    for(const method of ['Page.enable','Runtime.enable','Network.enable'])await send(method);
    const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;};
    const routes=process.argv.includes('--home-only') ? ['/'] : ['/','/news','/matches','/standings','/about','/contact','/privacy','/terms','/watch-live',...require('./content-model.cjs').getPublishedArticles().map(a=>'/articles/'+a.id)];
    const results=[];
    for(const width of [1440,360]){
        await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===360});
        for(const route of routes){
            events=[];
            try {
                const nav=await send('Page.navigate',{url:origin+route});
                for(let i=0;i<60;i++){if(await evaluate(`location.origin===${JSON.stringify(origin)}&&location.pathname===${JSON.stringify(route)}&&document.readyState!=='loading'`))break;await pause(100);}
                await pause(1800);
                const state=await evaluate(`({url:location.href,title:document.title,canonical:document.querySelector('[rel=canonical]')?.href,robots:document.querySelector('meta[name=robots]')?.content,bodyText:document.body.innerText,overflow:document.documentElement.scrollWidth>innerWidth+1,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>({url:i.currentSrc||i.src,id:i.id,src:i.getAttribute('src'),visible:!!i.getBoundingClientRect().width&&!!i.getBoundingClientRect().height})),links:[...document.querySelectorAll('.nav-menu a')].map(a=>a.href),videoCount:document.querySelectorAll('video').length,cmpPresent:typeof window.__tcfapi==='function',fundingChoices:!!window.googlefc,scriptSources:[...document.scripts].map(s=>s.src).filter(Boolean)})`);
                let navigation;
                if(width===360){navigation=await evaluate(`(()=>{const b=document.getElementById('menuToggle');if(!b)return {missing:true};b.click();const opened=b.getAttribute('aria-expanded');const visible=[...document.querySelectorAll('.nav-menu a')].filter(a=>a.getBoundingClientRect().width>0).length;document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));return {opened,visible,closed:b.getAttribute('aria-expanded')};})()`);}
                results.push({route,width,navError:nav.errorText,...state,navigation,events:[...events]});
            }catch(e){results.push({route,width,error:e.message,events:[...events]});}
        }
        console.log(`Production DOM checks completed at ${width}px`);
    }
    fs.writeFileSync(path.join(__dirname,process.argv.includes('--home-only') ? 'adsense-home-browser-results.json' : 'adsense-live-browser-results.json'),JSON.stringify({checkedAt:new Date().toISOString(),mode:'Unmocked live Chromium; fresh profile, no geographic emulation; timed observation, third-party/ad delivery not guaranteed',results},null,2)+'\n');
    console.log(JSON.stringify({pages:results.length,errors:results.filter(r=>r.error||r.navError).map(r=>({route:r.route,width:r.width,error:r.error||r.navError})),overflow:results.filter(r=>r.overflow).map(r=>({route:r.route,width:r.width})),brokenImages:results.filter(r=>r.brokenImages?.length).map(r=>({route:r.route,width:r.width,images:r.brokenImages})),exceptions:results.filter(r=>r.events?.some(e=>e.type==='exception')).map(r=>({route:r.route,events:r.events}))},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{socket?.close();browser?.kill();});
