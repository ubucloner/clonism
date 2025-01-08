
import fs from "fs"
import { Scraper, SearchMode } from 'agent-twitter-client';
import "../loadEnv.js"
import { downloadImage } from "../utils.js";


const scraper = new Scraper();
const username = 'FcktardAI';

async function loginIfNeeded(){

    const isLoggedIn = await scraper.isLoggedIn();
    if (isLoggedIn) return;

    console.log('Logging in...');
    console.log(1, process.env.X_LOGIN,
        process.env.X_PASSWORD,
        undefined,
        undefined,
        process.env.TWITTER_API_KEY,
        process.env.TWITTER_API_SECRET_KEY,
        process.env.TWITTER_ACCESS_TOKEN,
        process.env.TWITTER_ACCESS_TOKEN_SECRET);
    await scraper.login(
        process.env.X_LOGIN,
        process.env.X_PASSWORD,
        undefined,
        undefined,
        process.env.TWITTER_API_KEY,
        process.env.TWITTER_API_SECRET_KEY,
        process.env.TWITTER_ACCESS_TOKEN,
        process.env.TWITTER_ACCESS_TOKEN_SECRET
    );
}

export async function postTweet(text){
    await loginIfNeeded(scraper);

    console.log(2, text);
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

export async function getLastMentions() {
    const minimumFollowersToReply = 800;
    await loginIfNeeded();

    const lastMentions = await scraper.searchTweets(`@${username} -is:retweet -is:reply`, 50);

    const lastMentionsData = [];
    const usersToReplies = new Set();
    for await (const lastMention of lastMentions) {
        const isMention = lastMention.mentions?.find(mention => mention?.username === username);
        if (!isMention) continue;

        if (usersToReplies.has(lastMention.username)) continue;
        
        const user = await scraper.getProfile(lastMention.username);
        usersToReplies.add(user.username);

        if (user.followersCount < minimumFollowersToReply) continue;

        lastMentionsData.push(lastMention);
    }

    return lastMentionsData;
}

export async function createPoll() {
    await loginIfNeeded();

    await scraper.sendTweetV2(
        `Mint or Airdrop`,
        undefined,
        {
          poll: {
            options: [
              { label: 'Mint 🤖' },
              { label: 'Airdrop 💸' },
            ],
            duration_minutes: 1440,
          },
        },
    );
}

export async function closePoll() {
    await loginIfNeeded();

    //TODO: Fetch tweets from last tweet and filter which one was the poll
}