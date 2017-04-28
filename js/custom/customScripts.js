'use strict';

$(document).ready(init);

class UserError extends Error {
    constructor(message = 'Default Message') {
        super();
        this.name = "UserError";
        this.message = message;
        this.stack = new Error().stack;
    }
}


function init() {
    timerBlock.init();
    pomodoroSettingsBlock.init();
    notificationBlock.init();

    window.onerror = function (msg, url, lineNo, columnNo, error) {
        notificationBlock.alertPlace.setNotification(notificationBlock.USER_ERROR_HAPPENED_ALERT, error.message);
    }
}






