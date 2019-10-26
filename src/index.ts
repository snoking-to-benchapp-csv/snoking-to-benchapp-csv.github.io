import fs from "fs";
import { getSnokingSeasonData } from "./services/SnokingSeason";
import { BenchAppGamesToCSV } from "./transformers/BenchappGameToCSV";
import { DataURL } from "../typings/dataUrl";
import { SnokingGameToBenchappGame } from "./transformers/SnokingGameToBenchappGame";

export function main(dataUrl: DataURL) {
    getSnokingSeasonData(dataUrl.snokingUrl).then((data) => {
        const csvData = BenchAppGamesToCSV(data.map((n) => SnokingGameToBenchappGame(n, dataUrl.teamId)));
        fs.writeFileSync("./out.csv", csvData);
    });
}
