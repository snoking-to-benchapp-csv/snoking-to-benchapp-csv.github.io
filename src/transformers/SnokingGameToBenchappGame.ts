import { SnokingGame } from "../../typings/snokingData";
import { BenchAppGame } from "../../typings/benchAppData";
import moment = require("moment");

const BENCH_APP_DATE_FORMAT_STRING = "D/M/YYYY";

const RINKNAME_TO_ADDRESS: { [id: string]: string | null } = {
    Renton: "12620 164th Ave SE, Renton, WA 98059",
    Kirkland: "14326 124th Ave NE, Kirkland, WA 98034",
    "Snoqualmie A": "35300 SE Douglas St, Snoqualmie, WA 98065",
    "Snoqualmie B": "35300 SE Douglas St, Snoqualmie, WA 98065",
    Snoqualmie: "35300 SE Douglas St, Snoqualmie, WA 98065" // It's called Snoqualmie B right now, but future proofing
};

export function SnokingGameToBenchappGame(snokingGame: SnokingGame, teamId: string): BenchAppGame {
    return {
        Type: "GAME",
        "Game Type": "REGULAR",
        Home: snokingGame.teamHomeName,
        Away: snokingGame.teamAwayName,
        Date: moment(snokingGame.dateTime).format(BENCH_APP_DATE_FORMAT_STRING),
        Time: snokingGame.time,
        Duration: "1:00",
        Location:
            teamId == `${snokingGame.teamHomeSeasonId}`
                ? snokingGame.rinkName + " - Home"
                : snokingGame.rinkName + " - Away",
        Address: RINKNAME_TO_ADDRESS[snokingGame.rinkName] || undefined
    };
}
