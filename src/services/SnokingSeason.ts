import { get } from "../interfaces/network";
import { SnokingSeasonResponse } from "../../typings/snokingData";

export async function getSnokingSeasonData(url: string): Promise<SnokingSeasonResponse> {
    return await get(url);
}
