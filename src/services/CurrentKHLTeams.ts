import axios from "axios";
import JSSoup from 'jssoup'; 

export type TeamInfo = Array<{ name: string; snokingUrl: string; teamId: string }>;

interface AxiosResponse<T = any> {
    data: string
}

export async function getCurrentKHLTeams(): Promise<TeamInfo> {
    let teams : TeamInfo = [];
    await axios.get(`https://krakenhockeyleague.com/teams`).then((resp: AxiosResponse) => {
        let soup = new JSSoup(resp.data);
        let teamNames = soup.findAll('div', "p1");
        for (let i = 0; i < teamNames.length; i++) { 
            const div = teamNames[i].findNextSibling('div');
            const link = div.find('a');
            const teamId = link.attrs.href.replace(/\D/g, "")
            let teamData = {
                "name": teamNames[i].text,
                "teamId": teamId,
                "snokingUrl": `http://krakenhockeyleague.com/ical/${teamId}`
            }
            teams.push(teamData)
        }
    })
    return teams;
}
