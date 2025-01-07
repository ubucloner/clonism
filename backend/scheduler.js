export function scheduleJob(actionPerminutes, taskCallback){
    return setInterval(taskCallback, (1 / actionPerminutes) * 1800 * 1000)
}
