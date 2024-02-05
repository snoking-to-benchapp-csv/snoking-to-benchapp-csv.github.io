import { SnokingGame } from "../../typings/snokingData";
import { DBLGame } from "../../typings/dblAppData";
import moment from "moment";

const TEAMCOWBOY_DATE_FORMAT_STRING = "YYYY-MM-DD";
const END_TIME_FORMAT = "hh:mm A";

export function DBLGameToTeamCowboyGame(snokingGame: SnokingGame, teamId: string): DBLGame {
    const isHome = teamId == `${snokingGame.teamHomeSeasonId}`;
    const endTime = moment(snokingGame.dateTime).add(75, "minutes");
    return {
        Type: "GAME",
        Date: moment(snokingGame.dateTime).format(TEAMCOWBOY_DATE_FORMAT_STRING),
        Time: snokingGame.time,
        Title: isHome ? snokingGame.teamAwayName : snokingGame.teamHomeName,
        HomeOrAway: isHome ? "Home" : "Away",
        rinkName: snokingGame.rinkName,
        jerseyColour: isHome ? "White" : "Black",
        endDate: moment(endTime).format(TEAMCOWBOY_DATE_FORMAT_STRING),
        endTime: moment(endTime).format(END_TIME_FORMAT),
    };
}
