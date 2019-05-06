import fs from "fs";
import { getSnokingSeasonData } from "./services/SnokingSeason";
import { BenchAppGamesToCSV } from "./transformers/BenchappGameToCSV";
import { SnokingGameToBenchappGame } from "./transformers/SnokingGameToBenchappGame";

export function main(teamUrl: string) {
    getSnokingSeasonData(teamUrl).then((data) => {
        const csvData = BenchAppGamesToCSV(data.map(SnokingGameToBenchappGame));
        fs.writeFileSync("./out.csv", csvData);
    });
}
