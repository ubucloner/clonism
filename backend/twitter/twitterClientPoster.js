
import fs from "fs"
import { Scraper } from 'agent-twitter-client';

import "../loadEnv.js"
import { downloadImage } from "../utils.js";


const scraper = new Scraper();

export async function postTweet(text){
    await login()
    await scraper.sendTweet(text);
}

export async function postTweetWithImage(text, imageUrl){

    await login()
    let localFilePath = await downloadImage(imageUrl)

    let mediaData = [
        {
            data: fs.readFileSync(localFilePath),
            mediaType: 'image/jpeg'
        }
    ]

    await scraper.sendTweet(text, null, mediaData);
}


async function login(){

    const isLoggedIn = await scraper.isLoggedIn();
    if (isLoggedIn){
        return
    }


    await scraper.login(
        process.env.X_LOGIN,
        process.env.X_PASSWORD,
    ); 
}

