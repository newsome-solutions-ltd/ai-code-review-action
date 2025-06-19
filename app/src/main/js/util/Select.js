class Selector {
    constructor(value) {
        this.value = value
        this.pipeline = (v) => v
    }
    map(func) {
        this.pipeline = (v) => this.pipeline(func(v))
        return this
    }
    filter(predicate) {
        this.pipeline = (v) => (predicate(v)) ? this.pipeline(v) : null
        return this
    }
    orElse(otherValue) {
       return this.pipeline(this.value) ?? otherValue
    }
}

const select = (value) => new Selector(value)

module.exports = select;
