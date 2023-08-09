import { BenchAppGame } from "../../typings/benchAppData";

// Previously, this used OS EOL, which would be polyfilled.
// The polyfill is very old and I'd rather not use so just gonna hard code for now.
const EOL = "\n";

const CSV_HEADER =
    "Type,Game Type,Title (Optional),Away,Home,Date,Time,Duration,Location (Optional),Address (Optional),Notes (Optional)";

function BenchAppGameToCSVRow(game: BenchAppGame): string {
    const fields: string[] = [
        game.Type,
        game["Game Type"],
        game.Title || "",
        game.Away,
        game.Home,
        game.Date,
        game.Time,
        game.Duration,
        game.Location || "",
        game.Address || "",
        game.Notes || "",
    ];

    return fields.map((x) => `"${x}"`).join(",");
}

export function BenchAppGamesToCSV(games: BenchAppGame[]): string {
    let ans = "";
    ans += CSV_HEADER;
    ans += EOL;
    ans += games.map(BenchAppGameToCSVRow).join(EOL);
    return ans;
}
