import { DataURL } from '../../typings/dataUrl';

const MATCH_REGEX = /.com\/#\/home\/schedule\/(\d+)\/\d+\/(\d+)/;
export function BenchAppUIUrlToDataUrl(uiURL: string): null | DataURL {
    const matchResult = uiURL.match(MATCH_REGEX);
    if (!matchResult) {
        return null;
    } else {
        return {
            snokingUrl: `https://snokinghockeyleague.com/api/game/list/${matchResult[1]}/0/${matchResult[2]}`,
            teamId: Number(`${matchResult[2]}`),
        };
    }
}
