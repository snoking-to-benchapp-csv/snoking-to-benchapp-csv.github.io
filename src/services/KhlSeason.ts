import { SnokingSeasonResponse } from "../../typings/snokingData";
import { convert } from "ical2json";
import { get } from "../interfaces/network";
import moment from "moment-timezone";

export async function getKhlSeasonData(url: string, name: string, teamId: string): Promise<SnokingSeasonResponse> {
    const schedule: SnokingSeasonResponse = [];

    const resp = (await get(url)) as string;
    const jCalData = convert(resp);
    const games = jCalData.VCALENDAR[0].VEVENT;
    for (let i = 0; i < games.length; i++) {
        const teams = games[i].SUMMARY.split(" - ")[1].split("@");
        const isHome = teams[1].trim() == name.slice(6);
        const dt = moment.tz(games[i].DTSTART, "America/Vancouver");
        const gameInfo = {
            id: i,
            seasonId: 1,
            dateTime: dt.format("YYYY-MM-DDTHH:mm:SS"),
            date: dt.format("MM/DD/YYYY"),
            day: dt.format("ddd"),
            time: dt.format("hh:mm:SS A"),
            rinkId: 1,
            rinkName: games[i].LOCATION,
            division: null,
            teamHomeId: 1,
            teamAwayId: 1,
            teamHomeName: teams[1].trim(),
            teamAwayName: teams[0].trim(),
            teamHomeNameStat: null,
            teamAwayNameStat: null,
            opponentName: "",
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
    return schedule;
}
