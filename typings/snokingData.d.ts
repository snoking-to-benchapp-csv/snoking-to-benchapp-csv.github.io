export type SnokingSeasonResponse = SnokingGame[];

export interface SnokingGame {
    seasonId: number;

    /**
     * 2019-05-05T16:50:00
     */
    dateTime: string;

    /**
     * 5/5/2019
     */
    date: string;
    day: string;

    /**
     * 4:50 PM
     */
    time: string;
    rinkId: number;
    rinkName: string;
    division: string | null;
    teamHomeId: number;
    teamAwayId: number;
    teamHomeName: string;
    teamAwayName: string;
    teamHomeNameStat: unknown | null;
    teamAwayNameStat: unknown | null;
    oponentName: unknown | null;
    scoreHome: number | null;
    scoreAway: number | null;
    score: unknown | null;
    isScoresheetSet: boolean;
    isRosterSet: boolean;
    scoresheet: unknown | null;
    teamHomeSeasonId: number | string;
    teamAwaySeasonId: number;
    id: number;
    isNew: boolean;
    lastError: unknown | null;
}
