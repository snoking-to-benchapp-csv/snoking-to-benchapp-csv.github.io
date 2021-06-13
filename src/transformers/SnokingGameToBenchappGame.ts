import { SnokingGame } from "../../typings/snokingData";
import { BenchAppGame } from "../../typings/benchAppData";
import moment from "moment";

const BENCH_APP_DATE_FORMAT_STRING = "D/M/YYYY";

const RINK_NAME_TO_ADDRESS: { [id: string]: string | null } = {
    Renton: "12620 164th Ave SE, Renton, WA 98059",
    Kirkland: "14326 124th Ave NE, Kirkland, WA 98034",
    "Snoqualmie A": "35300 SE Douglas St, Snoqualmie, WA 98065",
    "Snoqualmie B": "35300 SE Douglas St, Snoqualmie, WA 98065",
    Snoqualmie: "35300 SE Douglas St, Snoqualmie, WA 98065", // It's called Snoqualmie B right now, but future proofing
};

export function SnokingGameToBenchappGame(snokingGame: SnokingGame, teamId: string): BenchAppGame {
    const isHome = teamId == `${snokingGame.teamHomeSeasonId}`;
    return {
        Type: "GAME",
        "Game Type": "REGULAR",
        Home: snokingGame.teamHomeName,
        Away: snokingGame.teamAwayName,
        Date: moment(snokingGame.dateTime).format(BENCH_APP_DATE_FORMAT_STRING),
        Time: snokingGame.time,
        Duration: "1:00",
        Location: isHome ? snokingGame.rinkName + " - Home" : snokingGame.rinkName + " - Away",
        Address: RINK_NAME_TO_ADDRESS[snokingGame.rinkName] || undefined,
        Notes: isHome ? "Light Jerseys" : "Dark Jerseys",
    };
}
