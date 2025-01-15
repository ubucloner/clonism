
import fs from "fs"
import yaml from "js-yaml"
import { scheduleJob } from "./scheduler.js";
import { consolidateMemory } from "./memory.js";

let interval = null

export function wakeUp(actions, firstAction, actionPerminutes, everyMinutesNb){
   
    interval = scheduleJob(actionPerminutes, everyMinutesNb, () => {
        let action = sampleAction(actions)
        action()
    })   

    firstAction() 
}

export function sleep(){
   
    consolidateMemory()
}

export function loadCharacterFromJson(path){

    const data = fs.readFileSync(path, 'utf8');

    return yaml.load(data)
}

export function sampleAction(actions) {
    const total = Object.values(actions)
                        .reduce((sum, action) => sum + action.probability, 0);
    let random = Math.random() * total;
    
    for (const [actionName, action] of Object.entries(actions)) {
        random -= action.probability;
        if (random <= 0) {
            return action.callback;
        }
    }
    return Object.values(actions)[0].callback; // Fallback to first action
}
