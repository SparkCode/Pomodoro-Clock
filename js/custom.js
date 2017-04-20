function SettingComponent(sessionComponent, breakComponent, configurationComponent) {
    this.session = sessionComponent;
    this.break = breakComponent;
    this.configurationComponent = configurationComponent;
}

function TimerComponent(name, min, max, _default) {
    this.name = name;
    this.currentDuration = function () {

    };
    this.changeDuration = function (diff) {
        
    }
}

function ConfigurationComponent(sessionComponent, breakComponent) {
    this.startPomodoro = function () {
    }
}

function PomodoroComponent(bar) {
    
}

function ProgressBar(maxValue) {
    this.change = function (currentValue) {
        
    };
}

var refreshButton = {
    refresh: function () {
        
    }
};

var stopButton = {
    storOrRefresh: function () {

    }
};