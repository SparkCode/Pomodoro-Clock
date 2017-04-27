'use strict';

$(document).ready(init);

function UserError(message = 'Default Message') {
    this.name = "UserError";
    this.message = message;
    this.stack = new Error().stack;
}

UserError.prototype = Object.create(Error.prototype);
UserError.prototype.constructor = UserError;



function init() {
    timerBlock.init();
    pomodoroSettingsBlock.init();
    notificationBlock.init();

    window.onerror = function (msg, url, lineNo, columnNo, error) {
        notificationBlock.alertPlace.setNotification(notificationBlock.USER_ERROR_HAPPENED_ALERT, error.message);
    }
}






