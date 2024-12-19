
export function scheduleJob(frequencyInMinutes, taskCallback){
    return setInterval(taskCallback, frequencyInMinutes * 60 * 1000) 
}
