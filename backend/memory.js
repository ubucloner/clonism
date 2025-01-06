import { produceJson } from "./llm/anthropicAdapter.js"
import fs from "fs"

/**
 * @var string[]
 */
let memories = []

export function addMemory(memory){
    memories.push(memory)
}

export function getMemoryAsText(){
    return JSON.stringify(memories)
}

export async function consolidateMemory(){
    let strMemory = getMemoryAsText()
    let prompt = `
    Your memory of past experiences is: ${strMemory}
    Summarize the most important memories and delete some 
    return the new memory as a new JSON array
    Do not make any other comment. 
    the new memory is:
    `
    memories = await produceJson(prompt)
    console.log("memory", memories)
}

/**
 * The file should not be too big (roughly max 150k caracters) 
 */
export function loadMemoryFromJson(path) {
    if (!fs.existsSync(path)) {
        console.log(`memory file ${path} does not exist, skipping`)

        return 
    }
    const data = fs.readFileSync(path, 'utf8');
    memories = JSON.parse(data);
    console.log("memory file loaded!")
}