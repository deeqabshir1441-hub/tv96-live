// Exercise the existing handlers with deterministic upstream responses.
// No live token, network call or production data is used.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const importHandler = async file => (await import('data:text/javascript;base64,' + Buffer.from(fs.readFileSync(path.join(root, file), 'utf8')).toString('base64'))).default;
const response = () => ({ code: null, body: null, headers: {}, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });
(async () => {
    const matches = await importHandler('api/matches.js');
    const standings = await importHandler('api/standings.js');
    for (const handler of [matches, standings]) {
        const res = response(); await handler({ method: 'POST', query: {} }, res); assert.equal(res.code, 405);
    }
    const invalid = response(); await standings({ method: 'GET', query: { league: 'INVALID' } }, invalid); assert.equal(invalid.code, 400);
    const oldToken = process.env.FOOTBALL_DATA_TOKEN;
    const oldFetch = global.fetch;
    process.env.FOOTBALL_DATA_TOKEN = 'local-test-value';
    try {
        const match = { id: 12345, competition: { code: 'PL' }, utcDate: new Date().toISOString(), status: 'FINISHED', homeTeam: { id: 1, name: 'Arsenal', crest: 'https://example.invalid/home.png' }, awayTeam: { id: 2, name: 'Liverpool', crest: 'https://example.invalid/away.png' }, score: { fullTime: { home: 2, away: 1 } } };
        global.fetch = async (input, options) => {
            assert.equal(options.headers['X-Auth-Token'], 'local-test-value');
            const url = new URL(input);
            assert.equal(url.pathname, '/v4/matches');
            return { ok: true, status: 200, json: async () => ({ matches: [match] }) };
        };
        const matchResponse = response(); await matches({ method: 'GET', query: {} }, matchResponse);
        assert.equal(matchResponse.code, 200);
        const all = Object.values(matchResponse.body.matchesData).flat();
        assert.equal(all.length, 1); assert.equal(all[0].id, '12345'); assert.equal(all[0].homeScore, 2); assert.equal(all[0].awayScore, 1);
        assert.equal(all[0].homeLogo, match.homeTeam.crest); assert.equal(all[0].status, 'Finished');
        const table = [
            { position: 1, team: match.homeTeam, playedGames: 1, won: 1, draw: 0, lost: 0, goalsFor: 2, goalsAgainst: 1, goalDifference: 1, points: 3, form: 'W' },
            { position: 2, team: match.awayTeam, playedGames: 1, won: 0, draw: 0, lost: 1, goalsFor: 1, goalsAgainst: 2, goalDifference: -1, points: 0, form: 'L' }
        ];
        global.fetch = async () => ({ ok: true, status: 200, json: async () => ({ competition: { name: 'Premier League' }, standings: [{ type: 'TOTAL', table }] }) });
        const tableResponse = response(); await standings({ method: 'GET', query: { league: 'PL' } }, tableResponse);
        assert.equal(tableResponse.code, 200); assert.equal(tableResponse.body.standings[0].points, 3); assert.equal(tableResponse.body.standings[0].goalDifference, 1); assert.equal(tableResponse.body.standingsSource, 'official');
        let europaRequests = 0;
        global.fetch = async input => {
            assert.equal(new URL(input).pathname, '/v4/competitions/EL/standings');
            europaRequests++;
            return { ok: true, status: 200, json: async () => ({ competition: { name: 'UEFA Europa League' }, standings: [{ type: 'TOTAL', table }] }) };
        };
        const europaResponse = response(); await standings({ method: 'GET', query: { league: 'EL' } }, europaResponse);
        assert.equal(europaRequests, 1); assert.equal(europaResponse.code, 200);
        assert.equal(europaResponse.body.competition.name, 'UEFA Europa League');
        assert.equal(europaResponse.body.standingsSource, 'official');
        global.fetch = async () => ({ ok: false, status: 403, json: async () => ({ message: 'Subscription does not cover this competition' }) });
        const deniedEuropa = response(); await standings({ method: 'GET', query: { league: 'EL' } }, deniedEuropa);
        assert.equal(deniedEuropa.code, 403); assert(!deniedEuropa.body.standings);
        global.fetch = async input => ({ ok: true, status: 200, json: async () => String(input).includes('/standings')
            ? { standings: [{ type: 'TOTAL', table: table.map(row => ({ ...row, playedGames: 0 })) }] }
            : { matches: [match] } });
        const fallback = response(); await standings({ method: 'GET', query: { league: 'PL' } }, fallback);
        assert.equal(fallback.code, 200); assert.equal(fallback.body.standingsSource, 'calculated-from-finished-matches'); assert.equal(fallback.body.standings[0].points, 3); assert.equal(fallback.body.standings[1].goalsAgainst, 2);
        assert.equal(typeof tableResponse.body.standingsSource, 'string');
        assert.equal(typeof fallback.body.standingsSource, 'string');
        assert.equal(fallback.headers['Cache-Control'], tableResponse.headers['Cache-Control']);
        for (const matchPayload of [{matches:[]}, {}, {matches:null}]) {
            global.fetch = async input => ({ok:true,status:200,json:async()=>String(input).includes('/standings')
                ? {standings:[{type:'TOTAL',table:table.map(row=>({...row,playedGames:0}))}]}
                : matchPayload});
            const noFallback = response(); await standings({method:'GET',query:{league:'PL'}},noFallback);
            assert.equal(noFallback.code,200);
            assert.equal(noFallback.body.standingsSource,'official','Unapplied fallback retains provider provenance');
        }
        let providerRequests = 0;
        global.fetch = async () => {
            providerRequests++;
            return {ok:true,status:200,json:async()=>({standings:[{type:'TOTAL',table:table.map(row=>({...row,points:row.points-2}))}]})};
        };
        const adjusted = response(); await standings({method:'GET',query:{league:'PL'}},adjusted);
        assert.equal(providerRequests,1);
        assert.equal(adjusted.body.standingsSource,'official');
        assert.equal(adjusted.body.standings[0].points,1,'Provider points must not be recalculated');
        assert.deepEqual(adjusted.body.standings.map(row=>row.name),tableResponse.body.standings.map(row=>row.name),'Provider ordering preserved');
        console.log('PASS: existing API method/league guards, match IDs/scores/logos, official standings and calculated fallback using mocked upstream responses.');
    } finally {
        global.fetch = oldFetch;
        if (oldToken === undefined) delete process.env.FOOTBALL_DATA_TOKEN; else process.env.FOOTBALL_DATA_TOKEN = oldToken;
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
