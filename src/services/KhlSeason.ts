import { SnokingSeasonResponse } from "../../typings/snokingData";
import ical2json from "ical2json";
import axios from "axios";
import moment from 'moment-timezone';

interface AxiosResponse<T = any> {
    data: string
}

export async function getKhlSeasonData(url: string): Promise<SnokingSeasonResponse> {

    let schedule : SnokingSeasonResponse = [];

    axios.get(url).then((resp: AxiosResponse) => {
        let jCalData = ical2json.convert(resp.data);
        let games = jCalData.VCALENDAR[0].VEVENT;
        for (let i = 0; i < games.length; i++) {
            const teams = games[i].SUMMARY.split('-')[1].split('@');
            const date = moment.tz(games[i].DTSTART, 'America/Chicago').format('MM/DD/YYYY');
            const gameInfo = {
                "seasonId": 1,
                "dateTime": games[i].DTSTART,
                "date": date,
                "day": "d",
                "time": games[i].DESCRIPTION.split('-')[1].split("at")[0].trim(),
                "rinkId": 1,
                "rinkName": games[i].LOCATION,
                "division": null,
                "teamHomeId": 1,
                "teamAwayId": 1,
                "teamHomeName": teams[1].trim(),
                "teamAwayName": teams[0].trim(),
                "teamHomeNameStat": null,
                "teamAwayNameStat": null,
                "oponentName": "",
                "scoreHome": 1,
                "scoreAway": 1,
                "score": "",
                "isScoresheetSet": false,
                "isRosterSet": false,
                "scoresheet": null,
                "teamHomeSeasonId": 1,
                "teamAwaySeasonId": 1,
                "id": 1,
                "isNew": false,
                "lastError": null
            }
            schedule.push(gameInfo)
        }
    });
    
    return schedule;
}