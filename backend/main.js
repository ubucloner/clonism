import cron from 'node-cron';
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
    let firstAction = normalActions.postATweet.callback;
    const actionEverySecondsNb = 3600;
    wakeUp(normalActions, firstAction, actionPerMinute, actionEverySecondsNb);
};

const launchReply = () => {
    const replyActionPerMinute = character.replyActionPerMinute;
    let firstReplyAction = replyActions.replyToUsers.callback;
    const replyActionEverySecondsNb = 1800;
    
    setTimeout(() => {
        wakeUp(replyActions, firstReplyAction, replyActionPerMinute, replyActionEverySecondsNb);
    }, 35 * 60 * 1000);
}

// cron.schedule('0 0 * * 0', async() => {
//     console.log("It's Sunday 00:00, time to create a poll!");
//     await createPoll();
// });

// cron.schedule('0 0 * * 1', async() => {
//     console.log("It's Monday 00:00, time to check poll results!");
//     await closePoll();
// });

const start = () => {
    if (process.env.POST_FEATURE === "true") {
    launchPost();
    }

    if (process.env.REPLY_FEATURE === "true") {
        launchReply();
    }
};

start();
