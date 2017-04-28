class Timer {
    constructor(duration, name) {
        this.overallDuration = duration;
        this.name = name;
        this.setInitialPosition();
    }

    _stop() {
        clearTimeout(this.updaterFunctionId);
        clearTimeout(this.overallTimerId);
    }

    setInitialPosition() {
        this._stop();
        this._remainingDurationAfterLastPause = this.overallDuration;
    }

    setAlarm(finishFunction, updaterFunction, updaterFunctionFrequency) { //todo как отсчитывать время по-другому
        this.startTime = new Date();
        this.overallTimerId = setTimeout(() => {
            this.setInitialPosition();
            finishFunction();
        }, this._remainingDurationAfterLastPause);
        updaterFunction();
        this.updaterFunctionId = setInterval(updaterFunction, updaterFunctionFrequency);
    }

    pauseAlarm() {
        this._remainingDurationAfterLastPause = this.getRemaining();
        this._stop();
    }

    getRemaining() {
        return this.startTime.getTime()  + this._remainingDurationAfterLastPause - new Date().getTime()
    }
}

