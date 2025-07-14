class Selector {
    constructor(value) {
        this.value = value
        this.pipeline = (v) => v
    }
    map(func) {
        const subpipeline = this.pipeline
        this.pipeline = (v) => {
            const v1 = subpipeline(v)
            return (v1 != null) ? func(v1) : null
        }
        return this
    }
    filter(predicate) {
        const subpipeline = this.pipeline
        this.pipeline = (v) => (predicate(v)) ? subpipeline(v) : null
        return this
    }
    orElse(otherValue) {
       return this.pipeline(this.value) ?? otherValue
    }
    orNull() {
       return this.orElse(null)
    }
}

const select = (value) => new Selector(value)

module.exports = select;
