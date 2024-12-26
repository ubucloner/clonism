import { makeAPicturePost, makeATextPost, makeATrendPicturePost, makeATrendPost } from "./makeAPost.js";
import { loadCharacterFromJson, sleep, wakeUp } from "./character.js";
import { readRandomNews } from "./newsFeedReader.js";
import { addMemory } from "./memory.js";

let character = loadCharacterFromJson("fucktard.character.yaml")

let newsRssUrl = character.newsRssUrl
let moods = character.available_moods
const actions = {
    postATweet: {
        probability: character.actionProbabilities.postATweet,
        callback: () => {
           let mood = moods[Math.floor(Math.random() * moods.length)];
           console.log(`I am ${mood}... let's make some post`);
           makeATextPost(character, mood)
        }
    },
    postATrendTweet: {
        probability: character.actionProbabilities.postATrendTweet,
        callback: () => {
           let mood = moods[Math.floor(Math.random() * moods.length)];
           console.log(`I am ${mood}... let's make some post`);
           makeATrendPost(character, mood)
        }
    },
    readSomeNews: {
        probability: character.actionProbabilities.readSomeNews,
        callback: () => {
            readRandomNews(newsRssUrl)
           
        }
    },
    doNothing: {
        probability: character.actionProbabilities.doNothing,
        callback: () => {
            let action = "Doing nothing, just chillin'!" 
            console.log(action)
            addMemory(action)
        }
    },
    sleeping: {
        probability: character.actionProbabilities.sleeping,
        callback: () => {
            console.log("let's get some sleep")
            sleep()
        }
    },
    postAPicture: {
        probability: character.actionProbabilities.postAPicture,
        callback: () => {
            let mood = moods[Math.floor(Math.random() * moods.length)];
            console.log(`I am ${mood}... let's make some art`);
            makeAPicturePost(character, mood)
        }
    },
    postATrendPicture: {
        probability: character.actionProbabilities.postATrendPicture,
        callback: () => {
            let mood = moods[Math.floor(Math.random() * moods.length)];
            console.log(`I am ${mood}... let's make some art`);
            makeATrendPicturePost(character, mood)
        }
    }
};

let actionPerMinute = character.actionPerMinute 
let firstAction = actions.postATweet.callback
wakeUp(actions, firstAction, actionPerMinute)