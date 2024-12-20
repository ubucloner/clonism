import "./loadEnv.js"

import { addMemory, getMemoryAsText } from "./memory.js";
import { generateImage } from "./replicateAdapter.js"
import { postTweet, postTweetWithImage } from "./twitter/twitterClientPoster.js";
import { completeText, produceJson } from "./llm/anthropicAdapter.js";


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

export async function makeAPicturePost(artist, mood){

    let {model:modelVersion, character, style_prompt} = artist
    let output = await generateImagePrompt(character, style_prompt, mood)
    
    let [imageGenerationPrompt, tweetText] = output

    try {
        let urls = await generateImage(modelVersion, imageGenerationPrompt)
        let url = urls[0]
        
        let memory = `created an art about ${imageGenerationPrompt}`
        addMemory(memory)
        console.log(memory)
        await postTweetWithImage(tweetText, url)
        console.log('posted!')
    } catch (error) {
        console.error('Alas, I did not have enough inspiration to complete the painting')
    }
}

async function generateImagePrompt(characterPrompt, style_prompt, mood, topic){   

    let specificDemand = topic? 
                            `You decide to generate something related to this theme: ${topic}` : 
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
