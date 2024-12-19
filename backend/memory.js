import { produceJson } from "./llm/anthropicAdapter.js"

let memories = [
]

export function addMemory(memory){
    memories.push(memory)
}

export function getMemoryAsText(){
    console.log("memory", memories)
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
    console.log(memories)
}