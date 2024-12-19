
import { makeAPicturePost, makeATextPost } from "./makeAPost.js";
import { loadCharacterFromJson, sleep, wakeUp } from "./character.js";
import { readRandomNews } from "./newsFeedReader.js";
import { addMemory } from "./memory.js";

let character = loadCharacterFromJson("character.yaml")

let newsRssUrl = character.newsRssUrl
let moods = character.available_moods

const actions = {
    postATweet: {
        probability: 0.2,
        callback: () => {
           let mood = moods[Math.floor(Math.random() * moods.length)];
           console.log(`I am ${mood}... let's make some post`);
           makeATextPost(character, mood)
        }
    },
    readSomeNews: {
        probability:0.2,
        callback: () => {
            let piece =  readRandomNews(newsRssUrl)
           
        }
    },
    doNothing: {
        probability: 0.15,
        callback: () => {
            let action = "Doing nothing, just chillin'!" 
            console.log(action)
            addMemory(action)
        }
    },
    sleeping: {
        probability: 0.05,
        callback: () => {
            console.log("let's get some sleep")
            sleep()
        }
    },
    postAPicture: {
        probability: 0.4,      // 20% chance 
        callback: () => {
            let mood = moods[Math.floor(Math.random() * moods.length)];
            console.log(`I am ${mood}... let's make make some art`);
            makeAPicturePost(character)
        }
    }
};

let frequency = character.actionFrequency 

wakeUp(actions, frequency)