import axios from "axios";

export const get = async (url: string): Promise<unknown> =>
    (
        await axios.get(`https://api.codetabs.com/v1/proxy?quest=${url}`, {
            headers: {
                accept: "application/json, text/plain, */*",
            },
        })
    ).data;
