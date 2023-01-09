import moment from "moment";
import { SnokingGame } from "../../typings/snokingData";
import { getSnokingSeasonData } from "../services/SnokingSeason";
import { BenchAppGamesToCSV } from "../transformers/BenchAppGameToCSV";
import { DBLGamesToCSV } from "../transformers/DBLGameToCSV";
import { DBLGameToTeamCowboyGame } from "../transformers/DBLGameToTeamCowboyGame";
import { saveAs } from "file-saver";
import { SnokingGameToBenchappGame } from "../transformers/SnokingGameToBenchappGame";

export enum EMIT_TYPES {
    BENCH_APP,
    TEAM_COWBOY,
}

export const downloadCSV = async ({
    newGamesOnly,
    url,
    emit,
    teamId,
}: {
    newGamesOnly: boolean;
    url: string;
    emit: EMIT_TYPES;
    teamId: string;
}): Promise<void> => {
    let snoKingSeasonData: SnokingGame[] = [];
    const lazyErrorAlert = () =>
        alert("There was an issue processing the request. Try again later or email chris@chrisbenti.com");

    try {
        snoKingSeasonData = await getSnokingSeasonData(url);
    } catch (e) {
        console.error({ error: e });
        //TODO: Better alert handling then just an ugly alert.
        lazyErrorAlert();
        return;
    }
    let csvData = "";
    try {
        const dataByDates = snoKingSeasonData.filter(
            (n) =>
                !newGamesOnly ||
                moment(n.dateTime) > moment().subtract(1, "days") /* only games in the future with some fudge*/
        );
        if (emit == EMIT_TYPES.BENCH_APP) {
            csvData = BenchAppGamesToCSV(dataByDates.map((n) => SnokingGameToBenchappGame(n, teamId)));
        } else {
            csvData = DBLGamesToCSV(dataByDates.map((n) => DBLGameToTeamCowboyGame(n, teamId)));
        }
    } catch (e) {
        console.error({ error: e });
        //TODO: Better alert handling then just an ugly alert.
        lazyErrorAlert();
        return;
    }

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "schedule.csv");
};
