import { BenchAppGame } from "../../typings/benchAppData";

const CSV_HEADER = 'Type,Game Type,Title (Optional),Home,Away,Date,Time,Location (Optional),Address (Optional),Notes (Optional)'

export function BenchAppGamesToCSV(games: BenchAppGame[]): string {
    let ans = ''
    ans += CSV_HEADER;
    ans += '\n'
    ans += games.map(BenchAppGameToCSVRow).join('\n');
    return ans;
}

function BenchAppGameToCSVRow(game: BenchAppGame): string {
    const fields: string[] = [
        game.Type,
        game["Game Type"],
        game.Title || '',
        game.Home,
        game.Away,
        game.Date,
        game.Time,
        game.Location || '',
        game.Address || '',
        game.Notes || '',
    ]

    return fields.join(',')
}