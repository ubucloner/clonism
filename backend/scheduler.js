export function scheduleJob(actionPerminutes, everyMinutesNb, taskCallback){
    return setInterval(taskCallback, (1 / actionPerminutes) * everyMinutesNb * 1000)
}
