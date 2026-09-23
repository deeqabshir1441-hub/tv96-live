const competitionNames = Object.freeze({
    WC: "FIFA World Cup",
    CL: "UEFA Champions League",
    BL1: "Bundesliga",
    DED: "Eredivisie",
    BSA: "Campeonato Brasileiro S\u00e9rie A",
    PD: "La Liga",
    FL1: "Ligue 1",
    ELC: "Championship",
    PPL: "Primeira Liga",
    EC: "European Championship",
    SA: "Serie A",
    PL: "Premier League"
});
const SUPPORTED_COMPETITIONS = new Set(Object.keys(competitionNames));

// Mark a football-data.org match ID as featured to show it even when it does
// not meet the automatic competition filter. Public stream sources belong in
// streams.js, which is loaded only by the single watch-live page.
const matchOverrides = {
    // "123456": { featured: true }
};

const NAIROBI_TIMEZONE = "Africa/Nairobi";
const CACHE_CONTROL = "public, max-age=0, s-maxage=60, stale-while-revalidate=120";
const FRESH_MS = 60000;
const STALE_MS = 180000;
let upstreamMatchCache = null;
let upstreamRequest = null;

function sendJson(res, status, body) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(status).json(body);
}

function getNairobiParts(date) {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: NAIROBI_TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(date);

    return Object.fromEntries(
        parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
    );
}

function formatNairobiDate(date) {
    const parts = getNairobiParts(date);
    return `${parts.year}-${parts.month}-${parts.day}`;
}

function getNairobiDateRange() {
    const todayParts = getNairobiParts(new Date());
    const today = new Date(Date.UTC(
        Number(todayParts.year),
        Number(todayParts.month) - 1,
        Number(todayParts.day)
    ));

    const formatUtcDate = (date) => date.toISOString().slice(0, 10);

    return {
        yesterday: formatUtcDate(new Date(today.getTime() - 86400000)),
        today: formatUtcDate(today),
        tomorrow: formatUtcDate(new Date(today.getTime() + 86400000))
    };
}

function formatNairobiTime(utcDate) {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: NAIROBI_TIMEZONE,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).format(new Date(utcDate));
}

function statusDetails(apiStatus, utcDate, now = new Date()) {
    if (["IN_PLAY", "PAUSED"].includes(apiStatus)) {
        return { status: "Live", statusClass: "status-live" };
    }

    if (["FINISHED", "AWARDED"].includes(apiStatus)) {
        return { status: "Finished", statusClass: "status-finished" };
    }

    if (["POSTPONED", "SUSPENDED"].includes(apiStatus)) {
        return { status: "Postponed", statusClass: "status-upcoming" };
    }

    if (["CANCELLED", "CANCELED"].includes(apiStatus)) {
        return { status: "Cancelled", statusClass: "status-upcoming" };
    }

    // The upstream API can be rate-limited and leave a cached SCHEDULED/TIMED
    // status in place after kickoff. Use the kickoff time as a conservative
    // fallback, while still respecting explicit live/final/postponed statuses.
    if (["SCHEDULED", "TIMED"].includes(apiStatus)) {
        const kickoff = new Date(utcDate);
        const elapsedMinutes = Math.floor((now.getTime() - kickoff.getTime()) / 60000);

        if (Number.isFinite(elapsedMinutes) && elapsedMinutes >= 0 && elapsedMinutes < 135) {
            return { status: "Live", statusClass: "status-live" };
        }

        if (Number.isFinite(elapsedMinutes) && elapsedMinutes >= 135) {
            return { status: "Finished", statusClass: "status-finished" };
        }
    }

    return { status: "Upcoming", statusClass: "status-upcoming" };
}

function normalizeMatch(match, competitionCode) {
    const homeTeam = match.homeTeam || {};
    const awayTeam = match.awayTeam || {};
    const homeScore = match.score?.fullTime?.home ?? match.score?.halfTime?.home ?? 0;
    const awayScore = match.score?.fullTime?.away ?? match.score?.halfTime?.away ?? 0;
    const apiStatus = statusDetails(match.status, match.utcDate);
    const matchDate = formatNairobiDate(new Date(match.utcDate));

    return {
        home: homeTeam.shortName || homeTeam.name || "Home team",
        away: awayTeam.shortName || awayTeam.name || "Away team",
        homeScore,
        awayScore,
        league: competitionNames[competitionCode] || match.competition?.name || competitionCode,
        competitionCode,
        status: apiStatus.status,
        statusClass: apiStatus.statusClass,
        overlayText: "Watch Live",
        url: `watch-live.html?id=${encodeURIComponent(match.id)}`,
        displayTime: formatNairobiTime(match.utcDate),
        matchDate,
        id: String(match.id),
        homeLogo: homeTeam.crest || null,
        awayLogo: awayTeam.crest || null,
        leagueLogo: match.competition?.emblem || null,
        isApiMatch: true
    };
}

// One all-competitions request uses the account's accessible coverage. Do not
// request leagues individually: an inaccessible league must not block others.
// v4 dateTo is exclusive and dates are UTC; fetch a superset of the EAT window.
async function loadUpstreamMatches(dates) {
    const key = dates.today;
    const token = process.env.FOOTBALL_DATA_TOKEN;
    const cached = upstreamMatchCache?.key === key && upstreamMatchCache.token === token
        ? upstreamMatchCache : null;
    if (cached && Date.now() < cached.retryAt) return cached;
    if (upstreamRequest?.key === key && upstreamRequest.token === token) return upstreamRequest.promise;

    const request = { key, token };
    request.promise = (async () => {
        const endpoint = new URL("https://api.football-data.org/v4/matches");
        const shiftDate = (date, days) => new Date(Date.parse(date + "T00:00:00Z") + days * 86400000).toISOString().slice(0, 10);
        endpoint.searchParams.set("dateFrom", shiftDate(dates.yesterday, -1));
        endpoint.searchParams.set("dateTo", shiftDate(dates.tomorrow, 1));
        let failure = { status: 0, reason: "network_error" };
        try {
            const response = await fetch(endpoint, {
                headers: { "X-Auth-Token": token },
                signal: AbortSignal.timeout(10000)
            });
            const data = await response.json().catch(() => null);
            if (response.ok && Array.isArray(data?.matches)) {
                const result = { key, token, matches: data.matches, fetchedAt: Date.now(), retryAt: Date.now() + FRESH_MS };
                upstreamMatchCache = result;
                return result;
            }
            failure = { status: response.status, reason: response.status === 429 ? "rate_limit" : "upstream_error" };
        } catch {
            // Do not expose upstream response bodies, request headers or tokens.
        }
        const result = {
            key, token, matches: cached?.matches || null,
            fetchedAt: cached?.fetchedAt || 0,
            retryAt: Date.now() + FRESH_MS, failure
        };
        upstreamMatchCache = result;
        return result;
    })();
    upstreamRequest = request;
    try {
        return await request.promise;
    } finally {
        if (upstreamRequest === request) upstreamRequest = null;
    }
}

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return sendJson(res, 405, { error: "Method not allowed" });
    }
    if (!process.env.FOOTBALL_DATA_TOKEN) {
        res.setHeader("Cache-Control", "no-store");
        return sendJson(res, 500, { error: "Match data is not configured" });
    }
    const dates = getNairobiDateRange();
    const result = await loadUpstreamMatches(dates);
    const stale = Boolean(result.failure);
    if (!result.matches || (stale && Date.now() - result.fetchedAt > STALE_MS)) {
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("Retry-After", "60");
        return sendJson(res, 502, { error: "Unable to load matches right now" });
    }
    const matchesData = { shalay: [], maanta: [], berri: [] };
    const dateKeys = { [dates.yesterday]: "shalay", [dates.today]: "maanta", [dates.tomorrow]: "berri" };
    const seen = new Set();
    const available = new Set();
    for (const raw of result.matches) {
        if (raw?.id == null || !Number.isFinite(Date.parse(raw.utcDate))) continue;
        const code = raw.competition?.code;
        if (!SUPPORTED_COMPETITIONS.has(code) && !matchOverrides[String(raw.id)]?.featured) continue;
        const match = normalizeMatch(raw, code);
        if (!dateKeys[match.matchDate] || seen.has(match.id)) continue;
        seen.add(match.id);
        available.add(code);
        const day = match.status === "Live" ? "maanta" : dateKeys[match.matchDate];
        matchesData[day].push(match);
    }
    Object.values(matchesData).forEach(matches => matches.sort((a, b) => a.displayTime.localeCompare(b.displayTime)));
    res.setHeader("Cache-Control", stale ? "no-store" : CACHE_CONTROL);
    return sendJson(res, 200, {
        matchesData,
        // Presence in the feed is not a promise of access to absent competitions.
        availableCompetitions: stale ? [] : [...available],
        unavailableCompetitions: stale ? [...SUPPORTED_COMPETITIONS].map(code => ({ code, ...result.failure, cached: true })) : [],
        stale,
        dates: { shalay: dates.yesterday, maanta: dates.today, berri: dates.tomorrow }
    });
}
