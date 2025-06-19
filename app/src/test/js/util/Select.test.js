#! /usr/bin/env node

// --------------------------------------------------------------- Imports

const select = require("../../../main/js/util/Select");

// ----------------------------------------------------------------- Tests

describe('Select', () => {

    it.each([
        ["string"],[123]
    ])('should select value [%s] and return it', (value) => {
        const selected = select(value).orElse(null)
        expect(selected).toEqual(value)
    })

    it.each([
        ["string", "check", "other"],[123, 456, "other"],
        ["string", "string", "string"],[123, 123, 123]
    ])('should filter the selected value with a predicate', (value, check, expected) => {
        const selected = select(value).filter(v => v === check).orElse("other")
        expect(selected).toEqual(expected)
    })

    it.each([
        ["string", v => v + "s", "strings"],
        [123, v => v + 7, 130]
    ])('should map the selected value with a mapping function', (value, mapping, expected) => {
        const selected = select(value).map(mapping).orNull()
        expect(selected).toEqual(expected)
    })

    it.each([
        ["string", [v => v.startsWith('s'), v => v.endsWith('g')], "string"],
        [123, [v => v > 100, v => v < 200], 123]
    ])('should support multiple filters', (value, filters, expected) => {
        var selected = select(value)
        for (f of filters) {
            selected = selected.filter(f)
        }
        expect(selected.orNull()).toEqual(expected)
    })

    it.each([
        [123, [v => v + 3, v => v + 100], 226]
    ])('should support multiple mappings', (value, mappings, expected) => {
        var selected = select(value)
        for (m of mappings) {
            selected = selected.map(m)
        }
        expect(selected.orNull()).toEqual(expected)
    })

    it("should respect order of transformations", () => {
        var selected = select("123").filter(v => v.startsWith("1")).map(parseInt).orNull()
        expect(selected).toEqual(123)
    })

    it("should respect order of transformations 2", () => {
        var selected = select("123").map(parseInt).filter(v => v > 100).orNull()
        expect(selected).toEqual(123)
    })

});