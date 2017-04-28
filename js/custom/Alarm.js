class Alarm {
    constructor(duration, name) {
        this.overallDuration = duration;
        this.name = name;
        this.isStarted = false;
    }

    setAlarm(finishFunction, setUpdaterFunction, setUpdaterFunctionDuration) { //todo как отсчитывать время нормально
        if (!this.isStarted)
        {
            this._remainingDurationAfterLastPause = this.overallDuration;
            this.isStarted = true;
        }

        this.startTime = new Date();

        this.overallTimerId = setTimeout(() => {
            this.stop();
            this.isStarted = false;
            finishFunction();
        }, this._remainingDurationAfterLastPause);
        setUpdaterFunction();
        this.updaterFunctionId = setInterval(setUpdaterFunction, setUpdaterFunctionDuration);
    }

    pauseAlarm() {
        this._remainingDurationAfterLastPause = this.getRemaining();
        this.stop();
    }

    getRemaining() {
        return this.startTime.getTime()  + this._remainingDurationAfterLastPause - new Date().getTime()
    }

    stop() {
        clearTimeout(this.updaterFunctionId);
        clearTimeout(this.overallTimerId);
    }
}

