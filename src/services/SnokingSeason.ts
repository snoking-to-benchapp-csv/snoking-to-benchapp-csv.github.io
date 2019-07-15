import axios from "axios";
import { SnokingSeasonResponse } from "../../typings/snokingData";

export async function getSnokingSeasonData(url: string): Promise<SnokingSeasonResponse> {
    return (await axios.get(`https://api.codetabs.com/v1/proxy?quest=${url}`, {
        headers: {
            accept: "application/json, text/plain, */*"
        }
    })).data;
}
