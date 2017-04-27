$(document).ready(init);

'use strict';

let timerBlock = {
    init: function () {
        this.element = $("#timer-block")[0];
        this.progressBar.init();
        this.alarmNameLabel.init();
        this.alarmDurationLabel.init();
        this.remainingTimeLabel.init();
        this.pauseOrStartButton.init();
    },

    setVisible : function () {
        this.element.style.visibility = "visible";
    }
};

timerBlock.pomodoroWorker = { //todo вынести отсюда?
    init: function (sessionAlarm, breakAlarm) {
        !this.sessionAlarm || this.sessionAlarm.stop();
        !this.breakAlarm || this.breakAlarm.stop();

        this.sessionAlarm = sessionAlarm;
        this.breakAlarm = breakAlarm;
        this.state = this.BREAK;
    },

    start: function () { //todo - rename
        this.getCurrentAlarm().setAlarm(this.prepare.bind(this), this.updaterHandler.bind(this), 1000);
    },

    prepare: function () { //todo - rename
        timerBlock.pauseOrStartButton.state = timerBlock.pauseOrStartButton.WORKING; //todo это точно должно быть здесь?

        if (this.state === this.SESSION)
        {
            notificationBlock.alertPlace.setNotification(notificationBlock.SESSION_DONE_ALERT);
            this.state = this.BREAK;
        }
        else
        {
            debugger;
            notificationBlock.alertPlace.setNotification(notificationBlock.SESSION_STARTED_ALERT);
            this.state = this.SESSION;
        }

        timerBlock.alarmNameLabel.setValue(this.getCurrentAlarm().name);
        timerBlock.alarmDurationLabel.setValue(this.getCurrentAlarm().overallDuration);
        this.start();
    },

    pause: function () {
        this.getCurrentAlarm().pauseAlarm();
        notificationBlock.alertPlace.setNotification(notificationBlock.TIMER_STOPPED_ALERT);
    },

    resume: function () {
        if (this.state === this.SESSION)
            notificationBlock.alertPlace.setNotification(notificationBlock.SESSION_STARTED_ALERT);
        else
            notificationBlock.alertPlace.setNotification(notificationBlock.SESSION_DONE_ALERT);
        this.start();
    },

    updaterHandler: function () {
        let alarm = this.getCurrentAlarm();
        let percentage = 100 - alarm.getRemaining()* 100 / alarm.overallDuration;
        timerBlock.progressBar.setValue(percentage);
        timerBlock.remainingTimeLabel.setValue(alarm.startTime.getTime()  + alarm.remainingDuration - new Date().getTime());
    },

    getCurrentAlarm : function () {
        return this.state ===  this.SESSION ? this.sessionAlarm : this.breakAlarm;
    },

    BREAK: 1,
    SESSION: 2
};

timerBlock.progressBar = {
    init : function () {
        this.element = $(".progress-bar")[0];
    },
    
    setValue : function (percentage) {
        this.element.style.width = percentage + "%";
    }
};

timerBlock.alarmNameLabel = {
    init : function () {
        this.element = $("#alarm-name")[0];
    },

    setValue : function (name) {
        this.element.innerHTML = name;
    }
};

timerBlock.alarmDurationLabel = {
    init: function () {
        this.element = $("#alarm-duration")[0];
    },
    
    setValue: function (ms) {
        this.element.innerHTML  = new Date(0, 0,0,0,0,0, ms).toTimeString().split(' ')[0];
    }
};

timerBlock.remainingTimeLabel = {
    init: function () {
        this.element = $("#remaining-time")[0];
    },

    setValue: function (ms) {
        this.element.innerHTML  = new Date(0, 0,0,0,0,0, ms).toTimeString().split(' ')[0];
    }
};

timerBlock.pauseOrStartButton = {
    init: function () {
        this.element = $("#pause-or-start-button")[0];
        this.state = this.PAUSE;
        this.setHandle();
    },

    setHandle: function () {
        this.element.onclick = this.onclick.bind(this);
    },

    onPause: function () {
        timerBlock.pomodoroWorker.resume();
    },

    onWorking: function () {
        timerBlock.pomodoroWorker.pause();
    },

    setName: function (value) {
        this.element.innerHTML = value;
    },

    changeState: function () {
        this.state = this.state === this.PAUSE ? this.WORKING : this.PAUSE;
    },

    onclick: function () {
        debugger;
        if (this.state === this.PAUSE)
            this.onPause();
        else
            this.onWorking();
        this.changeState();

        if (this.state === this.PAUSE)
            this.setName("RESTART");
        else
            this.setName("PAUSE");
    },

    PAUSE: 1,
    WORKING: 2
};

function Alarm(duration, name) {
    this.overallDuration = duration;
    this.name = name;
    this.isStarted = false;
}

Alarm.prototype.setAlarm = function (finishFunction, setUpdaterFunction, setUpdaterFunctionDuration) { //todo как отсчитывать время нормально
    if (!this.isStarted)
    {
        this.remainingDuration = this.overallDuration; // todo rename
        this.isStarted = true;
    }

    this.startTime = new Date();

    this.overallTimerId = setTimeout(() => {
        this.stop();
        this.isStarted = false;
        finishFunction();
    }, this.remainingDuration);
    setUpdaterFunction();
    this.updaterFunctionId = setInterval(setUpdaterFunction, setUpdaterFunctionDuration);
};

Alarm.prototype.pauseAlarm = function () {
    this.remainingDuration = this.getRemaining();
    this.stop();
};

Alarm.prototype.getRemaining = function () {
    return this.startTime.getTime()  + this.remainingDuration - new Date().getTime()
};

Alarm.prototype.stop = function () {
    clearTimeout(this.updaterFunctionId);
    clearTimeout(this.overallTimerId);
};


let pomodoroSettingsBlock = {
    init: function () {
        this.configurateButton.init();

        let sessionElement = $("#session-time-amount")[0];
        let breakElement = $("#break-time-amount")[0];
        this.session = new ValidatedTimer(sessionElement, "Session", 1, 99, 30);
        this._break = new ValidatedTimer(breakElement, "Break", 1, 99, 5);

        pomodoroSettingsBlock.setChangerButton($("#session-incrementer")[0], this.session, +1);
        pomodoroSettingsBlock.setChangerButton($("#session-decrementer")[0], this.session, -1);
        pomodoroSettingsBlock.setChangerButton($("#break-incrementer")[0], this._break, +1);
        pomodoroSettingsBlock.setChangerButton($("#break-decrementer")[0], this._break, -1);
    },

    setChangerButton: function (element, timer, diff) {
        element.onclick = timer.changeValue.bind(timer, diff);
    }
};

pomodoroSettingsBlock.configurateButton = {
    init : function () {
        let element = this.findElement();
        this.addHandler(element);
    },

    findElement: function () {
        return $("#pomodoro-starter")[0];
    },

    addHandler: function () {
        this.findElement().onclick = this.handleButtonClick;
    },

    handleButtonClick: function () {
        let sessionAlarm = new Alarm(pomodoroSettingsBlock.session.getValue() * 1000 * 60, pomodoroSettingsBlock.session.name);
        let breakAlarm = new Alarm(pomodoroSettingsBlock._break.getValue() * 1000 * 60, pomodoroSettingsBlock._break.name);
        timerBlock.pomodoroWorker.init(sessionAlarm, breakAlarm);
        timerBlock.pomodoroWorker.prepare();
        timerBlock.setVisible();
    }
};

function Timer(element, name) {
    this.element = element;
    this.name = name;
}

Timer.prototype.getElementValue = function (){
    return $(this.element).val();
};

Timer.prototype.setElementValue = function (value) {
    $(this.element).val(value);
};

function ValidatedTimer(element, name, min, max, _default) {
    Timer.apply(this, arguments);
    this.min = min;
    this.max = max;
    this.default = _default;
    this.validateValueLength();
}

ValidatedTimer.prototype = Object.create(Timer.prototype);
ValidatedTimer.prototype.constructor = ValidatedTimer;

ValidatedTimer.prototype.setValue = function (value) {
    this.validateValue(value);
    this.setElementValue(value);

};

ValidatedTimer.prototype.changeValue = function (diff) {
    let curr = this.getValue();
    this.setValue(+curr + diff);
};

ValidatedTimer.prototype.getValue = function () {
    let value = +this.getElementValue();
    this.validateValue(value);
    return value;
};

ValidatedTimer.prototype.validateValueLength = function () {
    this.element.onkeyup = () => {
        let val = this.getElementValue();
        val.length > 2 && this.setElementValue(val.slice(0, 2));
    }
};

ValidatedTimer.prototype.validateValue = function (value) {
    value = +value;
    let isValid = value && value >= this.min && value <= this.max;
    if (!isValid)
    {
        this.setElementValue(this.default);
        throw new UserError("The " + this.name + " should be a number between " + this.min + " and " + this.max);
    }
};


function UserError(message = 'Default Message') {
    this.name = "UserError";
    this.message = message;
    this.stack = new Error().stack;
}

UserError.prototype = Object.create(Error.prototype);
UserError.prototype.constructor = UserError;

let notificationBlock = {
    init: function () {
        this.alertPlace.init();
        this.SESSION_DONE_ALERT = this._getNotification("done-session-alert");
        this.SESSION_STARTED_ALERT = this._getNotification("started-session-alert");
        this.TIMER_STOPPED_ALERT = this._getNotification("stopped-timer-alert");
        this.USER_ERROR_HAPPENED_ALERT = this._getNotification("error-alert");
    },
    
    _getNotification: function (stateType) {
        return $(`div[data-type=\'${stateType}\']`)[0];
    },
};

notificationBlock.alertPlace = {
    init: function () {
        this.element = $("#alert-place")[0];
    },

    setNotification: function (element, text) {
        text && (element.innerHTML = text);
        this.element.innerHTML = "";
        this.element.appendChild(element);
    }
};

function init() {
    timerBlock.init();
    pomodoroSettingsBlock.init();
    notificationBlock.init();

    window.onerror = function (msg, url, lineNo, columnNo, error) {
        notificationBlock.alertPlace.setNotification(notificationBlock.USER_ERROR_HAPPENED_ALERT, error.message);
    }
}






