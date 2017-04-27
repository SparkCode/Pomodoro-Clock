'use strict';

function Alarm(duration, name) {
    this.overallDuration = duration;
    this.name = name;
    this.isStarted = false;
}

Alarm.prototype.setAlarm = function (finishFunction, setUpdaterFunction, setUpdaterFunctionDuration) { //todo как отсчитывать время нормально
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
};

Alarm.prototype.pauseAlarm = function () {
    this._remainingDurationAfterLastPause = this.getRemaining();
    this.stop();
};

Alarm.prototype.getRemaining = function () {
    return this.startTime.getTime()  + this._remainingDurationAfterLastPause - new Date().getTime()
};

Alarm.prototype.stop = function () {
    clearTimeout(this.updaterFunctionId);
    clearTimeout(this.overallTimerId);
};