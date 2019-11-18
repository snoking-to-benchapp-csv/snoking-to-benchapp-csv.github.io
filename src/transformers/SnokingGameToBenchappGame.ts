import { SnokingGame } from "../../typings/snokingData";
import { BenchAppGame } from "../../typings/benchAppData";
import moment = require("moment");

const BENCH_APP_DATE_FORMAT_STRING = "ddd, MMM D, YYYY";

const RINKNAME_TO_ADDRESS: { [id: string]: string | null } = {
    Renton: "12620 164th Ave SE, Renton, WA 98059",
    Kirkland: "14326 124th Ave NE, Kirkland, WA 98034"
};

export function SnokingGameToBenchappGame(snokingGame: SnokingGame, teamId: string): BenchAppGame {
    return {
        Type: "GAME",
        "Game Type": "REGULAR",
        Home: snokingGame.teamHomeName,
        Away: snokingGame.teamAwayName,
        Date: moment(snokingGame.dateTime).format(BENCH_APP_DATE_FORMAT_STRING),
        Time: snokingGame.time,
        Location:
            teamId == `${snokingGame.teamHomeSeasonId}`
                ? snokingGame.rinkName + " - Home"
                : snokingGame.rinkName + " - Away",
        Address: RINKNAME_TO_ADDRESS[snokingGame.rinkName] || undefined
    };
}
