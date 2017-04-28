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
    settingsBlock.init();
    notificationBlock.init();

    window.onerror = function (msg, url, lineNo, columnNo, error) {
        if (error instanceof UserError)
        {
            notificationBlock.alertPlace.setNotification(notificationBlock.USER_ERROR_HAPPENED_ALERT, error.message);
        }
    }
}






