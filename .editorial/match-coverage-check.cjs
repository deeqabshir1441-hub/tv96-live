// Isolated clocks and upstream mocks: never uses production credentials/network.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const codes = ['WC','CL','BL1','DED','BSA','PD','FL1','ELC','PPL','EC','SA','PL'];
const names = ['FIFA World Cup','UEFA Champions League','Bundesliga','Eredivisie','Campeonato Brasileiro Série A','La Liga','Ligue 1','Championship','Primeira Liga','European Championship','Serie A','Premier League'];
const clubs = { PD: ['Getafe','Mallorca'], SA: ['Udinese','Lecce'], BL1: ['Mainz','Augsburg'], FL1: ['Nantes','Toulouse'] };
function fixture(code, id, utcDate = '2026-09-23T15:00:00Z', status = 'FINISHED') {
    const [home, away] = clubs[code] || ['Home '+code, 'Away '+code];
    return { id, utcDate, status, competition: { code, name: code, emblem: '/league.png' }, homeTeam: { name: home, crest: '/home.png' }, awayTeam: { name: away, crest: '/away.png' }, score: { fullTime: { home: 2, away: 1 } } };
}
function harness() {
    let time = Date.parse('2026-09-23T20:00:00Z'), calls = [];
    let reply = async () => ({ ok: true, status: 200, json: async () => ({ matches: [] }) });
    class Clock extends Date { constructor(...args) { super(...(args.length ? args : [time])); } static now() { return time; } }
    const context = vm.createContext({ Date: Clock, Intl, URL, AbortSignal, process: { env: { FOOTBALL_DATA_TOKEN: 'test-secret' } }, console,
        fetch: async (url, options) => { calls.push({ url: new URL(url), options }); return reply(url, options); }
    });
    vm.runInContext(read('api/matches.js').replace('export default async function handler', 'async function handler') + '\nglobalThis.test = { handler, matchOverrides, SUPPORTED_COMPETITIONS };', context);
    return { calls, context, advance(ms) { time += ms; }, setTime(value) { time = Date.parse(value); },
        success(matches) { reply = async () => ({ ok: true, status: 200, json: async () => ({ matches }) }); },
        failure(status) { reply = async () => ({ ok: false, status, json: async () => ({ message: 'test-secret upstream private detail' }) }); },
        setReply(fn) { reply = fn; },
        async get(method = 'GET') { const res = { headers: {}, setHeader(k,v) { this.headers[k]=v; }, status(v) { this.code=v; return this; }, json(v) { this.body=JSON.parse(JSON.stringify(v)); return this; } }; await context.test.handler({ method }, res); return res; }
    };
}
const all = response => Object.values(response.body.matchesData).flat();
(async () => {
    const h = harness();
    assert.deepEqual([...h.context.test.SUPPORTED_COMPETITIONS], codes);
    const fixtures = codes.map((code,i) => fixture(code, i+1));
    h.context.test.matchOverrides['6'] = { featured: false };
    h.success([...fixtures, fixtures[0], fixture('UNSUPPORTED', 100)]);
    const result = await h.get();
    assert.equal(result.code, 200); assert.equal(all(result).length, 12);
    codes.forEach((code,i) => {
        const match = all(result).find(m => m.competitionCode === code);
        assert(match, code); assert.equal(match.league, names[i]);
        assert.equal(match.home, fixtures[i].homeTeam.name); assert.equal(match.away, fixtures[i].awayTeam.name);
        assert.equal(match.homeLogo, '/home.png'); assert.equal(match.awayLogo, '/away.png');
        assert.equal(match.homeScore, 2); assert.equal(match.awayScore, 1);
        assert.equal(match.url, `watch-live.html?id=${i+1}`); assert.equal(match.displayTime, '18:00');
    });
    assert.equal(h.calls.length, 1);
    assert.equal(h.calls[0].url.pathname, '/v4/matches');
    assert.equal(h.calls[0].url.searchParams.get('dateFrom'), '2026-09-21');
    assert.equal(h.calls[0].url.searchParams.get('dateTo'), '2026-09-25');
    assert.equal(h.calls[0].url.searchParams.has('competitions'), false);
    assert.equal(h.calls[0].options.headers['X-Auth-Token'], 'test-secret');
    assert(!JSON.stringify(result).includes('test-secret'));
    assert.equal(result.headers['Cache-Control'], 'public, max-age=0, s-maxage=60, stale-while-revalidate=120');
    await h.get(); assert.equal(h.calls.length, 1, 'Fresh cache should avoid upstream');
    h.advance(60001); await h.get(); assert.equal(h.calls.length, 2, 'Expired fresh cache should refresh');
    console.log('PASS: all 12 codes/names, non-featured clubs, scores/logos/Watch URLs, one request, no duplicates, token isolation and fresh cache.');

    const dates = harness();
    dates.success([
        fixture('PL', 1, '2026-09-21T20:59:59Z'), // Outside Yesterday in EAT
        fixture('PL', 2, '2026-09-21T21:00:00Z'), // Yesterday 00:00
        fixture('PL', 3, '2026-09-22T21:00:00Z'), // Today 00:00
        fixture('PL', 4, '2026-09-23T21:00:00Z', 'TIMED'), // Tomorrow 00:00
        fixture('PL', 5, '2026-09-24T20:59:59Z', 'TIMED'), // Tomorrow 23:59
        fixture('PL', 6, '2026-09-24T21:00:00Z', 'TIMED'), // Outside Tomorrow
        fixture('CL', 7, '2026-09-22T20:45:00Z', 'IN_PLAY'), // Overnight -> Today
        fixture('PD', 8, '2026-09-23T12:00:00Z'),
        fixture('PD', 9, '2026-09-23T08:00:00Z'),
        { ...fixture('PD', 10), utcDate: 'invalid' }
    ]);
    const grouped = await dates.get();
    assert.deepEqual(grouped.body.dates, { shalay:'2026-09-22', maanta:'2026-09-23', berri:'2026-09-24' });
    assert.deepEqual(grouped.body.matchesData.shalay.map(m=>m.id), ['2']);
    assert.deepEqual(grouped.body.matchesData.maanta.map(m=>m.id), ['3','9','8','7']);
    assert.deepEqual(grouped.body.matchesData.berri.map(m=>m.id), ['4','5']);
    dates.setTime('2026-09-23T21:01:00Z');
    const midnight = await dates.get(); assert.equal(midnight.body.dates.maanta, '2026-09-24'); assert.equal(dates.calls.length, 2);
    const overrides = harness(); overrides.context.test.matchOverrides['manual/id'] = { featured: true };
    overrides.success([fixture('UNSUPPORTED', 'manual/id'), fixture('UNSUPPORTED', 'hidden')]);
    const manual = await overrides.get(); assert.equal(all(manual).length, 1); assert.equal(all(manual)[0].url,'watch-live.html?id=manual%2Fid');
    console.log('PASS: EAT boundaries/rollover, overnight live grouping, kickoff ordering, invalid rows and explicit unsupported override.');

    for (const status of [403,429,500,503]) {
        const error = harness(); error.failure(status);
        const cold = await error.get(); assert.equal(cold.code,502); assert.equal(cold.headers['Cache-Control'],'no-store'); assert(!JSON.stringify(cold).includes('test-secret'));
        await error.get(); assert.equal(error.calls.length,1,'Error backoff');
        error.advance(60001); error.success(fixtures); assert.equal((await error.get()).code,200,'Recovery');
        error.advance(60001); error.failure(status);
        const stale = await error.get(); assert.equal(stale.code,200); assert.equal(stale.body.stale,true); assert.equal(all(stale).length,12); assert.equal(stale.headers['Cache-Control'],'no-store');
        assert(stale.body.unavailableCompetitions.every(c=>c.status===status && c.cached));
        error.advance(180001); assert.equal((await error.get()).code,502,'Stale data expires');
    }
    const partial = harness(); partial.success([fixtures[0],fixtures[5]]);
    assert.equal(all(await partial.get()).length,2,'Missing competitions do not erase available matches'); assert.equal(partial.calls.length,1);
    const network = harness(); network.setReply(async()=>{throw Error('test-secret')}); assert.equal((await network.get()).code,502);
    const malformed = harness(); malformed.setReply(async()=>({ok:true,status:200,json:async()=>({})})); assert.equal((await malformed.get()).code,502);
    const empty = harness(); assert.equal((await empty.get()).code,200); assert.equal(all(await empty.get()).length,0);
    const busy = harness(); busy.success(Array.from({length:250},(_,i)=>fixture('PL',i)));
    assert.equal(all(await busy.get()).length,250,'No arbitrary match limit');
    const concurrent = harness(); let release;
    concurrent.setReply(()=>new Promise(resolve=>{release=()=>resolve({ok:true,status:200,json:async()=>({matches:fixtures})})}));
    const one=concurrent.get(), two=concurrent.get(); assert.equal(concurrent.calls.length,1); release(); await Promise.all([one,two]);
    const guards=harness(); assert.equal((await guards.get('POST')).code,405); delete guards.context.process.env.FOOTBALL_DATA_TOKEN; assert.equal((await guards.get()).code,500); assert.equal(guards.calls.length,0);
    console.log('PASS: 403/429/5xx, stale fallback/expiry, error backoff/recovery, partial/empty responses, network/invalid JSON shape, coalescing and method/config guards.');

    // Exercise the actual frontend loader, including duplicate/manual merging.
    const frontend = vm.createContext({ Intl, Date, console, setInterval(){}, CustomEvent: class {constructor(type,init){this.type=type;this.detail=init.detail}}, window:{dispatchEvent(){}}, fetch:async()=>({ok:true,json:async()=>({...result.body,matchesData:{...result.body.matchesData,maanta:[...result.body.matchesData.maanta,result.body.matchesData.maanta[0]]}})}) });
    vm.runInContext(read('matches-data.js')+'\nglobalThis.readMatches=()=>matchesData;',frontend);
    await frontend.window.matchesDataReady;
    assert.equal(Object.values(frontend.readMatches()).flat().length,12);
    assert(!/FOOTBALL_DATA_TOKEN|X-Auth-Token/.test(read('matches-data.js')+read('matches.html')));
    console.log('PASS: frontend preserves all 12 competitions and deduplicates without streams or featured flags.');
})().catch(error=>{console.error(error);process.exitCode=1});
