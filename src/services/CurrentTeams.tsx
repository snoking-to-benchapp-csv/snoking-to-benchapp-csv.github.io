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

async function getFiveVFiveSeasons(): Promise<Array<{ name: string; id: number }>> {
    return (
        (await get(`https://snokinghockeyleague.com/api/season/all/0?v=1021270`)) as {
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
}

async function getFiveVFiveCurrentTeams(index = 0): Promise<TeamInfo> {
    const { id, name: seasonName } = (await getFiveVFiveSeasons())[index];

    return (
        (await get(`http://snokinghockeyleague.com/api/team/list/${id}/0?v=1021270`)) as [
            {
                name: string;
                divisionName: string;
                teamId: string;
                seasonId: string;
            }
        ]
    ).map((x) => ({
        name: `5v5: ${x.name} (${x.divisionName} - ${seasonName})`,
        teamId: x.teamId,
        snokingUrl: `https://snokinghockeyleague.com/api/game/list/${x.seasonId}/0/${x.teamId}`,
        isSnoking: true,
    }));
}

async function getPondSeasons(): Promise<Array<{ name: string; id: number }>> {
    return (
        (await get(`http://snokingpondhockey.com/api/season/all/0?v=1021270`)) as {
            seasons: [{ name: string; id: number }];
        }
    ).seasons.map((x: { name: string; id: number }) => ({
        name: x.name,
        id: x.id,
    }));
}

async function getPondSeasonCurrentTeams(): Promise<
    Array<{ name: string; snokingUrl: string; teamId: string; isSnoking: boolean }>
> {
    const { id, name: seasonName } = (await getPondSeasons())[0];

    return (
        (await get(`http://snokingpondhockey.com/api/team/list/${id}/0?v=1021270`)) as [
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

    const seasonData = await Promise.all([
        safelyGetTeams(
            () => getFiveVFiveCurrentTeams(),
            <>
                <b>SKAHL 5v5</b> data is not currently available. Please try again later if you require data for that
                league.
            </>
        ),
        safelyGetTeams(
            () => getFiveVFiveCurrentTeams(1),
            <>
                <b>SKAHL 5v5</b> data is not currently available. Please try again later if you require data for that
                league..
            </>
        ),
        safelyGetTeams(
            () => getPondSeasonCurrentTeams(),
            <>
                <b>SKAHL Pond</b> data is not currently available. Please try again later if you require data for that
                league.
            </>
        ),
        safelyGetTeams(
            () => getCurrentKHLTeams(),
            <>
                <b>Kraken Hockey League</b> data is not available. If you require data for that league, and{" "}
                <a href="https://krakenhockeyleague.com/">https://krakenhockeyleague.com/</a> is down, please try again
                later.
            </>
        ),
    ]);
    return {
        teams: seasonData.map((x) => x.data).reduce((a, b) => a.concat(b)),
        errors: seasonData.map((x) => x.error).filter((a) => a != null) as ReactElement[],
    };
}
