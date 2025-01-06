import { makeAPicturePost, makeATextPost } from "./makeAPost.js";
import { loadCharacterFromJson, sleep, wakeUp } from "./character.js";
import { readRandomNews } from "./newsFeedReader.js";
import { addMemory, loadMemoryFromJson } from "./memory.js";

let character = loadCharacterFromJson("character.yaml")

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
    }
};

let actionPerMinute = character.actionPerMinute 
let firstAction = actions.postAPicture.callback 

if (character.initialMemoryJsonPath){
    loadMemoryFromJson(character.initialMemoryJsonPath)
}

wakeUp(actions, firstAction, actionPerMinute)