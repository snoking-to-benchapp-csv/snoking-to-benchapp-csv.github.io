import { get } from "../interfaces/network";
import axios from "axios";
import JSSoup from "jssoup";

export type TeamInfo = Array<{ name: string; snokingUrl: string; teamId: string; isSnoking: boolean }>;

interface AxiosResponse<T = any> {
    data: string;
}

async function getCurrentKHLTeams(): Promise<TeamInfo> {
    const teams: TeamInfo = [];
    await axios.get(`https://corsproxy.io/?https://krakenhockeyleague.com/teams`).then((resp: AxiosResponse) => {
        const soup = new JSSoup(resp.data);
        const teamNames = soup.findAll("div", "p1");
        for (let i = 0; i < teamNames.length; i++) {
            const div = teamNames[i].findNextSibling("div");
            const link = div.find("a");
            const teamId = link.attrs.href.replace(/\D/g, "");
            const teamData = {
                name: `KHL - ${teamNames[i].text}`,
                teamId: teamId,
                snokingUrl: teamId,
                isSnoking: false,
            };
            teams.push(teamData);
        }
    });
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
        isSnoking: true,
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

export async function getCurrentTeams(): Promise<TeamInfo> {
    const seasonData = await Promise.all([
        getFiveVFiveCurrentTeams(),
        getFiveVFiveCurrentTeams(1),
        getPondSeasonCurrentTeams(),
        getCurrentKHLTeams(),
    ]);
    return seasonData.reduce((a, b) => a.concat(b));
}
