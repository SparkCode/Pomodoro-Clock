'use strict';

class TimerSettings {
    constructor(element) {
        this.element = element;
        debugger;
        this.name = this.element.getAttribute("name");
    }

    getElementValue() {
        return $(this.element).val();
    }

    setElementValue(value) {
        $(this.element).val(value);
    }
}


class ValidatedTimerSettings extends TimerSettings {
    constructor(element) {
        super(element);
        this._getValidationParameters();
        this._setMaxElementValueLength();
    }

    setElementValue(value) {
        this._validateValue(value);
        super.setElementValue(value);
    }

    changeElementValue(diff) {
        let curr = this.getElementValue();
        this.setElementValue(+curr + +diff);
    }

    getElementValue() {
        let value = +super.getElementValue();
        this._validateValue(value);
        return value;
    }

    _setMaxElementValueLength() {
        this.element.onkeyup = () => {
            let val = this.getElementValue();
            val.length > this.maxLength && this.setElementValue(val.slice(0, this.maxLength));
        }
    }

    _getValidationParameters() {
        this.max = +this.element.getAttribute("max");
        this.min = +this.element.getAttribute("min");
        this.defaultValue = +this.element.getAttribute("value");
        this.maxLength = (this.max + "").length;
    }

    _validateValue(value) {
        value = +value;
        let isValid = value && value >= this.min && value <= this.max;
        if (isValid) return;
        this.setElementValue(this.defaultValue);
        throw new UserError("The " + this.name + " should be a number between " + this.min + " and " + this.max);
    }
}




