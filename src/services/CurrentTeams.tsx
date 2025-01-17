import { get } from "../interfaces/network";
import JSSoup from "jssoup";
import React, { ReactElement } from "react";

export type TeamInfo = Array<{ name: string; snokingUrl: string; teamId: string; isSnoking: boolean }>;

async function getCurrentKHLTeams(): Promise<TeamInfo> {
    const teams: TeamInfo = [];
    const resp = (await get(`https://krakenhockeyleague.com/teams`)) as string;

    const soup = new JSSoup(resp);
    const teamNames = soup.findAll("div", "p1");
    for (let i = 0; i < teamNames.length; i++) {
        const div = teamNames[i].findNextSibling("div");
        const link = div.find("a");
        const teamId = link.attrs.href.replace(/\D/g, "");
        const teamData = {
            name: `KHL - ${teamNames[i].text}`,
            teamId: teamId,
            snokingUrl: `https://krakenhockeyleague.com/ical/${teamId}`,
            isSnoking: false,
        };
        teams.push(teamData);
    }
    return teams;
}

async function getFiveVFiveSeasons(version: string): Promise<Array<{ name: string; id: number }>> {
    const ans = (
        (await get(`https://snokinghockeyleague.com/api/season/all/0?v=${version}`)) as {
            seasons: [
                {
                    name: string;
                    id: number;
                }
            ];
        }
    ).seasons.map((x: { name: string; id: number }) => ({
        name: x.name,
        id: x.id,
    }));

    ans.forEach((season) => {
        const SEASON_REMAP: { [id: string]: string | null } = {
            // So apparently they named the playoffs incorrectly. I guess I'll just include a generalized rename
            // to handle this if it happens in the future.
            ["2023-2023 SKAHL Fall-Winter Playoffs"]: "2023-2024 SKAHL Fall-Winter Playoffs",
        };
        if (SEASON_REMAP[season.name]) {
            season.name = SEASON_REMAP[season.name] as string;
        } else {
            return season;
        }
    });

    return ans;
}

async function getFiveVFiveCurrentTeams({
    name,
    id,
    version,
}: {
    name: string;
    id: number;
    version: string;
}): Promise<TeamInfo> {
    return (
        (await get(`https://snokinghockeyleague.com/api/team/list/${id}/0?v=${version}`)) as [
            {
                name: string;
                divisionName: string;
                teamId: string;
                seasonId: string;
            }
        ]
    ).map((x) => ({
        name: `5v5: ${x.name} (${x.divisionName} - ${name})`,
        teamId: x.teamId,
        snokingUrl: `https://snokinghockeyleague.com/api/game/list/${x.seasonId}/0/${x.teamId}`,
        isSnoking: true,
    }));
}

async function getPondSeasons(version: string): Promise<Array<{ name: string; id: number }>> {
    return (
        (await get(`https://snokingpondhockey.com/api/season/all/0?v=${version}`)) as {
            seasons: [{ name: string; id: number }];
        }
    ).seasons.map((x: { name: string; id: number }) => ({
        name: x.name,
        id: x.id,
    }));
}

async function getPondSeasonCurrentTeams(
    version: string
): Promise<Array<{ name: string; snokingUrl: string; teamId: string; isSnoking: boolean }>> {
    const { id, name: seasonName } = (await getPondSeasons(version))[0];

    return (
        (await get(`https://snokingpondhockey.com/api/team/list/${id}/0?v=${version}`)) as [
            { name: string; divisionName: string; teamId: string; seasonId: string }
        ]
    ).map((x) => {
        return {
            name: `Pond: ${x.name} (${x.divisionName} - ${seasonName})`,
            teamId: x.teamId,
            snokingUrl: `https://snokinghockeyleague.com/api/game/list/${x.seasonId}/0/${x.teamId}`,
            isSnoking: true,
        };
    });
}

export async function getCurrentTeams(): Promise<{
    teams: TeamInfo;
    errors: ReactElement[];
}> {
    const safelyGetTeams = async (getter: () => Promise<TeamInfo>, errorMessage: ReactElement) => {
        try {
            const data = await getter();
            return {
                data,
                error: null,
            };
        } catch {
            return {
                data: [] as TeamInfo,
                error: errorMessage,
            };
        }
    };

    const dataForNonSKAHLSite = [
        safelyGetTeams(
            () => getCurrentKHLTeams(),
            <>
                <b>Kraken Hockey League</b> data is not available. If you require data for that league, and{" "}
                <a href="https://krakenhockeyleague.com/">https://krakenhockeyleague.com/</a> is down, please try again
                later.
            </>
        ),
    ];

    const seasonData = await Promise.all(dataForNonSKAHLSite);
    return {
        teams: seasonData.map((x) => x.data).reduce((a, b) => a.concat(b)),
        errors: seasonData.map((x) => x.error).filter((a) => a != null) as ReactElement[],
    };
}
