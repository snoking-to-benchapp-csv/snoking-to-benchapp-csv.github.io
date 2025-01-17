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
