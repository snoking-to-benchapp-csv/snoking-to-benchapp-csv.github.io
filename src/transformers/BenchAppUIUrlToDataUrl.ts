const MATCH_REGEX = /.com\/#\/home\/schedule\/(\d+)\/\d+\/(\d+)/
export function BenchAppUIUrlToDataUrl(uiURL: string): null | string {
    const matchResult = uiURL.match(MATCH_REGEX);
    if (!matchResult) {
        return null
    } else {
        return `https://snokinghockeyleague.com/api/game/list/${matchResult[1]}/0/${matchResult[2]}`
    }
}