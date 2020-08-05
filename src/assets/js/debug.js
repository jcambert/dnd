class Debug {

    constructor(options) {
        this.options = Object.assign({ enable: true, level: 0, clearOnInit: true, logInitMessage: "" }, options);
        if (this.options.clearOnInit)
            this.clear();
        if (this.options.logInitMessage.length > 0)
            this.log(this.options.logInitMessage);
    }
    setEnable(value) {
        this.options.enable = value;
    }
    _execute(action, args) {
        if (!this.options.enable) return;
        action.apply(null, args);
    }
    clear() {
        this._execute(console.clear)
    }
    //LEVEL 0
    trace() {
        if (this.options.level > 0) return;
        this._execute(console.trace, arguments);
    }
    //LEVEL 1
    log() {
        if (this.options.level > 1) return;
        this._execute(console.log, arguments);
    }
    debug() {
        if (this.options.level > 1) return;
        this._execute(console.debug, arguments);
    }
    //LEVEL 2
    info() {
        if (this.options.level > 2) return;
        this._execute(console.info, arguments);
    }
    //LEVEL 3
    warn() {
        if (this.options.level > 3) return;
        this._execute(console.warn, arguments);
    }
    //LEVEL 4
    error() {
        this._execute(console.error, arguments);
    }

    group() {
        this._execute(console.group, arguments);
    }
    groupCollapsed() {
        this._execute(console.groupCollapsed, arguments);
    }
    groupEnd() {
        this._execute(console.groupEnd, arguments);
    }

}
export default function (options) {
    return new Debug(options);
}