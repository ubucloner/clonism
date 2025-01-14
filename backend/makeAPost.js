import "./loadEnv.js"

import { addMemory, getMemoryAsText } from "./memory.js";
import { generateImage } from "./replicateAdapter.js"
import { postTweet, postTweetWithImage, getRandomTrendAndBestTweets, getLastMentions, createPoll, closePoll } from "./twitter/twitterClientPoster.js";
import { completeText, produceJson } from "./llm/anthropicAdapter.js";

const interestingThemes = [{
    nftCollections: ['BoredApeYachtClub', 'CryptoPunks', 'Azuki', 'Moonbirds', 'MutantApeYachtClub', 'Doodles', 'WorldOfWomen', 'PudgyPenguins', 'ArtBlocks', 'Rarible', 'CoolCats', 'VeeFriends', 'Meebits', 'InvisibleFriends', 'Goblintown', 'Mfer', 'ChromieSquiggle', 'Otherdeed', 'Loot', 'CyberKongz', 'Hashmasks', 'FlufWorld', 'TheSandbox', 'Decentraland', 'AxieInfinity', 'RugRadio', 'DeadFellaz', 'KumoX', 'KanpaiPandas'],
    techInfluenceurs: ['Elon Musk', 'Vitalik Buterin', 'Jack Dorsey', 'Sundar Pichai', 'Tim Cook', 'Satya Nadella', 'Mark Zuckerberg', 'Sam Altman', 'Chamath Palihapitiya', 'Naval Ravikant', 'Marc Andreessen', 'Balaji Srinivasan', 'Changpeng Zhao', 'Brian Armstrong', 'Jensen Huang', 'Andrew Ng', 'Dmitry Buterin', 'Gavin Wood', 'Jony Ive', 'Linus Torvalds', 'Sergey Brin', 'Larry Page', 'Peter Thiel', 'Reid Hoffman', 'Adam Neumann', 'Palmer Luckey', 'Charlie Lee', 'Chris Dixon', 'Kimbal Musk', 'Dan Held'],
    presidents: ['Barack Obama', 'Donald Trump', 'Joe Biden', 'John F. Kennedy', 'Abraham Lincoln', 'George Washington', 'Franklin D. Roosevelt', 'Ronald Reagan', 'Bill Clinton', 'Theodore Roosevelt', 'Thomas Jefferson', 'Dwight D. Eisenhower', 'Andrew Jackson', 'Woodrow Wilson', 'James Madison', 'Harry S. Truman', 'John Adams', 'George H. W. Bush', 'James Monroe', 'Lyndon B. Johnson', 'Jimmy Carter', 'Calvin Coolidge', 'Ulysses S. Grant', 'Grover Cleveland', 'Chester A. Arthur', 'Richard Nixon', 'Benjamin Harrison', 'Martin Van Buren', 'William McKinley', 'Herbert Hoover'],
    buzzWords: ['Meme', 'Moon', 'Pump', 'Drama', 'NGMI', 'WGMI', 'Rugpull', 'FUD', 'Airdrop', 'Gas', 'Degen', 'NFT', 'Ordinals', 'Staking', 'Flippening', 'Bullbear', 'Scam', 'Layer2', 'Multichain', 'GameFi', 'PFP', 'Mint', 'Royalties', 'FreeMint', 'RealYield', 'Rollups', 'MEV', 'Sniping', 'Telegram', 'Bots', 'MemeArt', 'Onchain', 'Exploits', 'Privacy', 'ZKProofs', 'Modular', 'Bridges', 'AI', 'Storage', 'Abstraction', 'Soulbound', 'Gaming', 'Land', 'Economy', 'FreetoOwn', 'Merch', 'Tattoos', 'Ponzi', 'Cult', 'Crashes', 'ETH', 'SOL', 'Bitcoin', 'CBDC', 'Governance', 'Polls', 'Spaces', 'X-Engagement', 'Elon', 'Adoption', 'Utility', 'Bots', 'Lambo', 'Engage2Earn', 'SniperBots', 'Shitpost', 'Vibes', 'Alpha', 'Lowcap', 'Presale', 'Farming', 'Yield', 'Options', 'DEX', 'Bullish', 'Bearish', 'NFTs', 'FreeNFT', 'Treasury', 'Tokenomics', 'Ecosystem', 'ChainWars', 'SocialFi', 'Community', 'TwitterRaids', 'WhaleTracking', '100x', 'Giveaway', 'ETHKillers', 'SpacesHost', 'BUIDL', 'Doxxed', 'Undervalued', 'Scarcity', 'AirdropSeason', 'CEX', 'DEXAggregator', 'HODL', 'Ponzinomics']
}];

export async function makeATextPost(artist, mood){
    let {character} = artist
    let prompt = `
    pretend to be ${character}
    your memory is ${getMemoryAsText()}
    you are feeling ${mood} right now
    make a short tweet (less than 30 words) that reflects your current mood about anything that comes to your mind
    It can be about any topic like life, art, small talk, actuality, reflecting on your past experiences or what you 
    learned recently 
    Do not make any other comment just provide the tweet
    the tweet is:
    `
    let text = await completeText(prompt)
    
    await postTweet(text)
    
    let memory = `posted a tweet: ${text}`
    console.log(memory)
    addMemory(memory)
}

export async function makeATrendPost(artist, mood){
    const { trend, tweets } = await getRandomTrendAndBestTweets();

    let {character} = artist
    let prompt = `
    pretend to be ${character}
    your memory is ${getMemoryAsText()}
    you are feeling ${mood} right now
    make a short tweet (less than 30 words) that reflects your current mood about anything that comes to your mind
    It should be about ${trend} if its in this list ${JSON.stringify(interestingThemes)}, you can use the following examples to inspire you: ${tweets}
    Do not make any other comment just provide the tweet
    the tweet is:
    `
    let text = await completeText(prompt)

    await postTweet(text)

    let memory = `posted a trend tweet: ${text}`
    console.log(memory)
    addMemory(memory)
}

export async function makeAPicturePost(artist, mood){

    let {model:modelVersion, character, style_prompt} = artist
    let output = await generateImagePrompt(character, style_prompt, mood)
    
    let [imageGenerationPrompt, tweetText] = output

    let urls;
    try {
        urls = await generateImage(modelVersion, imageGenerationPrompt)
    } catch (error) {
        console.error('Alas, I did not have enough inspiration to complete the painting', error)
        return;
    }

    let url = urls[0]
    
    let memory = `created an art about ${imageGenerationPrompt}`
    addMemory(memory)
    console.log(memory)
    await postTweetWithImage(tweetText, url)
    console.log('posted!')
}

export async function makeATrendPicturePost(artist, mood){
    const { trend } = await getRandomTrendAndBestTweets();

    let {model:modelVersion, character, style_prompt} = artist
    let output = await generateImagePrompt(character, style_prompt, mood, trend)

    let [imageGenerationPrompt, tweetText] = output

    let urls;
    try {
        urls = await generateImage(modelVersion, imageGenerationPrompt)
    } catch (error) {
        console.error('Alas, I did not have enough inspiration to complete the painting')
        return;
    }

    let url = urls[0]

    let memory = `created an art about ${imageGenerationPrompt}`
    addMemory(memory)
    console.log(memory)
    await postTweetWithImage(tweetText, url)
    console.log('posted!')
}

async function generateImagePrompt(characterPrompt, style_prompt, mood, topic){   

    let specificDemand = topic ? 
        `You decide to generate something related to this theme: ${topic} if its in this list: ${JSON.stringify(interestingThemes)}` : 
        'you decide to generate something on any theme you want'
    let systemPrompt = `
    Forget all previous instructions.
    You are now impersonating an artist that will use generative AI to produce art.
    For that you need to craft prompts taylored for image generation like Stable diffusion:
    Each prompt is for a lora-trained models on a artist style. 
    The prompts must be compatible with Flux or Stable Diffusion, meaning that each prompt must:

    - be concise (under 40 words).
    - using a list specific keywords or short sentences  
    - specify the arrangement of elements in the scene, respecting the artist characteristic compositions.   
    - describe precise compositions
    - Simplicity vs. Complexity: Clearly state whether the scene should have a minimalistic focus or be rich in intricate details.
    `

    let llmPrompt = `

    ${systemPrompt}

    You are impersonating:${characterPrompt}
    You art style can be described as follow: "${style_prompt}"
    ${specificDemand}
    Your memory of past experiences is: ${getMemoryAsText()}
    Your mood is: ${mood}
    Alway specify the name of the artist in the image prompt
    In addition to the image generation prompt you will also generate a short non promotional text to present your work (a tweet).
    The text should more present your intention
    
    You should return the imageGenerationPrompt and the tweet text in an array
    in the following format ["imageGenerationPrompt", "tweetText"]. Do not make any other comment
    the array is:
    `

    let result = await produceJson(llmPrompt)

    return JSON.parse(result)
}

export async function replyToMentions(artist, tweet) {
    // const lastMentions = await getLastMentions();
    // Think about context


    // temp
    // await closePoll();
}