'use strict';

function Timer(element, name) {
    this.element = element;
    this.name = name;
}

Timer.prototype.getElementValue = function (){
    return $(this.element).val();
};

Timer.prototype.setElementValue = function (value) {
    $(this.element).val(value);
};



function ValidatedTimer(element, name, min, max, _default) {
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
        throw new UserError("The " + this.name + " should be a number between " + this.min + " and " + this.max);
    }
};