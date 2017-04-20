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
        var sessionTimeAmount =  session.getValue();
        var breakTimeAmount = _break.getValue();
    }
};



function Timer(element, min, max, _default) {

    function validateValue (value) {
        value = +value;
        var isValid = value && value >= min && value <= max;
        if (!isValid)
        {
            setElementValue(_default);
            throw new UserError("Number should be more than " + min + " and less than " + max);
        }
    }

    function getElementValue() {
        return $(element).val();
    }
    
    function setElementValue(value) {
        $(element).val(value);
    }

    this.setValue = function (value) {
        validateValue(value);
        setElementValue(value);
    };

    this.changeValue = function (diff) {
        debugger;
        var curr = this.getValue();
        this.setValue(+curr + diff);
    };

    this.getValue = function () {
        var value =  +getElementValue();
        validateValue(value);
        return value;
    }
}



function setChangerButton(element, timer, diff) {
    element.onclick = timer.changeValue.bind(timer, diff);
}

function UserError(message) {
    this.name = "UserError";
    this.message = message || 'Default Message';
}

UserError.prototype = Object.create(Error.prototype);
UserError.prototype.constructor = UserError;

function init() {
    configurateButton.init();
    var sessionElement = document.getElementById("session-time-amount");
    var breakElement = document.getElementById("break-time-amount");
    var session = new Timer(sessionElement, 5, 99, 30);
    var _break = new Timer(breakElement, 1, 99, 5);
    setChangerButton($("#session-incrementer")[0], session, +1);
    setChangerButton($("#session-decrementer")[0], session, -1);
    setChangerButton($("#break-incrementer")[0], _break, +1);
    setChangerButton($("#break-decrementer")[0], _break, -1);
}



