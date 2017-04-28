'use strict';

class Timer {
    constructor(element, name) {
        this.element = element;
        this.name = name;
    }

    getElementValue() {
        return $(this.element).val();
    }

    setElementValue(value) {
        $(this.element).val(value);
    }
}


class ValidatedTimer extends Timer {
    constructor(element, name, min, max, _default) {
        super(element, name);
        this.min = min;
        this.max = max;
        this.default = _default;
        this.validateValueLength();
    }

    setValue(value) {
        this.validateValue(value);
        this.setElementValue(value);

    }

    changeValue(diff) {
        let curr = this.getValue();
        this.setValue(+curr + diff);
    }

    getValue() {
        let value = +this.getElementValue();
        this.validateValue(value);
        return value;
    }

    validateValueLength() {
        this.element.onkeyup = () => {
            let val = this.getElementValue();
            val.length > 2 && this.setElementValue(val.slice(0, 2));
        }
    }

    validateValue(value) {
        value = +value;
        let isValid = value && value >= this.min && value <= this.max;
        if (!isValid)
        {
            this.setElementValue(this.default);
            throw new UserError("The " + this.name + " should be a number between " + this.min + " and " + this.max);
        }
    }
}




