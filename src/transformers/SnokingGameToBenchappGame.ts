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
    "Kent Valley Ice Centre": "6015 S 240th St, Kent, WA 98032",
    "accesso ShoWare Center": "625 W James St, Kent, WA 98032",
    "KCI Starbucks Rink": "10601 5th Ave NE, Seattle, WA 98125",
    "KCI Smartsheet Rink": "10601 5th Ave NE, Seattle, WA 98125",
    "KCI VMFH Rink": "10601 5th Ave NE, Seattle, WA 98125",
    "Olympic View Arena": "22202 70th Ave W, Mountlake Terrace, WA 98043",
    "Lynnwood Ice Center": "19803 68th Ave W, Lynnwood, WA 98036",
    "Everett Comm Ice Rink": "2000 Hewitt Ave, Everett, WA 98201",
    "Angel of the Winds Arena": "2000 Hewitt Ave, Everett, WA 98201"
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
