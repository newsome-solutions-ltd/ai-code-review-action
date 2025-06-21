class StopWatch {
    constructor() {
        this.started = null
        this.stopped = null
    }
    start() {
        if (!this.isStarted() || this.isStopped()) {
            this.started = Date.now()
            this.stopped = null
        }
        return this;
    }
    stop() {
        if (!this.isStarted()) {
            throw new Error("StopWatch has not been started")
        }
        this.stopped = Date.now()
        return this;
    }
    isStarted() {
        return this.started != null
    }
    isStopped() {
        return this.stopped != null
    }
    getTime() {
        if (!this.isStopped()){
            throw new Error("StopWatch has not been stopped")
        }
        return this.stopped - this.started
    }
}

module.exports = StopWatch
