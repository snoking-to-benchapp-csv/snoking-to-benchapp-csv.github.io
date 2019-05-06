import { getSnokingSeasonData } from "./src/services/SnokingSeason";
import { SnokingGameToBenchappGame } from "./src/transformers/SnokingGameToBenchappGame";
import { BenchAppGamesToCSV } from "./src/transformers/BenchappGameToCSV";

getSnokingSeasonData(
    'https://snokinghockeyleague.com/api/game/list/1060/0/1075?v=1020620'
)
    .then(
        data => console.log(BenchAppGamesToCSV(data.map(SnokingGameToBenchappGame)))
    )