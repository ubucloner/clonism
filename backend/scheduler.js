export function scheduleJob(actionPerminutes, taskCallback){
    return setInterval(taskCallback, (1 / actionPerminutes) * 60 * 1000)
}
