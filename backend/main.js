
import { makeAPicturePost, makeATextPost, makeATrendPicturePost, makeATrendPost, replyToMentions, replyToUsers } from "./makeAPost.js";
import { loadCharacterFromJson, sleep, wakeUp } from "./character.js";
import { readRandomNews } from "./newsFeedReader.js";
import { addMemory } from "./memory.js";

let character = loadCharacterFromJson("character.yaml")

let newsRssUrl = character.newsRssUrl
let moods = character.available_moods
const normalActions = {
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
    },
};

const replyActions = {
    replyToMentions: {
        probability: character.replyActionProbabilities.replyToMentions,
        callback: () => {
           let mood = moods[Math.floor(Math.random() * moods.length)];
           console.log(`I am ${mood}... let's reply to a mention post`);
           replyToMentions(character, mood)
        }
    },
    replyToUsers: {
        probability: character.replyActionProbabilities.replyToUsers,
        callback: () => {
           let mood = moods[Math.floor(Math.random() * moods.length)];
           console.log(`I am ${mood}... let's reply to a user post`);
           replyToUsers(character, mood)
        }
    }
}


const launchPost = () => {

    const actionPerMinute = character.actionPerMinute;
    let firstAction = normalActions.postAPicture.callback;
    wakeUp(normalActions, firstAction, actionPerMinute);
};

const launchReply = () => {
    
    const replyActionPerMinute = character.replyActionPerMinute;
    let firstReplyAction = replyActions.replyToUsers.callback;
    setTimeout(() => {
        wakeUp(replyActions, firstReplyAction, replyActionPerMinute);
    }, 35 * 60 * 1000);
}



const start = () => {
    if (process.env.POST_FEATURE === "true") {
    launchPost();
    }

    if (process.env.REPLY_FEATURE === "true") {
        launchReply();
    }
};

start();
