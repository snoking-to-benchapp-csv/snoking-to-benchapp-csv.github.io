import axios from "axios";

// This is the hackiest thing in the entire system. The SnoKing site doesn't have CORS headers that work well with another browser page on the internet downloading them.
// This is a standard and good part of web security, but for our application we just want to download this.
// If we were sending ANY sensitive data in our GET request, this would be very, very, very, very bad.
// However, we're just downloading very public data anyway, so I don't mind literally MITM attacking myself.
export const get = async (url: string): Promise<unknown> =>
    (
        await axios.get(`https://api.codetabs.com/v1/proxy?quest=${url}`, {
            headers: {
                accept: "application/json, text/plain, */*",
            },
        })
    ).data;
