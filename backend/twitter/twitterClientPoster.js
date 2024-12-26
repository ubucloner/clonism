
import fs from "fs"
import { Scraper, SearchMode } from 'agent-twitter-client';
import "../loadEnv.js"
import { downloadImage } from "../utils.js";


const scraper = new Scraper();

async function loginIfNeeded(){

    const isLoggedIn = await scraper.isLoggedIn();
    if (isLoggedIn) return;

    await scraper.login(
        process.env.X_LOGIN,
        process.env.X_PASSWORD,
        process.env.X_EMAIL_OR_PHONE
    );
}

export async function postTweet(text){
    await loginIfNeeded(scraper);

    await scraper.sendTweet(text);
}

export async function postTweetWithImage(text, imageUrl){
    await loginIfNeeded();

    let localFilePath = await downloadImage(imageUrl)

    let mediaData = [
        {
            data: fs.readFileSync(localFilePath),
            mediaType: 'image/jpeg'
        }
    ]

    await scraper.sendTweet(text, null, mediaData);
}

export async function getRandomTrendAndBestTweets() {
    await loginIfNeeded();

    // Note: Trends are fetched from the user's location
    const trends = await scraper.getTrends();
    const randomIndex = Math.floor(Math.random() * trends.length);

    const trend = trends[randomIndex];
    const tweetsData = await scraper.fetchSearchTweets(trend, 10, SearchMode.Top);
    const tweets = tweetsData.tweets?.map(tweetData => tweetData.text);

    return { trend, tweets };
}