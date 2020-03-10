import { get } from "../interfaces/network";

export type TeamInfo = Array<{ name: string; snokingUrl: string; teamId: string }>;

async function getFiveVFiveSeasons(): Promise<Array<{ name: string; id: number }>> {
    return (await get(`https://snokinghockeyleague.com/api/season/all/0?v=1021270`)).seasons.map(
        (x: { name: string; id: number }) => ({
            name: x.name,
            id: x.id
        })
    );
}

async function getFiveVFiveCurrentTeams(index = 0): Promise<TeamInfo> {
    const { id, name: seasonName } = (await getFiveVFiveSeasons())[index];

    return (await get(`http://snokinghockeyleague.com/api/team/list/${id}/0?v=1021270`)).map((x: any) => ({
        name: `5v5: ${x.name} (${x.divisionName} - ${seasonName})`,
        teamId: x.teamId,
        snokingUrl: `https://snokinghockeyleague.com/api/game/list/${x.seasonId}/0/${x.teamId}`
    }));
}

async function getPondSeasons(): Promise<Array<{ name: string; id: number }>> {
    return (await get(`https://snokingpondhockey.com/api/season/all/0?v=1021270`)).seasons.map(
        (x: { name: string; id: number }) => ({
            name: x.name,
            id: x.id
        })
    );
}

async function getPondSeasonCurrentTeams(): Promise<Array<{ name: string; snokingUrl: string; teamId: string }>> {
    const { id, name: seasonName } = (await getPondSeasons())[0];

    return (await get(`http://snokingpondhockey.com/api/team/list/${id}/0?v=1021270`)).map((x: any) => ({
        name: `Pond: ${x.name} (${x.divisionName} - ${seasonName})`,
        teamId: x.teamId,
        snokingUrl: `https://snokinghockeyleague.com/api/game/list/${x.seasonId}/0/${x.teamId}`
    }));
}

export async function getCurrentTeams(): Promise<TeamInfo> {
    const seasonData = await Promise.all([
        getFiveVFiveCurrentTeams(),
        getFiveVFiveCurrentTeams(1),
        getPondSeasonCurrentTeams()
    ]);
    return seasonData.reduce((a, b) => a.concat(b));
}
