$(document).ready(init);

'use strict';

let timerBlock = {
    init: function () {
        this.element = $("#timer-block")[0];
    },

    setVisible : function () {
        this.element.style.visibility = "visible";
    }
};

let configurateButton = {
    init : function () {
        let element = this.findElement();
        this.addHandler(element);
    },

    findElement: function () {
        return $("#pomodoro-starter")[0];
    },

    addHandler: function (element) {
        this.findElement().onclick = this.handleButtonClick;
    },

    handleButtonClick: function () {
        let sessionAlarm = new Alarm(session.getValue() * 1000 * 60, "Session");
        let breakAlarm = new Alarm(_break.getValue() * 1000 * 60, "Break");
        pomodoroWorker.init(sessionAlarm, breakAlarm);
        pomodoroWorker.prepare();
        timerBlock.setVisible();
    }
};

let pomodoroWorker = {
    init: function (sessionAlarm, breakAlarm) {
        !this.sessionAlarm || this.sessionAlarm.stop();
        !this.breakAlarm || this.breakAlarm.stop();

        this.sessionAlarm = sessionAlarm;
        this.breakAlarm = breakAlarm;
        this.state = pomodoroWorker.BREAK;
    },

    start: function () { //todo - rename
        this.getCurrentAlarm().setAlarm(this.prepare.bind(this), this.updaterHandler.bind(this), 1000);
    },

    prepare: function () { //todo - rename
        pauseOrStartButton.state = pauseOrStartButton.WORKING;

        if (this.state === pomodoroWorker.SESSION)
        {
            notification.setNotification(Notification.SESSION_DONE);
            this.state = pomodoroWorker.BREAK;
        }
        else
        {
            notification.setNotification(Notification.SESSION_STARTED);
            this.state = pomodoroWorker.SESSION;
        }

        alarmNameLabel.setValue(this.getCurrentAlarm().name);
        alarmDurationLabel.setValue(this.getCurrentAlarm().overallDuration);
        this.start();
    },

    pause: function () {
        this.getCurrentAlarm().pauseAlarm();
        notification.setNotification(Notification.TIMER_STOPPED);
    },

    resume: function () {
        if (this.state === pomodoroWorker.SESSION)
            notification.setNotification(Notification.SESSION_STARTED);
        else
            notification.setNotification(Notification.SESSION_DONE);
        this.start();
    },

    updaterHandler: function () {
        let alarm = this.getCurrentAlarm();
        let percentage = 100 - alarm.getRemaining()* 100 / alarm.overallDuration;
        progressBar.setValue(percentage);
        remainingTimeLabel.setValue(alarm.startTime.getTime()  + alarm.remainingDuration - new Date().getTime());
    },

    getCurrentAlarm : function () {
        return this.state ===  pomodoroWorker.SESSION ? this.sessionAlarm : this.breakAlarm;
    }
};

pomodoroWorker.BREAK = 1;
pomodoroWorker.SESSION = 2;



let progressBar = {
    init : function () {
        this.element = $(".progress-bar")[0];
    },
    
    setValue : function (percentage) {
        this.element.style.width = percentage + "%";
    }
};

let alarmNameLabel = {
    init : function () {
        this.element = $("#alarm-name")[0];
    },

    setValue : function (name) {
        this.element.innerHTML = name;
    }
};

let alarmDurationLabel = {
    init: function () {
        this.element = $("#alarm-duration")[0];
    },
    
    setValue: function (ms) {
        this.element.innerHTML  = new Date(0, 0,0,0,0,0, ms).toTimeString().split(' ')[0];
    }
};

let remainingTimeLabel = {
    init: function () {
        this.element = $("#remaining-time")[0];
    },

    setValue: function (ms) {
        this.element.innerHTML  = new Date(0, 0,0,0,0,0, ms).toTimeString().split(' ')[0];
    }
};

let pauseOrStartButton = {
    init: function () {
        this.element = $("#pause-or-start-button")[0];
        this.state = pauseOrStartButton.PAUSE;
        this.setHandle();
    },

    setHandle: function () {
        this.element.onclick = this.onclick.bind(this);
    },

    onPause: function () {
        pomodoroWorker.resume();
    },

    onWorking: function () {
        pomodoroWorker.pause();
    },

    setName: function (value) {
        this.element.innerHTML = value;
    },

    changeState: function () {
        this.state = this.state === pauseOrStartButton.PAUSE ? pauseOrStartButton.WORKING : pauseOrStartButton.PAUSE;
    },

    onclick: function () {
        debugger;
        if (this.state === pauseOrStartButton.PAUSE)
            this.onPause();
        else
            this.onWorking();
        this.changeState();

        if (this.state === pauseOrStartButton.PAUSE)
            this.setName("RESTART");
        else
            this.setName("PAUSE");
    }
};

pauseOrStartButton.PAUSE = 1;
pauseOrStartButton.WORKING = 2;

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


function Timer(element) {
    this.element = element;
}

Timer.prototype.getElementValue = function (){
    return $(this.element).val();
};

Timer.prototype.setElementValue = function (value) {
    $(this.element).val(value);
};

function ValidatedTimer(element, min, max, _default) {
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
        throw new UserError("Number should be more than " + this.min + " and less than " + this.max);
    }
};

function setChangerButton(element, timer, diff) {
    element.onclick = timer.changeValue.bind(timer, diff);
}

function UserError(message = 'Default Message') {
    this.name = "UserError";
    this.message = message;
    this.stack = new Error().stack;
}

UserError.prototype = Object.create(Error.prototype);
UserError.prototype.constructor = UserError;

function Notification(elementStateMap, alertPlaceElement) {
    this.elementStateMap = elementStateMap;
    this.alertPlaceElement = alertPlaceElement;
}

Notification.prototype.setNotification = function (state) {
    this._closeAllNotification();
    this.alertPlaceElement.appendChild(this.elementStateMap[state]);

};

Notification.prototype._closeAllNotification = function () {
    this.alertPlaceElement.innerHTML = "";
};

Notification.SESSION_DONE = 1;
Notification.SESSION_STARTED = 2;
Notification.TIMER_STOPPED = 3;
Notification.USER_ERROR_HAPPENED = 4;

let session;
let _break;
let notification;





function init() {
    timerBlock.init();
    configurateButton.init();
    progressBar.init();
    alarmNameLabel.init();
    alarmDurationLabel.init();
    remainingTimeLabel.init();
    pauseOrStartButton.init();

    let sessionElement = document.getElementById("session-time-amount");
    let breakElement = document.getElementById("break-time-amount");
    session = new ValidatedTimer(sessionElement, 1, 99, 30);
    _break = new ValidatedTimer(breakElement, 1, 99, 5);

    setChangerButton($("#session-incrementer")[0], session, +1);
    setChangerButton($("#session-decrementer")[0], session, -1);
    setChangerButton($("#break-incrementer")[0], _break, +1);
    setChangerButton($("#break-decrementer")[0], _break, -1);

    let typeStateMap = {};
    typeStateMap[Notification.SESSION_DONE] = "done-session-alert";
    typeStateMap[Notification.SESSION_STARTED] = "started-session-alert";
    typeStateMap[Notification.TIMER_STOPPED] = "stopped-timer-alert";
    typeStateMap[Notification.USER_ERROR_HAPPENED] = "error-alert";


    let elementStateMap = Object.keys(typeStateMap)
        .map(function (type) {
        let el = $(`div[data-type=\'${typeStateMap[type]}\']`)[0];
        return [type, el];
    })
        .reduce(function (acc, curr) {
            acc[curr[0]] = curr[1];
            return acc;
    }, {});

    notification = new Notification(elementStateMap, $("#alert-place")[0]);
}





