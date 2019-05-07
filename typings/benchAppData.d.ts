// All docstrings lifted from BenchApp documentation
// https://www.benchapp.com/downloads/templates/schedule-import-template.xls.zip

export interface BenchAppGame {
    /**
     * You must use one of these options
     */
    Type: "GAME" | "SCRIMMAGE" | "PRACTICE" | "EVENT";

    /**
     * Only required for Type = 'GAME'
     */
    "Game Type": "PRE-SEASON" | "REGULAR" | "PLAYOFF" | "TOURNAMENT";

    /**
     * Example: Team BBQ
     * Used for events only
     */
    Title?: string;

    /**
     * Home team name
     *
     * Name must be spelt exactly as in BenchApp for matching to work properly. If no match is found, a new team will be created and linked to this event.
     */
    Home: string;

    /**
     * Away team name
     *
     * Name must be spelt exactly as in BenchApp for matching to work properly. If no match is found, a new team will be created and linked to this event.
     */
    Away: string;

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
}
