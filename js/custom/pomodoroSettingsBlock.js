'use strict';

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
