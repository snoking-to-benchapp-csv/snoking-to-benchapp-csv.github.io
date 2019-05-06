import { getSnokingSeasonData } from "./services/SnokingSeason";
import { BenchAppGamesToCSV } from "./transformers/BenchappGameToCSV";
import { SnokingGameToBenchappGame } from "./transformers/SnokingGameToBenchappGame";

export function main(teamUrl: string) {
    getSnokingSeasonData(
        teamUrl
    )
        .then(
            data => {
                console.log(BenchAppGamesToCSV(data.map(SnokingGameToBenchappGame)))
            }
        )
}