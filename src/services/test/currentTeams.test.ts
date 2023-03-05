import {
    getCurrentKHLTeams,
    getFiveVFiveSeasons,
    getFiveVFiveCurrentTeams,
    getPondSeasons,
    getPondSeasonCurrentTeams,
} from "../CurrentTeams";

test("Gets KHL teams returns at least 1", async () => {
    const khlTeams = await getCurrentKHLTeams();
    expect(khlTeams.length).toBeGreaterThan(0);
});

test("Gets SKAHL seasons returns at least 1", async () => {
    const khlTeams = await getFiveVFiveSeasons();
    expect(khlTeams.length).toBeGreaterThan(0);
});

test("Gets SKAHL teams returns at least 1", async () => {
    const khlTeams = await getFiveVFiveCurrentTeams();
    expect(khlTeams.length).toBeGreaterThan(0);
});

test("Gets SKAHL teams-1 returns at least 1", async () => {
    const khlTeams = await getFiveVFiveCurrentTeams(1);
    expect(khlTeams.length).toBeGreaterThan(0);
});

test("Gets Pond seasons returns at least 1", async () => {
    const khlTeams = await getPondSeasons();
    expect(khlTeams.length).toBeGreaterThan(0);
});

test("Gets Pond teams returns at least 1", async () => {
    const khlTeams = await getPondSeasonCurrentTeams();
    expect(khlTeams.length).toBeGreaterThan(0);
});

export {};
