import { SnokingSeasonResponse } from "../../typings/snokingData";
import ical2json from "ical2json";
import axios from "axios";
import moment from 'moment-timezone';

interface AxiosResponse<T = any> {
    data: string
}

export async function getSnokingSeasonData(url: string): Promise<SnokingSeasonResponse> {

axios.get(url).then((resp: AxiosResponse) => {
    let jCalData = ical2json.convert(resp.data);
    let games = jCalData.VCALENDAR[0].VEVENT;
    let schedule = []
    games.forEach(function(game) {
        let teams = game.SUMMARY.split('-')[1].split('@');
        var date = moment.tz(game.DTSTART, 'America/Chicago').format('MM/DD/YYYY');
        let gameInfo = {
            "dateTime": game.DTSTART,
            "date": date,
            "time": game.DESCRIPTION.split('-')[1].split("at")[0].trim(),
            "rinkName": game.LOCATION,
            "teamHomeName": teams[1].trim(),
            "teamAwayName": teams[0].trim()
        }
        schedule.push(gameInfo)
    })
});
    
    
    return (await get(url)) as SnokingSeasonResponse;
}