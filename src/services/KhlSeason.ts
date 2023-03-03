import { SnokingSeasonResponse } from "../../typings/snokingData";
import { convert } from "ical2json";
import axios from "axios";
import moment from "moment-timezone";

interface AxiosResponse {
    data: string;
}

export async function getKhlSeasonData(url: string, name: string, teamId: string): Promise<SnokingSeasonResponse> {
    const schedule: SnokingSeasonResponse = [];

    await axios.get(`https://corsproxy.io/?${url}`).then((resp: AxiosResponse) => {
        const jCalData = convert(resp.data);
        const games = jCalData.VCALENDAR[0].VEVENT;
        for (let i = 0; i < games.length; i++) {
            const teams = games[i].SUMMARY.split(" - ")[1].split("@");
            const isHome = teams[1].trim() == name.slice(6);
            const date = moment.tz(games[i].DTSTART, "America/Chicago").format("MM/DD/YYYY");
            const dateTime = moment.tz(games[i].DTSTART, "America/Chicago").format("YYYY-MM-DDTHH:mm:SS");
            const gameInfo = {
                id: i,
                seasonId: 1,
                dateTime: dateTime,
                date: date,
                day: "d",
                time: games[i].DESCRIPTION.split(" - ")[1].split("at")[0].trim(),
                rinkId: 1,
                rinkName: games[i].LOCATION,
                division: null,
                teamHomeId: 1,
                teamAwayId: 1,
                teamHomeName: teams[1].trim(),
                teamAwayName: teams[0].trim(),
                teamHomeNameStat: null,
                teamAwayNameStat: null,
                oponentName: "",
                scoreHome: null,
                scoreAway: null,
                score: null,
                isScoresheetSet: false,
                isRosterSet: false,
                scoresheet: null,
                teamHomeSeasonId: isHome ? teamId : 1,
                teamAwaySeasonId: 1,
                isNew: false,
                lastError: null,
            };
            schedule.push(gameInfo);
        }
    });

    return schedule;
}
