// All docstrings lifted from BenchApp documentation
// https://www.benchapp.com/downloads/templates/schedule-import-template.xls.zip

export interface DBLGame {
    /**
     * You must use one of these options
     */
    Type: "GAME" | "PRACTICE" | "BYE" | "OTHER";

    /**
     * Example: Team BBQ
     * Used for events and other teams name
     */
    Title?: string;

    /**
     * Must be this format Tue, Jan 19, 2014
     */
    Date: string;

    /**
     * Must be this format: 6:30 PM
     */
    Time: string;

    /**
     * The name of the facility ex. Rink name, etc
     */
    Location?: string;

    /**
     * The Address of the facility: Street address with zip/postal code
     */
    Address?: string;

    /**
     * Notes visible to your players
     */
    Notes?: string;

    /**
     * If your team is home or away
     */
    HomeOrAway: "Home" | "Away"; 
}
