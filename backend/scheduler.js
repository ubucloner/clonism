export function scheduleJob(actionsPerMinute, taskCallback) {

    if (actionsPerMinute === 0){
        return
    }
    // Validation des entrées
    if (actionsPerMinute <= 0) {
        throw new Error('actionsPerMinute must be greater than 0');
    }
    if (typeof taskCallback !== 'function') {
        throw new Error('taskCallback must be a function');
    }

    // Calcul plus intuitif : (60 secondes / actions par minute) * 1000ms
    const msInterval = (60 / actionsPerMinute) * 1000;

    return setInterval(taskCallback, msInterval);
}