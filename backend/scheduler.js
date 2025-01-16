export function scheduleJob(actionPerminutes, everySecondsNb, taskCallback){
    return setInterval(taskCallback, (1 / actionPerminutes) * everySecondsNb * 1000)
}
