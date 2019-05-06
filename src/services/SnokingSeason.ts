import axios from "axios";
import { SnokingSeasonResponse } from "../../typings/snokingData";

export async function getSnokingSeasonData(url: string): Promise<SnokingSeasonResponse> {
    return (await axios.get(url, {
        headers: {
            accept: "application/json, text/plain, */*"
        }
    })).data;
}
