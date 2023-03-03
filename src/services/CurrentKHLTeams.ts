import axios from "axios";
import JSSoup from "jssoup";

export type TeamInfo = Array<{ name: string; snokingUrl: string; teamId: string }>;

interface AxiosResponse<T = any> {
    data: string;
}

export async function getCurrentKHLTeams(): Promise<TeamInfo> {
    const teams: TeamInfo = [];
    await axios.get(`https://corsproxy.io/?https://krakenhockeyleague.com/teams`).then((resp: AxiosResponse) => {
        const soup = new JSSoup(resp.data);
        const teamNames = soup.findAll("div", "p1");
        for (let i = 0; i < teamNames.length; i++) {
            const div = teamNames[i].findNextSibling("div");
            const link = div.find("a");
            const teamId = link.attrs.href.replace(/\D/g, "");
            const teamData = {
                name: teamNames[i].text,
                teamId: teamId,
                snokingUrl: teamId,
            };
            teams.push(teamData);
        }
    });
    return teams;
}
