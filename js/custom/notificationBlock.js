'use strict';

let notificationBlock = {
    init() {
        this.alertPlace.init();
        this.SESSION_DONE_ALERT = this._getNotification("done-session-alert");
        this.SESSION_STARTED_ALERT = this._getNotification("started-session-alert");
        this.TIMER_STOPPED_ALERT = this._getNotification("stopped-timer-alert");
        this.USER_ERROR_HAPPENED_ALERT = this._getNotification("error-alert");
    },

    _getNotification(stateType) {
        return $(`div[data-type=\'${stateType}\']`)[0];
    },
};

notificationBlock.alertPlace = {
    init() {
        this.element = $("#alert-place")[0];
    },

    setNotification(element, text) {
        text && (element.innerHTML = text);
        this.element.innerHTML = "";
        this.element.appendChild(element);
    }
};