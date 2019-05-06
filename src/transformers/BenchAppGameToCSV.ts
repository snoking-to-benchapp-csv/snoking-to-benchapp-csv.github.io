import { BenchAppGame } from '../../typings/benchAppData';
import { EOL } from 'os';

const CSV_HEADER =
    'Type,Game Type,Title (Optional),Home,Away,Date,Time,Location (Optional),Address (Optional),Notes (Optional)';

function BenchAppGameToCSVRow(game: BenchAppGame): string {
    const fields: string[] = [
        game.Type,
        game['Game Type'],
        game.Title || '',
        game.Home,
        game.Away,
        game.Date,
        game.Time,
        game.Location || '',
        game.Address || '',
        game.Notes || '',
    ];

    return fields.map(x => `"${x}"`).join(',');
}

export function BenchAppGamesToCSV(games: BenchAppGame[]): string {
    let ans = '';
    ans += CSV_HEADER;
    ans += EOL;
    ans += games.map(BenchAppGameToCSVRow).join(EOL);
    return ans;
}
