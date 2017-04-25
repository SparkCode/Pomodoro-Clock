$(document).ready(init);

"use strict";

var configurateButton = {
    init : function () {
        var element = this.findElement();
        this.addHandler(element);
    },

    findElement: function () {
        return $("#pomodoro-starter")[0];
    },

    addHandler: function (element) {
        this.findElement().onclick = this.handleButtonClick;
    },

    handleButtonClick: function () {
        var sessionAlarm = new Alarm(session.getValue() * 1000 * 60, "Session");
        var breakAlarm = new Alarm(_break.getValue() * 1000 * 60, "Break");
        pomodoroWorker.init(sessionAlarm, breakAlarm);
        pomodoroWorker.prepare();
    }
};

var pomodoroWorker = {
    init: function (sessionAlarm, breakAlarm) {
        !this.sessionAlarm || this.sessionAlarm.stop();
        !this.breakAlarm || this.breakAlarm.stop();

        this.sessionAlarm = sessionAlarm;
        this.breakAlarm = breakAlarm;
        this.state = pomodoroWorker.BREAK;
    },

    start: function () {
        this.getCurrentAlarm().setAlarm(this.prepare.bind(this), this.updaterHandler.bind(this), 1000);
    },

    prepare: function () {
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
        alarmDurationLabel.setValue(this.getCurrentAlarm().duration);
        this.start();
    },

    updaterHandler: function () {
        var alarm = this.getCurrentAlarm();
        var percentage = Math.round(new Date() - alarm.startTime) / (alarm.duration / 100);
        progressBar.setValue(percentage);
    },

    getCurrentAlarm : function () {
        return this.state ===  pomodoroWorker.SESSION ? this.sessionAlarm : this.breakAlarm;
    }
};

pomodoroWorker.BREAK = 1;
pomodoroWorker.SESSION = 2;



var progressBar = {
    init : function () {
        this.element = $(".progress-bar")[0];
    },
    
    setValue : function (percentage) {
        this.element.style.width = percentage + "%";
    }
};

var alarmNameLabel = {
    init : function () {
        this.element = $("#alarm-name")[0];
    },

    setValue : function (name) {
        this.element.innerHTML = name;
    }
};

var alarmDurationLabel = {
    init: function () {
        this.element = $("#alarm-duration")[0];
    },
    
    setValue: function (ms) {
        this.element.innerHTML  = new Date(0, 0,0,0,0,0, ms).toTimeString().split(' ')[0];
    }

};

var currentAlarm = null;



function Alarm(duration, name) {
    this.duration = duration;
    this.name = name;

}

Alarm.prototype.setAlarm = function (finishFunction, setUpdaterFunction, setUpdaterFunctionDuration) {
    var self = this;

    this.startTime = new Date();

    this.overallTimerId = setTimeout(function () {
        self.stop();
        debugger;
        finishFunction();
    }, this.duration);

    this.updaterFunctionId = setInterval(setUpdaterFunction.bind(this), setUpdaterFunctionDuration);
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
}

ValidatedTimer.prototype = Object.create(Timer.prototype);
ValidatedTimer.prototype.constructor = ValidatedTimer;

ValidatedTimer.prototype.setValue = function (value) {
    this.validateValue(value);
    this.setElementValue(value);
};

ValidatedTimer.prototype.changeValue = function (diff) {
    var curr = this.getValue();
    this.setValue(+curr + diff);
};

ValidatedTimer.prototype.getValue = function () {
    var value = +this.getElementValue();
    this.validateValue(value);
    return value;
};

ValidatedTimer.prototype.validateValue = function (value) {
    value = +value;
    var isValid = value && value >= this.min && value <= this.max;
    if (!isValid)
    {
        this.setElementValue(this.default);
        throw new UserError("Number should be more than " + this.min + " and less than " + this.max);
    }
};

function setChangerButton(element, timer, diff) {
    element.onclick = timer.changeValue.bind(timer, diff);
}

function UserError(message) {
    this.name = "UserError";
    this.message = message || 'Default Message';
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

var session;
var _break;
var notification;





function init() {
    configurateButton.init();
    progressBar.init();
    alarmNameLabel.init();
    alarmDurationLabel.init();
    var sessionElement = document.getElementById("session-time-amount");
    var breakElement = document.getElementById("break-time-amount");
    session = new ValidatedTimer(sessionElement, 1, 99, 30);
    _break = new ValidatedTimer(breakElement, 1, 99, 5);

    setChangerButton($("#session-incrementer")[0], session, +1);
    setChangerButton($("#session-decrementer")[0], session, -1);
    setChangerButton($("#break-incrementer")[0], _break, +1);
    setChangerButton($("#break-decrementer")[0], _break, -1);

    var typeStateMap = {};
    typeStateMap[Notification.SESSION_DONE] = "done-session-alert";
    typeStateMap[Notification.SESSION_STARTED] = "started-session-alert";
    typeStateMap[Notification.TIMER_STOPPED] = "stopped-timer-alert";
    typeStateMap[Notification.USER_ERROR_HAPPENED] = "error-alert";


    var elementStateMap = Object.keys(typeStateMap)
        .map(function (type) {
        var el = $(`#alert-templates div[data-type=\'${typeStateMap[type]}\']`)[0];
        return [type, el];
    })
        .reduce(function (acc, curr) {
            acc[curr[0]] = curr[1];
            return acc;
    }, {});

    notification = new Notification(elementStateMap, $("#alert-place")[0]);
}





