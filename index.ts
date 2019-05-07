import { main } from "./src";
import { BenchAppUIUrlToDataUrl } from "./src/transformers/BenchAppUIUrlToDataUrl";

const VALID_SNOKING_URLS = [
    "https://snokingpondhockey.com",
    "http://snokingpondhockey.com",
    "https://snokinghockeyleague.com",
    "http://snokinghockeyleague.com"
];

const args = process.argv;
const lastArg = args[args.length - 1];

if (VALID_SNOKING_URLS.findIndex((x) => lastArg.startsWith(x)) >= 0) {
    // User passed a snoking url in the cli
    const dataUrl = BenchAppUIUrlToDataUrl(lastArg);
    if (!dataUrl) {
        console.error("Please pass a valid SnoKing team URL");
    } else {
        main(dataUrl);
    }
} else {
    console.error("Please pass a SnoKing team URL via `npm start -- <url>`");
}
