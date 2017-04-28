'use strict';

let settingsBlock = {
    init() {
        this.session = new ValidatedTimerSettings($("#session-time-amount")[0]);
        this.break = new ValidatedTimerSettings($("#break-time-amount")[0]);
        this.configurationButton.init();

        new ChangerButton($("#session-incrementer")[0], this.session);
        new ChangerButton($("#session-decrementer")[0], this.session);
        new ChangerButton($("#break-incrementer")[0], this.break);
        new ChangerButton($("#break-decrementer")[0], this.break);
    }
};

settingsBlock.configurationButton = {
    init() {
        this.element = $("#pomodoro-starter")[0];
        this.addHandler(this.element);
    },

    addHandler() {
        this.element.onclick = this.handleButtonClick;
    },

    handleButtonClick() {
        let sessionTimer = new Timer(settingsBlock.session.getElementValue() * 1000 * 60, settingsBlock.session.name);
        let breakTimer = new Timer(settingsBlock.break.getElementValue() * 1000 * 60, settingsBlock.break.name);
        timerBlock.pomodoroWorker.init(sessionTimer, breakTimer);
        timerBlock.pomodoroWorker.start();
        timerBlock.setVisible();
    }
};


class ChangerButton {
    constructor(element, targetTimerSetting)
    {
        this.element = element;
        this.targetTimerSetting = targetTimerSetting;
        this.value = element.getAttribute("data-value");
        this.setChangerButton();
    }

    setChangerButton() {
        this.element.onclick = this.targetTimerSetting.changeElementValue.bind(this.targetTimerSetting, this.value);
    }
}
