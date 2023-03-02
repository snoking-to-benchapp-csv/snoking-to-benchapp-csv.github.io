import { SnokingGame } from "../../typings/snokingData";
import { DBLGame } from "../../typings/dblAppData";
import moment from "moment";

const BENCH_APP_DATE_FORMAT_STRING = "YYYY-MM-DD";

export function DBLGameToTeamCowboyGame(snokingGame: SnokingGame, teamId: string): DBLGame {
    const isHome = teamId == `${snokingGame.teamHomeSeasonId}`;
    return {
        Type: "GAME",
        Date: moment(snokingGame.dateTime).format(BENCH_APP_DATE_FORMAT_STRING),
        Time: snokingGame.time,
        Title: isHome ? snokingGame.teamAwayName : snokingGame.teamHomeName,
        HomeOrAway: isHome ? "Home" : "Away",
        rinkName: snokingGame.rinkName,
    };
}
