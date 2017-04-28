'use strict';

let timerBlock = {
    init() {
        this.element = $("#timer-block")[0];
        this.progressBar.init();
        this.alarmNameLabel.init();
        this.alarmDurationLabel.init();
        this.remainingTimeLabel.init();
        this.pauseOrStartButton.init();
    },

    setVisible() {
        this.element.style.visibility = "visible";
    }
};

timerBlock.pomodoroWorker = { //todo вынести отсюда?
    init(sessionAlarm, breakAlarm) {
        !this.sessionAlarm || this.sessionAlarm.stop();
        !this.breakAlarm || this.breakAlarm.stop();

        this.sessionAlarm = sessionAlarm;
        this.breakAlarm = breakAlarm;
        this.state = this.BREAK;
    },

    start() { //todo - rename
        this.getCurrentAlarm().setAlarm(this.prepare.bind(this), this.updaterHandler.bind(this), 1000);
    },

    prepare() { //todo - rename
        timerBlock.pauseOrStartButton.state = timerBlock.pauseOrStartButton.WORKING;

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

    pause() {
        this.getCurrentAlarm().pauseAlarm();
        notificationBlock.alertPlace.setNotification(notificationBlock.TIMER_STOPPED_ALERT);
    },

    resume() {
        if (this.state === this.SESSION)
            notificationBlock.alertPlace.setNotification(notificationBlock.SESSION_STARTED_ALERT);
        else
            notificationBlock.alertPlace.setNotification(notificationBlock.SESSION_DONE_ALERT);
        this.start();
    },

    updaterHandler() {
        let alarm = this.getCurrentAlarm();
        let percentage = 100 - alarm.getRemaining()* 100 / alarm.overallDuration;
        timerBlock.progressBar.setValue(percentage);
        timerBlock.remainingTimeLabel.setValue(alarm.getRemaining());
    },

    getCurrentAlarm() {
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

