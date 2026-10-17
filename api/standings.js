const ALLOWED_LEAGUES = new Set(["PL", "PD", "SA", "BL1", "FL1", "CL", "EL"]);
const CACHE_CONTROL = "public, max-age=0, s-maxage=60, stale-while-revalidate=120";

function sendJson(res, status, body) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(status).json(body);
}

function calculateStandingsFromResults(table, matches) {
    const teams = new Map(table.map((entry) => [String(entry.team?.id), {
        position: 0,
        name: entry.team?.shortName || entry.team?.name || "Unknown team",
        logo: entry.team?.crest || null,
        played: 0,
        win: 0,
        draw: 0,
        lose: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        formResults: []
    }]));

    const completedMatches = matches
        .filter((match) => ["FINISHED", "AWARDED"].includes(match.status))
        .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));

    completedMatches.forEach((match) => {
        const home = teams.get(String(match.homeTeam?.id));
        const away = teams.get(String(match.awayTeam?.id));
        const homeGoals = Number(match.score?.fullTime?.home);
        const awayGoals = Number(match.score?.fullTime?.away);

        if (!home || !away || !Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) {
            return;
        }

        home.played += 1;
        away.played += 1;
        home.goalsFor += homeGoals;
        home.goalsAgainst += awayGoals;
        away.goalsFor += awayGoals;
        away.goalsAgainst += homeGoals;

        if (homeGoals > awayGoals) {
            home.win += 1;
            home.points += 3;
            away.lose += 1;
            home.formResults.push("W");
            away.formResults.push("L");
        } else if (homeGoals < awayGoals) {
            away.win += 1;
            away.points += 3;
            home.lose += 1;
            home.formResults.push("L");
            away.formResults.push("W");
        } else {
            home.draw += 1;
            away.draw += 1;
            home.points += 1;
            away.points += 1;
            home.formResults.push("D");
            away.formResults.push("D");
        }
    });

    const standings = [...teams.values()]
        .map((team) => ({
            ...team,
            goalDifference: team.goalsFor - team.goalsAgainst,
            form: team.formResults.slice(-5).join("")
        }))
        .sort((a, b) => (
            b.points - a.points ||
            b.goalDifference - a.goalDifference ||
            b.goalsFor - a.goalsFor ||
            a.name.localeCompare(b.name)
        ));

    standings.forEach((team, index) => {
        team.position = index + 1;
        delete team.formResults;
    });

    return {
        standings,
        completedMatchCount: completedMatches.length
    };
}

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return sendJson(res, 405, { error: "Method not allowed" });
    }

    const league = typeof req.query.league === "string"
        ? req.query.league.toUpperCase()
        : "PL";

    if (!ALLOWED_LEAGUES.has(league)) {
        return sendJson(res, 400, { error: "Unsupported league" });
    }

    if (!process.env.FOOTBALL_DATA_TOKEN) {
        console.error("[api/standings] FOOTBALL_DATA_TOKEN is not configured");
        return sendJson(res, 500, {
            error: "FOOTBALL_DATA_TOKEN is not configured"
        });
    }

    try {
        const response = await fetch(
            `https://api.football-data.org/v4/competitions/${league}/standings`,
            {
                headers: {
                    "X-Auth-Token": process.env.FOOTBALL_DATA_TOKEN
                }
            }
        );

        let data = null;
        try {
            data = await response.json();
        } catch (parseError) {
            console.error("[api/standings] Invalid JSON from football-data.org", {
                league,
                status: response.status,
                message: parseError.message
            });
        }

        if (!response.ok) {
            console.error("[api/standings] Football-data API request failed", {
                league,
                status: response.status,
                message: data?.message
            });
            return sendJson(res, response.status, {
                error: "Football-data API request failed",
                status: response.status
            });
        }

        const totalStanding = data?.standings?.find(
            (standing) => standing.type === "TOTAL"
        );

        if (!Array.isArray(totalStanding?.table)) {
            console.error("[api/standings] TOTAL standings table is missing", { league });
            return sendJson(res, 502, {
                error: "Football-data API returned no TOTAL standings table"
            });
        }

        let standings = totalStanding.table.map((entry) => ({
            position: entry.position,
            name: entry.team?.shortName || entry.team?.name || "Unknown team",
            logo: entry.team?.crest || null,
            played: entry.playedGames,
            win: entry.won,
            draw: entry.draw,
            lose: entry.lost,
            goalsFor: entry.goalsFor,
            goalsAgainst: entry.goalsAgainst,
            goalDifference: entry.goalDifference,
            points: entry.points,
            form: entry.form || ""
        }));

        let standingsSource = "official";
        const officialTableIsEmpty = standings.every((team) => team.played === 0);

        if (officialTableIsEmpty) {
            const matchesResponse = await fetch(
                `https://api.football-data.org/v4/competitions/${league}/matches?status=FINISHED`,
                {
                    headers: {
                        "X-Auth-Token": process.env.FOOTBALL_DATA_TOKEN
                    }
                }
            );
            const matchesData = await matchesResponse.json().catch(() => null);

            if (matchesResponse.ok && Array.isArray(matchesData?.matches)) {
                const calculated = calculateStandingsFromResults(
                    totalStanding.table,
                    matchesData.matches
                );

                if (calculated.completedMatchCount > 0) {
                    standings = calculated.standings;
                    standingsSource = "calculated-from-finished-matches";
                }
            }
        }

        res.setHeader("Cache-Control", CACHE_CONTROL);
        return sendJson(res, 200, {
            competition: {
                name: data.competition?.name || league,
                emblem: data.competition?.emblem || null
            },
            season: data.season ? {
                startDate: data.season.startDate,
                endDate: data.season.endDate
            } : null,
            standings,
            standingsSource
        });
    } catch (error) {
        console.error("[api/standings] Network or server error", {
            league,
            message: error.message
        });
        return sendJson(res, 502, {
            error: "Unable to reach football-data.org"
        });
    }
}
