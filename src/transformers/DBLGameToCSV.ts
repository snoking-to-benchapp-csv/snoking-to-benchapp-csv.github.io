import { DBLGame } from "../../typings/dblAppData";

// Previously, this used OS EOL, which would be polyfilled.
// The polyfill is very old and I'd rather not use so just gonna hard code for now.
const EOL = "\n";

const CSV_HEADER =
    "Event Type,Start Date,Start Time,End Date,End Time,Timezone ID,Home or Away,Opponent/Event Title,Location Name,Shirt Color,Opponent Shirt Color,Allow RSVPs,Send Reminders,Notes/Comments";

function DBLGameToCSVRow(game: DBLGame): string {
    const fields: string[] = [
        game.Type,
        game.Date,
        game.Time,
        "",
        "",
        "US/Pacific",
        game.HomeOrAway,
        game.Title || "",
        game.rinkName,
        "",
        "",
        "Yes",
        "Yes",
        "",
    ];

    return fields.map((x) => `"${x}"`).join(",");
}

export function DBLGamesToCSV(games: DBLGame[]): string {
    let ans = "";
    ans += CSV_HEADER;
    ans += EOL;
    ans += games.map(DBLGameToCSVRow).join(EOL);
    return ans;
}
