/**
 * VexFlow Engraver 1.2 Custom
 * A library for rendering musical notation and guitar tablature in HTML5.
 *
 *                    http://www.vexflow.com
 *
 * Copyright (c) 2010 Mohit Muthanna Cheppudira <mohit@muthanna.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * This library makes use of Simon Tatham's awesome font - Gonville.
 *
 * Build ID: 0xFE@7c17b17c97775af59822cfe0a79e3309839192c1
 * Build date: 2014-03-04 14:45:20 -0500
 */
function Vex() {}
Vex.Debug = !0, Vex.LogLevels = {
    DEBUG: 5,
    INFO: 4,
    WARN: 3,
    ERROR: 2,
    FATAL: 1
}, Vex.LogLevel = 5, Vex.LogMessage = function (e, t) {
    if (e <= Vex.LogLevel && window.console) {
        var o = t;
        o = "object" == typeof t ? {
            level: e,
            message: t
        } : "VexLog: [" + e + "] " + o, window.console.log(o);
    }
}, Vex.LogDebug = function (e) {
    Vex.LogMessage(Vex.LogLevels.DEBUG, e)
}, Vex.LogInfo = function (e) {
    Vex.LogMessage(Vex.LogLevels.INFO, e)
}, Vex.LogWarn = function (e) {
    Vex.LogMessage(Vex.LogLevels.WARN, e)
}, Vex.LogError = function (e) {
    Vex.LogMessage(Vex.LogLevels.ERROR, e)
}, Vex.LogFatal = function (e, t) {
    throw Vex.LogMessage(Vex.LogLevels.FATAL, e), t ? t : "VexFatalError"
}, Vex.Log = Vex.LogDebug, Vex.L = Vex.LogDebug, Vex.AssertException = function (e) {
    this.message = e
}, Vex.AssertException.prototype.toString = function () {
    return "AssertException: " + this.message
}, Vex.Assert = function (e, t) {
    if (Vex.Debug && !e) throw t || (t = "Assertion failed."), new Vex.AssertException(t)
}, Vex.RuntimeError = function (e, t) {
    this.code = e, this.message = t
}, Vex.RuntimeError.prototype.toString = function () {
    return "RuntimeError: " + this.message
}, Vex.RERR = Vex.RuntimeError, Vex.Merge = function (e, t) {
    for (var o in t) e[o] = t[o];
    return e
}, Vex.Min = function (e, t) {
    return e > t ? t : e
}, Vex.Max = function (e, t) {
    return e > t ? e : t
}, Vex.RoundN = function (e, t) {
    return e % t >= t / 2 ? parseInt(e / t, 10) * t + t : parseInt(e / t, 10) * t
}, Vex.MidLine = function (e, t) {
    var o = t + (e - t) / 2;
    return o % 2 > 0 && (o = Vex.RoundN(10 * o, 5) / 10), o
}, Vex.SortAndUnique = function (e, t, o) {
    if (e.length > 1) {
        var n, r = [];
        e.sort(t);
        for (var s = 0; s < e.length; ++s) 0 !== s && o(e[s], n) || r.push(e[s]), n = e[s];
        return r
    }
    return e
}, Vex.Contains = function (e, t) {
    for (var o = e.length; o--;)
        if (e[o] === t) return !0;
    return !1
}, Vex.getCanvasContext = function (e) {
    if (!e) throw new Vex.RERR("BadArgument", "Invalid canvas selector: " + e);
    var t = document.getElementById(e);
    if (!t || !t.getContext) throw new Vex.RERR("UnsupportedBrowserError", "This browser does not support HTML5 Canvas");
    return t.getContext("2d")
}, Vex.drawDot = function (e, t, o, n) {
    var r = n || "#f55";
    e.save(), e.fillStyle = r, e.beginPath(), e.arc(t, o, 3, 0, 2 * Math.PI, !0), e.closePath(), e.fill(), e.restore()
}, Vex.BM = function (e, t) {
    var o = (new Date).getTime();
    t();
    var n = (new Date).getTime() - o;
    Vex.L(e + n + "ms")
}, Vex.Inherit = function () {
    var e = function () {};
    return function (t, o, n) {
        return e.prototype = o.prototype, t.prototype = new e, t.superclass = o.prototype, t.prototype.constructor = t, Vex.Merge(t.prototype, n), t
    }
}();
Vex.Flow = {
    RESOLUTION: 16384,
    IsKerned: !0
};
Vex.Flow.Fraction = function () {
    function t(t, n) {
        this.set(t, n)
    }
    return t.GCD = function (t, n) {
        if ("number" != typeof t || "number" != typeof n) throw new Vex.RERR("BadArgument", "Invalid numbers: " + t + ", " + n);
        for (var r; 0 !== n;) r = n, n = t % n, t = r;
        return t
    }, t.LCM = function (n, r) {
        return n * r / t.GCD(n, r)
    }, t.LCMM = function (n) {
        if (0 === n.length) return 0;
        if (1 == n.length) return n[0];
        if (2 == n.length) return Vex.Flow.Fraction.LCM(n[0], n[1]);
        var r = n[0];
        return n.shift(), t.LCM(r, Vex.Flow.Fraction.LCMM(n))
    }, t.prototype = {
        set: function (t, n) {
            return this.numerator = void 0 === t ? 1 : t, this.denominator = void 0 === n ? 1 : n, this
        },
        value: function () {
            return this.numerator / this.denominator
        },
        simplify: function () {
            var t = this.numerator,
                n = this.denominator,
                r = Vex.Flow.Fraction.GCD(t, n);
            return t /= r, n /= r, 0 > n && (n = -n, t = -t), this.set(t, n)
        },
        add: function (t, n) {
            var r, o;
            t instanceof Vex.Flow.Fraction ? (r = t.numerator, o = t.denominator) : (r = void 0 !== t ? t : 0, o = void 0 !== n ? n : 1);
            var i = Vex.Flow.Fraction.LCM(this.denominator, o),
                e = i / this.denominator,
                a = i / o,
                u = this.numerator * e + r * a;
            return this.set(u, i)
        },
        subtract: function (t, n) {
            var r, o;
            t instanceof Vex.Flow.Fraction ? (r = t.numerator, o = t.denominator) : (r = void 0 !== t ? t : 0, o = void 0 !== n ? n : 1);
            var i = Vex.Flow.Fraction.LCM(this.denominator, o),
                e = i / this.denominator,
                a = i / o,
                u = this.numerator * e - r * a;
            return this.set(u, i)
        },
        multiply: function (t, n) {
            var r, o;
            return t instanceof Vex.Flow.Fraction ? (r = t.numerator, o = t.denominator) : (r = void 0 !== t ? t : 1, o = void 0 !== n ? n : 1), this.set(this.numerator * r, this.denominator * o)
        },
        divide: function (t, n) {
            var r, o;
            return t instanceof Vex.Flow.Fraction ? (r = t.numerator, o = t.denominator) : (r = void 0 !== t ? t : 1, o = void 0 !== n ? n : 1), this.set(this.numerator * o, this.denominator * r)
        },
        equals: function (t) {
            var n = Vex.Flow.Fraction.__compareA.copy(t).simplify(),
                r = Vex.Flow.Fraction.__compareB.copy(this).simplify();
            return n.numerator === r.numerator && n.denominator === r.denominator
        },
        clone: function () {
            return new Vex.Flow.Fraction(this.numerator, this.denominator)
        },
        copy: function (t) {
            return this.set(t.numerator, t.denominator)
        },
        quotient: function () {
            return Math.floor(this.numerator / this.denominator)
        },
        fraction: function () {
            return this.numerator % this.denominator
        },
        abs: function () {
            return this.denominator = Math.abs(this.denominator), this.numerator = Math.abs(this.numerator), this
        },
        toString: function () {
            return this.numerator + "/" + this.denominator
        },
        toSimplifiedString: function () {
            return Vex.Flow.Fraction.__tmp.copy(this).simplify().toString()
        },
        toMixedString: function () {
            var t = "",
                n = this.quotient(),
                r = Vex.Flow.Fraction.__tmp.copy(this);
            return 0 > n ? r.abs().fraction() : r.fraction(), 0 !== n ? (t += n, 0 !== r.numerator && (t += " " + r.toSimplifiedString())) : t = 0 === r.numerator ? "0" : r.toSimplifiedString(), t
        },
        parse: function (t) {
            var n = t.split("/"),
                r = parseInt(n[0], 0),
                o = n[1] ? parseInt(n[1], 0) : 1;
            return this.set(r, o)
        }
    }, t.__compareA = new t, t.__compareB = new t, t.__tmp = new t, t
}();
Vex.Flow.clefProperties = function (e) {
    if (!e) throw new Vex.RERR("BadArgument", "Invalid clef: " + e);
    var t = Vex.Flow.clefProperties.values[e];
    if (!t) throw new Vex.RERR("BadArgument", "Invalid clef: " + e);
    return t
}, Vex.Flow.clefProperties.values = {
    treble: {
        line_shift: 0
    },
    bass: {
        line_shift: 6
    },
    tenor: {
        line_shift: 4
    },
    alto: {
        line_shift: 3
    },
    percussion: {
        line_shift: 0
    }
}, Vex.Flow.keyProperties = function (e, t) {
    void 0 === t && (t = "treble");
    var i = e.split("/");
    if (i.length < 2) throw new Vex.RERR("BadArguments", "Key must have note + octave and an optional glyph: " + e);
    var n = i[0].toUpperCase(),
        a = Vex.Flow.keyProperties.note_values[n];
    if (!a) throw new Vex.RERR("BadArguments", "Invalid key name: " + n);
    a.octave && (i[1] = a.octave);
    var o = i[1],
        d = 7 * o - 28,
        l = (d + a.index) / 2;
    l += Vex.Flow.clefProperties(t).line_shift;
    var c = 0;
    0 >= l && 0 === 2 * l % 2 && (c = 1), l >= 6 && 0 === 2 * l % 2 && (c = -1);
    var _ = "undefined" != typeof a.int_val ? 12 * o + a.int_val : null,
        h = a.code,
        s = a.shift_right;
    if (i.length > 2 && i[2]) {
        var r = i[2].toUpperCase(),
            f = Vex.Flow.keyProperties.note_glyph[r];
        f && (h = f.code, s = f.shift_right)
    }
    return {
        key: n,
        octave: o,
        line: l,
        int_value: _,
        accidental: a.accidental,
        code: h,
        stroke: c,
        shift_right: s,
        displaced: !1
    }
}, Vex.Flow.keyProperties.note_values = {
    C: {
        index: 0,
        int_val: 0,
        accidental: null
    },
    CN: {
        index: 0,
        int_val: 0,
        accidental: "n"
    },
    "C#": {
        index: 0,
        int_val: 1,
        accidental: "#"
    },
    "C##": {
        index: 0,
        int_val: 2,
        accidental: "##"
    },
    CB: {
        index: 0,
        int_val: -1,
        accidental: "b"
    },
    CBB: {
        index: 0,
        int_val: -2,
        accidental: "bb"
    },
    D: {
        index: 1,
        int_val: 2,
        accidental: null
    },
    DN: {
        index: 1,
        int_val: 2,
        accidental: "n"
    },
    "D#": {
        index: 1,
        int_val: 3,
        accidental: "#"
    },
    "D##": {
        index: 1,
        int_val: 4,
        accidental: "##"
    },
    DB: {
        index: 1,
        int_val: 1,
        accidental: "b"
    },
    DBB: {
        index: 1,
        int_val: 0,
        accidental: "bb"
    },
    E: {
        index: 2,
        int_val: 4,
        accidental: null
    },
    EN: {
        index: 2,
        int_val: 4,
        accidental: "n"
    },
    "E#": {
        index: 2,
        int_val: 5,
        accidental: "#"
    },
    "E##": {
        index: 2,
        int_val: 6,
        accidental: "##"
    },
    EB: {
        index: 2,
        int_val: 3,
        accidental: "b"
    },
    EBB: {
        index: 2,
        int_val: 2,
        accidental: "bb"
    },
    F: {
        index: 3,
        int_val: 5,
        accidental: null
    },
    FN: {
        index: 3,
        int_val: 5,
        accidental: "n"
    },
    "F#": {
        index: 3,
        int_val: 6,
        accidental: "#"
    },
    "F##": {
        index: 3,
        int_val: 7,
        accidental: "##"
    },
    FB: {
        index: 3,
        int_val: 4,
        accidental: "b"
    },
    FBB: {
        index: 3,
        int_val: 3,
        accidental: "bb"
    },
    G: {
        index: 4,
        int_val: 7,
        accidental: null
    },
    GN: {
        index: 4,
        int_val: 7,
        accidental: "n"
    },
    "G#": {
        index: 4,
        int_val: 8,
        accidental: "#"
    },
    "G##": {
        index: 4,
        int_val: 9,
        accidental: "##"
    },
    GB: {
        index: 4,
        int_val: 6,
        accidental: "b"
    },
    GBB: {
        index: 4,
        int_val: 5,
        accidental: "bb"
    },
    A: {
        index: 5,
        int_val: 9,
        accidental: null
    },
    AN: {
        index: 5,
        int_val: 9,
        accidental: "n"
    },
    "A#": {
        index: 5,
        int_val: 10,
        accidental: "#"
    },
    "A##": {
        index: 5,
        int_val: 11,
        accidental: "##"
    },
    AB: {
        index: 5,
        int_val: 8,
        accidental: "b"
    },
    ABB: {
        index: 5,
        int_val: 7,
        accidental: "bb"
    },
    B: {
        index: 6,
        int_val: 11,
        accidental: null
    },
    BN: {
        index: 6,
        int_val: 11,
        accidental: "n"
    },
    "B#": {
        index: 6,
        int_val: 12,
        accidental: "#"
    },
    "B##": {
        index: 6,
        int_val: 13,
        accidental: "##"
    },
    BB: {
        index: 6,
        int_val: 10,
        accidental: "b"
    },
    BBB: {
        index: 6,
        int_val: 9,
        accidental: "bb"
    },
    R: {
        index: 6,
        int_val: 9,
        rest: !0
    },
    X: {
        index: 6,
        accidental: "",
        octave: 4,
        code: "v3e",
        shift_right: 5.5
    }
}, Vex.Flow.keyProperties.note_glyph = {
    D0: {
        code: "v27",
        shift_right: -.5
    },
    D1: {
        code: "v2d",
        shift_right: -.5
    },
    D2: {
        code: "v22",
        shift_right: -.5
    },
    D3: {
        code: "v70",
        shift_right: -.5
    },
    T0: {
        code: "v49",
        shift_right: -2
    },
    T1: {
        code: "v93",
        shift_right: .5
    },
    T2: {
        code: "v40",
        shift_right: .5
    },
    T3: {
        code: "v7d",
        shift_right: .5
    },
    X0: {
        code: "v92",
        shift_right: -2
    },
    X1: {
        code: "v95",
        shift_right: -.5
    },
    X2: {
        code: "v7f",
        shift_right: .5
    },
    X3: {
        code: "v3b",
        shift_right: -2
    }
}, Vex.Flow.integerToNote = function (e) {
    if ("undefined" == typeof e) throw new Vex.RERR("BadArguments", "Undefined integer for integerToNote");
    if (-2 > e) throw new Vex.RERR("BadArguments", "integerToNote requires integer > -2: " + e);
    var t = Vex.Flow.integerToNote.table[e];
    if (!t) throw new Vex.RERR("BadArguments", "Unknown note value for integer: " + e);
    return t
}, Vex.Flow.integerToNote.table = {
    0: "C",
    1: "C#",
    2: "D",
    3: "D#",
    4: "E",
    5: "F",
    6: "F#",
    7: "G",
    8: "G#",
    9: "A",
    10: "A#",
    11: "B"
}, Vex.Flow.tabToGlyph = function (e) {
    var t = null,
        i = 0,
        n = 0;
    return "X" == e.toString().toUpperCase() ? (t = "v7f", i = 7, n = -4.5) : i = Vex.Flow.textWidth(e.toString()), {
        text: e,
        code: t,
        width: i,
        shift_y: n
    }
}, Vex.Flow.textWidth = function (e) {
    return 6 * e.toString().length
}, Vex.Flow.articulationCodes = function (e) {
    return Vex.Flow.articulationCodes.articulations[e]
}, Vex.Flow.articulationCodes.articulations = {
    "a.": {
        code: "v23",
        width: 4,
        shift_right: -2,
        shift_up: 8,
        shift_down: 0,
        between_lines: !0
    },
    av: {
        code: "v28",
        width: 4,
        shift_right: 0,
        shift_up: 11,
        shift_down: 5,
        between_lines: !0
    },
    "a>": {
        code: "v42",
        width: 10,
        shift_right: 5,
        shift_up: 8,
        shift_down: 1,
        between_lines: !0
    },
    "a-": {
        code: "v25",
        width: 9,
        shift_right: -4,
        shift_up: 17,
        shift_down: 10,
        between_lines: !0
    },
    "a^": {
        code: "va",
        width: 8,
        shift_right: 0,
        shift_up: -4,
        shift_down: -2,
        between_lines: !1
    },
    "a+": {
        code: "v8b",
        width: 9,
        shift_right: -4,
        shift_up: 12,
        shift_down: 12,
        between_lines: !1
    },
    ao: {
        code: "v94",
        width: 8,
        shift_right: 0,
        shift_up: -4,
        shift_down: 6,
        between_lines: !1
    },
    ah: {
        code: "vb9",
        width: 7,
        shift_right: 0,
        shift_up: -4,
        shift_down: 4,
        between_lines: !1
    },
    "a@a": {
        code: "v43",
        width: 25,
        shift_right: 0,
        shift_up: 8,
        shift_down: 10,
        between_lines: !1
    },
    "a@u": {
        code: "v5b",
        width: 25,
        shift_right: 0,
        shift_up: 0,
        shift_down: -4,
        between_lines: !1
    },
    "a|": {
        code: "v75",
        width: 8,
        shift_right: 0,
        shift_up: 8,
        shift_down: 10,
        between_lines: !1
    },
    am: {
        code: "v97",
        width: 13,
        shift_right: 0,
        shift_up: 10,
        shift_down: 12,
        between_lines: !1
    },
    "a,": {
        code: "vb3",
        width: 6,
        shift_right: 8,
        shift_up: -4,
        shift_down: 4,
        between_lines: !1
    }
}, Vex.Flow.accidentalCodes = function (e) {
    return Vex.Flow.accidentalCodes.accidentals[e]
}, Vex.Flow.accidentalCodes.accidentals = {
    "#": {
        code: "v18",
        width: 10,
        shift_right: 0,
        shift_down: 0
    },
    "##": {
        code: "v7f",
        width: 13,
        shift_right: -1,
        shift_down: 0
    },
    b: {
        code: "v44",
        width: 8,
        shift_right: 0,
        shift_down: 0
    },
    bb: {
        code: "v26",
        width: 14,
        shift_right: -3,
        shift_down: 0
    },
    n: {
        code: "v4e",
        width: 8,
        shift_right: 0,
        shift_down: 0
    },
    "{": {
        code: "v9c",
        width: 5,
        shift_right: 2,
        shift_down: 0
    },
    "}": {
        code: "v84",
        width: 5,
        shift_right: 0,
        shift_down: 0
    }
}, Vex.Flow.keySignature = function (e) {
    var t = Vex.Flow.keySignature.keySpecs[e];
    if (!t) throw new Vex.RERR("BadKeySignature", "Bad key signature spec: '" + e + "'");
    if (!t.acc) return [];
    for (var i = Vex.Flow.accidentalCodes.accidentals[t.acc].code, n = Vex.Flow.keySignature.accidentalList(t.acc), a = [], o = 0; o < t.num; ++o) {
        var d = n[o];
        a.push({
            glyphCode: i,
            line: d
        })
    }
    return a
}, Vex.Flow.keySignature.keySpecs = {
    C: {
        acc: null,
        num: 0
    },
    Am: {
        acc: null,
        num: 0
    },
    F: {
        acc: "b",
        num: 1
    },
    Dm: {
        acc: "b",
        num: 1
    },
    Bb: {
        acc: "b",
        num: 2
    },
    Gm: {
        acc: "b",
        num: 2
    },
    Eb: {
        acc: "b",
        num: 3
    },
    Cm: {
        acc: "b",
        num: 3
    },
    Ab: {
        acc: "b",
        num: 4
    },
    Fm: {
        acc: "b",
        num: 4
    },
    Db: {
        acc: "b",
        num: 5
    },
    Bbm: {
        acc: "b",
        num: 5
    },
    Gb: {
        acc: "b",
        num: 6
    },
    Ebm: {
        acc: "b",
        num: 6
    },
    Cb: {
        acc: "b",
        num: 7
    },
    Abm: {
        acc: "b",
        num: 7
    },
    G: {
        acc: "#",
        num: 1
    },
    Em: {
        acc: "#",
        num: 1
    },
    D: {
        acc: "#",
        num: 2
    },
    Bm: {
        acc: "#",
        num: 2
    },
    A: {
        acc: "#",
        num: 3
    },
    "F#m": {
        acc: "#",
        num: 3
    },
    E: {
        acc: "#",
        num: 4
    },
    "C#m": {
        acc: "#",
        num: 4
    },
    B: {
        acc: "#",
        num: 5
    },
    "G#m": {
        acc: "#",
        num: 5
    },
    "F#": {
        acc: "#",
        num: 6
    },
    "D#m": {
        acc: "#",
        num: 6
    },
    "C#": {
        acc: "#",
        num: 7
    },
    "A#m": {
        acc: "#",
        num: 7
    }
}, Vex.Flow.keySignature.accidentalList = function (e) {
    return "b" == e ? [2, .5, 2.5, 1, 3, 1.5, 3.5] : "#" == e ? [0, 1.5, -.5, 1, 2.5, .5, 2] : void 0
}, Vex.Flow.parseNoteDurationString = function (e) {
    if ("string" != typeof e) return null;
    var t = /(\d+|[a-z])(d*)([nrhms]|$)/,
        i = t.exec(e);
    if (!i) return null;
    var n = i[1],
        a = i[2].length,
        o = i[3];
    return 0 === o.length && (o = "n"), {
        duration: n,
        dots: a,
        type: o
    }
}, Vex.Flow.parseNoteData = function (e) {
    var t = e.duration,
        i = Vex.Flow.parseNoteDurationString(t);
    if (!i) return null;
    var n = Vex.Flow.durationToTicks(i.duration);
    if (null == n) return null;
    var a = e.type;
    if (a) {
        if ("n" !== a && "r" !== a && "h" !== a && "m" !== a && "s" !== a) return null
    } else a = i.type, a || (a = "n");
    var o = 0;
    if (o = e.dots ? e.dots : i.dots, "number" != typeof o) return null;
    for (var d = n, l = 0; o > l; l++) {
        if (1 >= d) return null;
        d /= 2, n += d
    }
    return {
        duration: i.duration,
        type: a,
        dots: o,
        ticks: n
    }
}, Vex.Flow.durationToTicks = function (e) {
    var t = Vex.Flow.durationAliases[e];
    void 0 !== t && (e = t);
    var i = Vex.Flow.durationToTicks.durations[e];
    return void 0 === i ? null : i
}, Vex.Flow.durationToTicks.durations = {
    1: Vex.Flow.RESOLUTION / 1,
    2: Vex.Flow.RESOLUTION / 2,
    4: Vex.Flow.RESOLUTION / 4,
    8: Vex.Flow.RESOLUTION / 8,
    16: Vex.Flow.RESOLUTION / 16,
    32: Vex.Flow.RESOLUTION / 32,
    64: Vex.Flow.RESOLUTION / 64,
    128: Vex.Flow.RESOLUTION / 128,
    256: Vex.Flow.RESOLUTION / 256
}, Vex.Flow.durationAliases = {
    w: "1",
    h: "2",
    q: "4",
    b: "256"
}, Vex.Flow.durationToGlyph = function (e, t) {
    var i = Vex.Flow.durationAliases[e];
    void 0 !== i && (e = i);
    var n = Vex.Flow.durationToGlyph.duration_codes[e];
    if (void 0 === n) return null;
    t || (t = "n");
    var a = n.type[t];
    return void 0 === a ? null : Vex.Merge(Vex.Merge({}, n.common), a)
}, Vex.Flow.durationToGlyph.duration_codes = {
    1: {
        common: {
            head_width: 15.5,
            stem: !1,
            stem_offset: 0,
            flag: !1,
            dot_shiftY: 0,
            line_above: 0,
            line_below: 0
        },
        type: {
            n: {
                code_head: "v1d"
            },
            h: {
                code_head: "v46"
            },
            m: {
                code_head: "v92",
                stem_offset: -3
            },
            r: {
                code_head: "v5c",
                head_width: 12.5,
                rest: !0,
                position: "D/5",
                dot_shiftY: .5
            },
            s: {
                head_width: 15,
                position: "B/4"
            }
        }
    },
    2: {
        common: {
            head_width: 9.5,
            stem: !0,
            stem_offset: 0,
            flag: !1,
            dot_shiftY: 0,
            line_above: 0,
            line_below: 0
        },
        type: {
            n: {
                code_head: "v81"
            },
            h: {
                code_head: "v2d"
            },
            m: {
                code_head: "v95",
                stem_offset: -3
            },
            r: {
                code_head: "vc",
                head_width: 12.5,
                stem: !1,
                rest: !0,
                position: "B/4",
                dot_shiftY: -.5
            },
            s: {
                head_width: 15,
                position: "B/4"
            }
        }
    },
    4: {
        common: {
            head_width: 9.5,
            stem: !0,
            stem_offset: 0,
            flag: !1,
            dot_shiftY: 0,
            line_above: 0,
            line_below: 0
        },
        type: {
            n: {
                code_head: "vb"
            },
            h: {
                code_head: "v22"
            },
            m: {
                code_head: "v3e",
                stem_offset: -3
            },
            r: {
                code_head: "v7c",
                head_width: 8,
                stem: !1,
                rest: !0,
                position: "B/4",
                dot_shiftY: -.5,
                line_above: 1.5,
                line_below: 1.5
            },
            s: {
                head_width: 15,
                position: "B/4"
            }
        }
    },
    8: {
        common: {
            head_width: 9.5,
            stem: !0,
            stem_offset: 0,
            flag: !0,
            beam_count: 1,
            code_flag_upstem: "v54",
            code_flag_downstem: "v9a",
            dot_shiftY: 0,
            line_above: 0,
            line_below: 0
        },
        type: {
            n: {
                code_head: "vb"
            },
            h: {
                code_head: "v22"
            },
            m: {
                code_head: "v3e"
            },
            r: {
                code_head: "va5",
                stem: !1,
                flag: !1,
                rest: !0,
                position: "B/4",
                dot_shiftY: -.5,
                line_above: 1,
                line_below: 1
            },
            s: {
                head_width: 15,
                position: "B/4"
            }
        }
    },
    16: {
        common: {
            beam_count: 2,
            head_width: 9.5,
            stem: !0,
            stem_offset: 0,
            flag: !0,
            code_flag_upstem: "v3f",
            code_flag_downstem: "v8f",
            dot_shiftY: 0,
            line_above: 0,
            line_below: 0
        },
        type: {
            n: {
                code_head: "vb"
            },
            h: {
                code_head: "v22"
            },
            m: {
                code_head: "v3e"
            },
            r: {
                code_head: "v3c",
                head_width: 13,
                stem: !1,
                flag: !1,
                rest: !0,
                position: "B/4",
                dot_shiftY: -.5,
                line_above: 1,
                line_below: 2
            },
            s: {
                head_width: 15,
                position: "B/4"
            }
        }
    },
    32: {
        common: {
            beam_count: 3,
            head_width: 9.5,
            stem: !0,
            stem_offset: 0,
            flag: !0,
            code_flag_upstem: "v47",
            code_flag_downstem: "v2a",
            dot_shiftY: 0,
            line_above: 0,
            line_below: 0
        },
        type: {
            n: {
                code_head: "vb"
            },
            h: {
                code_head: "v22"
            },
            m: {
                code_head: "v3e"
            },
            r: {
                code_head: "v55",
                head_width: 16,
                stem: !1,
                flag: !1,
                rest: !0,
                position: "B/4",
                dot_shiftY: -1.5,
                line_above: 2,
                line_below: 2
            },
            s: {
                head_width: 15,
                position: "B/4"
            }
        }
    },
    64: {
        common: {
            beam_count: 4,
            head_width: 9.5,
            stem: !0,
            stem_offset: 0,
            flag: !0,
            code_flag_upstem: "va9",
            code_flag_downstem: "v58",
            dot_shiftY: 0,
            line_above: 0,
            line_below: 0
        },
        type: {
            n: {
                code_head: "vb"
            },
            h: {
                code_head: "v22"
            },
            m: {
                code_head: "v3e"
            },
            r: {
                code_head: "v38",
                head_width: 18,
                stem: !1,
                flag: !1,
                rest: !0,
                position: "B/4",
                dot_shiftY: -1.5,
                line_above: 2,
                line_below: 3
            },
            s: {
                head_width: 15,
                position: "B/4"
            }
        }
    },
    128: {
        common: {
            beam_count: 5,
            head_width: 9.5,
            stem: !0,
            stem_offset: 0,
            flag: !0,
            code_flag_upstem: "v9b",
            code_flag_downstem: "v30",
            dot_shiftY: 0,
            line_above: 0,
            line_below: 0
        },
        type: {
            n: {
                code_head: "vb"
            },
            h: {
                code_head: "v22"
            },
            m: {
                code_head: "v3e"
            },
            r: {
                code_head: "vaa",
                head_width: 20,
                stem: !1,
                flag: !1,
                rest: !0,
                position: "B/4",
                dot_shiftY: 1.5,
                line_above: 3,
                line_below: 3
            },
            s: {
                head_width: 15,
                position: "B/4"
            }
        }
    }
}, Vex.Flow.TIME4_4 = {
    num_beats: 4,
    beat_value: 4,
    resolution: Vex.Flow.RESOLUTION
}, Vex.Flow.STEM_WIDTH = 1.5, Vex.Flow.STEM_HEIGHT = 35, Vex.Flow.STAVE_LINE_THICKNESS = 2;
Vex.Flow.Font = {
    glyphs: {
        v0: {
            x_min: 0,
            x_max: 514.5,
            ha: 525,
            o: "m 236 648 b 246 648 238 648 242 648 b 288 646 261 648 283 648 b 472 513 364 634 428 587 b 514 347 502 464 514 413 b 462 163 514 272 499 217 b 257 44 409 83 333 44 b 50 163 181 44 103 83 b 0 347 14 217 0 272 b 40 513 0 413 12 464 b 236 648 87 591 155 638 m 277 614 b 253 616 273 616 261 616 b 242 616 247 616 243 616 b 170 499 193 609 181 589 b 159 348 163 446 159 398 b 166 222 159 308 161 266 b 201 91 174 138 183 106 b 257 76 215 81 235 76 b 311 91 277 76 299 81 b 347 222 330 106 338 138 b 353 348 352 266 353 308 b 344 499 353 398 351 446 b 277 614 333 587 322 606 m 257 -1 l 258 -1 l 255 -1 l 257 -1 m 257 673 l 258 673 l 255 673 l 257 673 "
        },
        v1: {
            x_min: -1.359375,
            x_max: 344.359375,
            ha: 351,
            o: "m 126 637 l 129 638 l 198 638 l 266 638 l 269 635 b 274 631 272 634 273 632 l 277 627 l 277 395 b 279 156 277 230 277 161 b 329 88 281 123 295 106 b 344 69 341 81 344 79 b 337 55 344 62 343 59 l 333 54 l 197 54 l 61 54 l 58 55 b 50 69 53 59 50 62 b 65 88 50 79 53 81 b 80 97 72 91 74 93 b 117 156 103 113 112 129 b 117 345 117 161 117 222 l 117 528 l 100 503 l 38 406 b 14 383 24 384 23 383 b -1 398 5 383 -1 390 b 4 415 -1 403 1 409 b 16 437 5 416 10 426 l 72 539 l 100 596 b 121 632 119 631 119 631 b 126 637 122 634 125 635 m 171 -1 l 172 -1 l 170 -1 l 171 -1 m 171 673 l 172 673 l 170 673 l 171 673 "
        },
        v2: {
            x_min: -1.359375,
            x_max: 458.6875,
            ha: 468,
            o: "m 197 648 b 216 648 201 648 208 648 b 258 646 232 648 253 648 b 419 546 333 637 393 599 b 432 489 428 528 432 509 b 356 342 432 440 405 384 b 235 278 322 313 288 295 b 69 170 166 256 107 217 b 69 169 69 170 69 169 b 69 169 69 169 69 169 b 74 173 69 169 72 170 b 209 222 112 204 163 222 b 310 195 247 222 274 215 b 371 179 332 184 352 179 b 396 181 379 179 387 179 b 428 202 409 184 423 194 b 442 212 431 209 436 212 b 458 197 450 212 458 206 b 441 148 458 190 449 165 b 299 44 409 84 353 44 b 288 45 295 44 292 44 b 250 61 274 45 268 49 b 122 99 212 86 164 99 b 73 91 104 99 88 97 b 28 63 53 84 34 72 b 14 54 25 56 20 54 b 1 62 9 54 4 56 l -1 65 l -1 79 b 0 99 -1 91 0 95 b 2 113 1 102 2 108 b 164 309 20 197 81 272 b 285 470 232 341 277 398 b 287 487 287 476 287 481 b 171 595 287 551 239 595 b 155 595 166 595 160 595 b 142 592 145 594 142 594 b 145 589 142 592 142 591 b 179 527 168 576 179 551 b 132 455 179 496 163 467 b 104 451 122 452 112 451 b 27 530 62 451 27 487 b 29 555 27 538 27 546 b 197 648 44 601 115 639 m 228 -1 l 230 -1 l 227 -1 l 228 -1 m 228 673 l 230 673 l 227 673 l 228 673 "
        },
        v3: {
            x_min: -1.359375,
            x_max: 409.6875,
            ha: 418,
            o: "m 174 648 b 191 648 176 648 183 648 b 225 648 204 648 220 648 b 402 523 317 638 389 588 b 404 503 404 517 404 510 b 402 484 404 495 404 488 b 264 373 389 437 334 394 b 257 370 259 371 257 371 b 257 370 257 370 257 370 b 264 369 258 370 261 369 b 409 202 359 334 409 267 b 318 72 409 152 381 104 b 200 43 281 52 240 43 b 23 113 134 43 69 68 b 0 169 6 129 0 149 b 77 249 0 210 29 249 l 77 249 b 152 174 125 249 152 212 b 103 102 152 145 137 116 b 103 102 103 102 103 102 b 147 94 103 101 132 95 b 153 94 149 94 151 94 b 265 206 219 94 265 141 b 264 226 265 213 265 219 b 147 355 253 299 204 353 b 126 371 133 356 126 362 b 147 388 126 383 132 388 b 254 474 196 391 238 424 b 259 502 258 484 259 494 b 182 592 259 544 228 582 b 156 595 175 595 166 595 b 115 592 142 595 129 594 l 111 591 l 115 588 b 152 524 141 574 152 549 b 92 449 152 491 130 458 b 76 448 87 448 81 448 b -1 530 32 448 -1 488 b 20 581 -1 548 5 566 b 174 648 55 619 108 641 m 204 -1 l 205 -1 l 202 -1 l 204 -1 m 204 673 l 205 673 l 202 673 l 204 673 "
        },
        v4: {
            x_min: 0,
            x_max: 468.21875,
            ha: 478,
            o: "m 174 637 b 232 638 175 638 189 638 b 277 638 245 638 259 638 l 378 638 l 381 635 b 389 623 386 632 389 627 b 382 609 389 617 386 613 b 366 589 381 606 372 598 l 313 528 l 245 451 l 209 410 l 155 348 l 84 267 b 59 240 72 252 59 240 b 59 240 59 240 59 240 b 151 238 59 238 68 238 l 242 238 l 242 303 b 243 371 242 369 242 370 b 289 426 245 374 254 385 l 303 441 l 317 456 l 338 483 l 360 506 l 371 520 b 386 527 375 526 381 527 b 400 519 392 527 397 524 b 401 440 401 516 401 514 b 401 377 401 423 401 402 l 401 238 l 426 238 b 453 237 449 238 450 238 b 465 217 461 234 465 226 b 460 202 465 212 464 206 b 426 197 454 197 453 197 l 401 197 l 401 180 b 451 88 402 129 412 109 b 468 69 465 81 468 79 b 461 55 468 62 466 59 l 458 54 l 321 54 l 185 54 l 182 55 b 175 69 176 59 175 62 b 191 88 175 79 176 81 b 240 180 230 109 240 129 l 240 197 l 125 197 b 73 195 104 195 87 195 b 8 197 10 195 9 197 b 0 212 2 199 0 205 b 0 212 0 212 0 212 b 20 242 0 219 0 219 b 163 610 104 344 163 492 b 174 637 163 628 166 634 m 234 -1 l 235 -1 l 232 -1 l 234 -1 m 234 673 l 235 673 l 232 673 l 234 673 "
        },
        v5: {
            x_min: 0,
            x_max: 409.6875,
            ha: 418,
            o: "m 47 637 b 53 638 49 638 50 638 b 69 634 55 638 61 637 b 210 610 114 619 161 610 b 363 634 259 610 311 619 b 382 638 372 637 378 638 b 392 634 386 638 389 637 b 397 623 396 630 397 627 b 393 610 397 620 396 616 b 298 505 368 552 338 520 b 212 494 277 498 246 494 b 65 517 163 494 106 502 b 61 517 62 517 61 517 b 61 517 61 517 61 517 b 51 408 61 517 51 412 b 51 408 51 408 51 408 b 51 408 51 408 51 408 b 61 412 53 408 55 409 b 125 434 80 421 103 430 b 185 441 145 440 166 441 b 409 244 310 441 409 353 b 401 191 409 227 406 209 b 197 43 375 105 287 43 b 159 47 183 43 171 44 b 23 123 112 56 61 86 b 0 180 6 140 0 159 b 76 260 0 220 31 260 b 92 259 81 260 87 259 b 152 183 132 251 152 216 b 100 112 152 152 134 122 b 95 111 98 112 95 111 b 95 111 95 111 95 111 b 129 98 95 109 119 101 b 148 97 136 97 141 97 b 264 235 206 97 261 158 b 265 248 265 240 265 244 b 210 398 265 312 243 373 b 179 408 201 406 194 408 b 174 408 178 408 176 408 b 53 369 130 408 88 394 b 34 359 39 359 38 359 b 17 374 24 359 17 365 b 39 628 17 384 38 625 b 47 637 40 631 43 635 m 204 -1 l 205 -1 l 202 -1 l 204 -1 m 204 673 l 205 673 l 202 673 l 204 673 "
        },
        v6: {
            x_min: 0,
            x_max: 475.03125,
            ha: 485,
            o: "m 255 648 b 274 648 259 648 266 648 b 314 646 288 648 307 648 b 450 555 374 637 438 594 b 454 530 453 546 454 538 b 375 451 454 485 416 451 b 328 467 359 451 343 455 b 300 526 310 483 300 503 b 352 598 300 557 319 589 b 356 599 355 598 356 599 b 352 602 356 599 355 601 b 288 616 330 612 308 616 b 210 584 257 616 230 605 b 164 433 189 559 174 508 b 160 374 163 415 160 381 b 160 374 160 374 160 374 b 160 374 160 374 160 374 b 168 377 160 374 164 376 b 258 395 200 390 228 395 b 366 367 294 395 328 387 b 475 223 436 333 475 283 b 472 197 475 215 473 206 b 349 65 462 141 419 95 b 259 43 317 51 288 43 b 167 69 230 43 200 52 b 4 290 80 113 20 195 b 0 349 1 309 0 328 b 20 467 0 391 6 433 b 255 648 58 563 155 637 m 269 363 b 257 363 265 363 261 363 b 210 345 236 363 220 356 b 186 226 196 324 186 272 b 187 198 186 216 186 206 b 213 95 191 151 202 112 b 257 76 221 83 238 76 b 270 77 261 76 266 76 b 321 156 299 81 310 99 b 329 229 326 183 329 206 b 321 301 329 252 326 274 b 269 363 311 342 298 359 m 236 -1 l 238 -1 l 235 -1 l 236 -1 m 236 673 l 238 673 l 235 673 l 236 673 "
        },
        v7: {
            x_min: 0,
            x_max: 442.359375,
            ha: 451,
            o: "m 147 648 b 166 649 153 649 160 649 b 313 598 217 649 273 630 b 340 587 323 588 328 587 l 341 587 b 412 628 367 587 390 601 b 427 638 416 635 421 638 b 439 632 431 638 435 637 b 442 623 441 630 442 628 b 430 569 442 616 439 603 b 352 369 408 492 377 410 b 300 259 325 324 313 298 b 273 84 283 205 273 140 b 265 55 273 65 272 59 l 261 54 l 181 54 l 99 54 l 96 55 b 91 61 95 56 92 59 l 89 63 l 89 77 b 147 263 89 133 111 202 b 261 401 176 313 212 355 b 378 541 315 449 349 489 l 382 548 l 375 544 b 240 495 333 512 285 495 b 129 535 198 495 160 509 b 84 560 108 552 95 560 b 76 559 81 560 78 560 b 31 487 59 555 43 530 b 14 470 27 473 24 470 b 1 477 8 470 4 471 l 0 480 l 0 553 l 0 627 l 1 630 b 16 638 4 635 9 638 b 23 635 17 638 20 637 b 49 626 36 626 39 626 b 96 638 59 626 80 630 b 104 639 99 638 102 639 b 117 644 107 641 112 642 b 147 648 125 645 137 648 m 220 -1 l 221 -1 l 219 -1 l 220 -1 m 220 673 l 221 673 l 219 673 l 220 673 "
        },
        v8: {
            x_min: 0,
            x_max: 488.640625,
            ha: 499,
            o: "m 217 648 b 245 649 225 648 235 649 b 453 516 343 649 430 595 b 458 478 455 503 458 491 b 412 370 458 440 441 398 b 411 369 412 369 411 369 b 415 365 411 367 412 367 b 488 231 462 331 488 281 b 472 165 488 208 483 186 b 243 43 434 86 338 43 b 63 104 178 43 112 62 b 0 233 20 140 0 186 b 73 365 0 283 24 331 l 77 369 l 72 374 b 29 476 42 406 29 441 b 217 648 29 557 103 635 m 258 605 b 242 606 253 605 247 606 b 157 552 198 606 157 580 b 160 541 157 548 159 544 b 319 413 176 503 242 452 l 337 403 l 338 406 b 359 476 352 428 359 452 b 258 605 359 537 318 595 m 138 326 b 130 330 134 328 130 330 b 130 330 130 330 130 330 b 107 305 127 330 112 313 b 84 231 91 281 84 256 b 243 86 84 156 151 86 b 249 87 245 86 246 87 b 347 156 303 88 347 120 b 344 172 347 162 345 167 b 156 319 325 227 257 281 b 138 326 151 322 144 324 m 243 -1 l 245 -1 l 242 -1 l 243 -1 m 243 673 l 245 673 l 242 673 l 243 673 "
        },
        v9: {
            x_min: 0,
            x_max: 475.03125,
            ha: 485,
            o: "m 191 646 b 212 649 198 648 205 649 b 255 644 227 649 243 646 b 458 448 348 616 428 539 b 475 342 469 415 475 378 b 460 244 475 308 469 274 b 193 44 421 124 303 44 b 91 69 157 44 122 51 b 19 161 43 97 19 126 b 21 181 19 167 20 174 b 98 241 32 220 65 241 b 170 186 129 241 160 223 b 172 166 171 179 172 173 b 121 94 172 134 152 102 b 117 93 118 94 117 93 b 121 90 117 93 118 91 b 185 76 142 80 164 76 b 270 119 220 76 251 91 b 308 259 287 145 300 194 b 313 317 310 277 313 310 b 313 317 313 317 313 317 b 313 317 313 317 313 317 b 304 315 313 317 308 316 b 216 295 273 302 245 295 b 145 308 193 295 170 299 b 19 398 88 327 42 360 b 0 469 5 420 0 444 b 24 551 0 496 8 526 b 191 646 54 596 125 637 m 227 614 b 215 616 224 616 220 616 b 202 614 210 616 206 616 b 152 535 174 610 163 592 b 144 463 147 509 144 485 b 152 391 144 440 147 417 b 216 328 163 344 179 328 b 280 391 253 328 269 344 b 288 463 285 417 288 440 b 280 535 288 485 285 509 b 227 614 269 594 258 610 m 236 -1 l 238 -1 l 235 -1 l 236 -1 m 236 673 l 238 673 l 235 673 l 236 673 "
        },
        va: {
            x_min: -149.71875,
            x_max: 148.359375,
            ha: 151,
            o: "m -8 -1 b -1 0 -5 -1 -4 0 b 16 -11 5 0 13 -4 b 83 -186 17 -12 47 -90 l 148 -358 l 148 -363 b 127 -385 148 -376 138 -385 b 112 -378 122 -385 118 -383 b 54 -226 110 -374 114 -385 b 0 -81 24 -147 0 -81 b -55 -226 -1 -81 -25 -147 b -114 -378 -115 -385 -111 -374 b -129 -385 -119 -383 -123 -385 b -149 -363 -140 -385 -149 -376 l -149 -358 l -84 -186 b -19 -11 -49 -90 -19 -12 b -8 -1 -17 -8 -12 -4 "
        },
        vb: {
            x_min: 0,
            x_max: 428.75,
            ha: 438,
            o: "m 262 186 b 273 186 266 186 272 186 b 274 186 273 186 274 186 b 285 186 274 186 280 186 b 428 48 375 181 428 122 b 386 -68 428 12 416 -29 b 155 -187 329 -145 236 -187 b 12 -111 92 -187 38 -162 b 0 -51 4 -91 0 -72 b 262 186 0 58 122 179 "
        },
        vc: {
            x_min: 0,
            x_max: 447.8125,
            ha: 457,
            o: "m 0 86 l 0 173 l 223 173 l 447 173 l 447 86 l 447 0 l 223 0 l 0 0 l 0 86 "
        },
        vf: {
            x_min: 0,
            x_max: 370.21875,
            ha: 378,
            o: "m 0 0 l 0 277 l 61 277 l 122 277 l 122 0 l 122 -278 l 61 -278 l 0 -278 l 0 0 m 246 -1 l 246 277 l 308 277 l 370 277 l 370 -1 l 370 -278 l 308 -278 l 246 -278 l 246 -1 "
        },
        v10: {
            x_min: 0,
            x_max: 559.421875,
            ha: 571,
            o: "m 5 127 b 14 127 6 127 9 127 b 51 126 25 127 43 127 b 175 98 93 122 138 112 l 186 94 b 279 51 210 86 255 65 b 285 47 280 51 283 48 b 319 27 291 44 311 31 l 326 22 b 359 0 332 19 352 4 l 367 -6 b 371 -9 368 -6 370 -8 l 379 -15 b 387 -22 383 -18 386 -20 l 398 -30 l 411 -40 l 417 -47 l 427 -55 l 434 -61 b 441 -66 436 -62 439 -65 l 446 -72 l 453 -77 l 462 -87 b 558 -188 490 -113 549 -176 b 559 -195 559 -191 559 -194 b 548 -205 559 -201 555 -205 b 541 -204 547 -205 544 -205 b 534 -198 539 -201 536 -199 l 525 -191 b 481 -162 518 -187 490 -167 b 472 -155 477 -159 472 -156 b 468 -152 470 -155 469 -154 b 461 -149 466 -152 464 -151 b 428 -130 454 -145 441 -137 b 371 -99 413 -122 372 -99 b 363 -95 371 -99 367 -98 b 353 -91 357 -94 353 -91 b 348 -90 353 -91 352 -91 b 332 -81 343 -87 341 -86 b 27 -12 230 -37 127 -13 b 0 -5 4 -11 2 -11 b 0 58 0 -2 0 27 b 0 122 0 88 0 120 b 5 127 1 124 4 126 "
        },
        v11: {
            x_min: -155.171875,
            x_max: 153.8125,
            ha: 157,
            o: "m -137 353 b -130 353 -136 353 -133 353 b -112 349 -125 353 -119 352 b -100 342 -110 347 -104 344 b 0 317 -69 326 -35 317 b 111 349 38 317 76 328 b 129 353 117 352 123 353 b 153 327 142 353 153 344 b 144 302 153 320 153 317 b 27 6 93 226 50 113 b 21 -13 24 -11 24 -11 b 0 -26 17 -22 8 -26 b -24 -12 -9 -26 -19 -22 b -28 5 -24 -9 -27 -2 b -145 302 -53 117 -95 224 b -155 327 -155 317 -155 320 b -137 353 -155 340 -148 349 "
        },
        v18: {
            x_min: 0,
            x_max: 323.9375,
            ha: 331,
            o: "m 217 535 b 225 537 220 537 221 537 b 245 524 235 537 242 533 l 246 521 l 247 390 l 247 258 l 273 265 b 306 270 288 269 299 270 b 322 259 315 270 319 267 b 323 208 323 256 323 233 b 322 158 323 184 323 159 b 288 140 318 148 315 147 b 247 130 254 131 247 130 b 247 65 247 130 247 104 b 247 20 247 51 247 36 l 247 -88 l 273 -81 b 306 -76 289 -77 299 -76 b 318 -81 311 -76 315 -77 b 323 -123 323 -87 323 -86 l 323 -138 l 323 -154 b 318 -195 323 -191 323 -190 b 269 -210 314 -199 315 -199 b 249 -216 259 -213 250 -216 l 247 -216 l 247 -349 l 246 -483 l 245 -487 b 225 -499 242 -495 234 -499 b 206 -487 219 -499 210 -495 l 205 -483 l 205 -355 l 205 -227 l 204 -227 l 181 -233 l 138 -244 b 117 -249 127 -247 117 -249 b 115 -385 115 -249 115 -256 l 115 -523 l 114 -526 b 95 -538 110 -534 102 -538 b 74 -526 87 -538 78 -534 l 73 -523 l 73 -391 b 72 -260 73 -269 73 -260 b 72 -260 72 -260 72 -260 b 19 -273 61 -263 23 -273 b 0 -260 10 -273 4 -267 b 0 -209 0 -256 0 -256 l 0 -162 l 1 -158 b 61 -134 5 -148 5 -148 l 73 -131 l 73 -22 b 72 86 73 79 73 86 b 72 86 72 86 72 86 b 19 74 61 83 23 74 b 0 86 10 74 4 79 b 0 137 0 90 0 90 l 0 184 l 1 188 b 61 212 5 198 5 198 l 73 215 l 73 348 l 73 481 l 74 485 b 95 498 78 492 87 498 b 103 495 98 498 100 496 b 114 485 107 494 111 489 l 115 481 l 115 353 l 115 226 l 121 226 b 159 235 123 227 141 231 l 198 247 l 205 248 l 205 384 l 205 521 l 206 524 b 217 535 209 528 212 533 m 205 9 b 205 119 205 70 205 119 l 205 119 b 182 113 204 119 194 116 l 138 102 b 117 97 127 99 117 97 b 115 -12 115 97 115 91 l 115 -122 l 121 -120 b 159 -111 123 -119 141 -115 l 198 -101 l 205 -98 l 205 9 "
        },
        v1b: {
            x_min: 0,
            x_max: 559.421875,
            ha: 571,
            o: "m 544 204 b 548 204 545 204 547 204 b 559 194 555 204 559 199 b 559 190 559 192 559 191 b 530 156 559 188 556 184 b 462 86 510 134 481 104 b 453 76 458 81 454 77 l 446 70 l 441 65 b 434 59 439 63 436 61 l 427 54 b 409 37 426 51 416 44 b 392 23 398 29 394 26 b 387 19 389 22 387 20 b 379 13 386 19 383 16 l 371 8 l 367 5 l 359 -1 l 337 -16 b 285 -48 319 -29 298 -41 l 279 -52 b 186 -95 255 -66 210 -87 l 175 -99 b 23 -129 127 -117 68 -129 b 17 -129 20 -129 19 -129 b 1 -123 2 -129 2 -129 b 0 -49 0 -122 0 -83 b 0 4 0 -22 0 1 b 27 11 2 9 4 9 b 185 31 78 12 145 20 b 198 34 186 31 193 33 b 314 73 234 44 277 58 b 349 88 328 79 340 84 b 353 90 352 90 353 90 b 363 94 353 90 357 93 b 371 98 367 97 371 98 b 428 129 372 98 413 120 b 461 148 441 136 454 144 b 468 151 464 149 466 151 b 472 154 469 152 470 154 b 481 161 473 155 477 158 b 525 190 490 166 518 186 l 534 197 b 540 201 536 198 539 199 b 544 204 541 202 544 204 "
        },
        v1d: {
            x_min: 0,
            x_max: 619.3125,
            ha: 632,
            o: "m 274 184 b 307 186 285 186 296 186 b 616 22 465 186 597 116 b 619 -1 617 13 619 5 b 308 -187 619 -104 483 -187 b 0 -1 133 -187 0 -102 b 5 36 0 11 1 23 b 274 184 29 115 141 176 m 289 161 b 272 162 284 162 277 162 b 171 41 209 162 171 108 b 205 -73 171 5 182 -34 b 345 -163 243 -133 298 -163 b 436 -98 385 -163 420 -142 b 446 -43 443 -80 446 -62 b 289 161 446 47 377 147 "
        },
        v1e: {
            x_min: -402.890625,
            x_max: 401.53125,
            ha: 410,
            o: "m -219 173 b -213 174 -217 174 -215 174 b -202 173 -209 174 -205 173 b -114 86 -200 172 -179 151 b -28 0 -66 37 -28 0 b 40 84 -28 0 2 37 b 117 174 111 173 110 172 b 122 174 118 174 119 174 b 132 173 125 174 129 173 b 295 11 134 172 171 134 l 307 -1 l 336 34 b 374 76 366 72 368 74 b 381 77 375 77 378 77 b 401 56 392 77 401 68 b 400 48 401 54 401 51 b 223 -172 397 41 230 -166 b 210 -176 220 -174 215 -176 b 201 -174 206 -176 204 -176 b 112 -87 198 -173 178 -152 b 27 0 65 -38 27 0 b -42 -86 27 0 -4 -38 b -118 -174 -112 -174 -111 -173 b -123 -176 -119 -176 -121 -176 b -133 -174 -126 -176 -130 -174 b -296 -12 -136 -173 -172 -137 l -308 0 l -337 -34 b -375 -77 -367 -73 -370 -76 b -382 -79 -377 -79 -379 -79 b -402 -58 -393 -79 -402 -69 b -401 -49 -402 -55 -402 -52 b -224 172 -398 -43 -228 167 b -219 173 -223 172 -220 173 "
        },
        v1f: {
            x_min: -340.28125,
            x_max: 338.921875,
            ha: 346,
            o: "m -32 520 b -29 521 -31 520 -31 521 b -23 519 -27 521 -24 520 b -20 513 -21 517 -20 516 b -21 506 -20 512 -20 509 b -31 474 -23 502 -27 488 l -53 402 l -66 352 l -68 349 l -57 349 b -32 351 -51 349 -40 351 b 123 370 19 352 74 359 b 137 371 127 370 133 371 b 170 356 152 371 164 366 b 171 355 170 355 170 355 b 216 366 174 355 183 358 b 280 378 268 377 266 377 b 287 378 283 378 284 378 b 332 349 307 378 322 369 b 338 319 336 341 338 330 b 332 301 338 310 336 302 b 242 280 329 299 246 280 b 242 280 242 280 242 280 b 235 288 236 280 235 283 b 235 292 235 290 235 291 b 236 302 236 297 236 299 b 220 337 236 316 230 330 l 216 340 l 210 335 b 159 276 189 322 172 301 b 118 149 152 265 156 274 b 81 34 84 36 85 36 b -8 13 78 33 -4 13 b -8 13 -8 13 -8 13 b -14 20 -12 15 -14 15 b -8 44 -14 24 -12 31 b -2 66 -5 55 -2 65 b -2 66 -2 66 -2 66 l -2 66 b -43 41 -2 66 -21 55 b -114 4 -98 8 -98 8 b -144 0 -123 0 -134 0 b -242 99 -197 0 -242 43 b -242 109 -242 102 -242 105 b -212 219 -240 122 -242 116 b -185 312 -197 270 -185 312 l -185 312 b -189 312 -185 312 -186 312 b -259 312 -200 312 -227 312 b -321 310 -291 312 -310 310 b -334 312 -330 310 -334 312 b -340 319 -338 313 -340 316 b -336 326 -340 322 -338 324 b -291 337 -334 326 -314 331 l -247 347 l -210 348 b -172 348 -190 348 -172 348 b -168 363 -172 348 -171 355 b -145 442 -151 424 -145 441 b -133 452 -144 444 -140 446 l -77 489 b -32 520 -53 506 -32 520 m 57 334 b 53 335 55 335 54 335 b 44 334 50 335 49 335 b -70 316 8 326 -28 320 b -78 309 -78 316 -78 316 b -108 202 -80 305 -88 274 b -141 81 -136 112 -141 93 b -140 74 -141 79 -141 77 b -117 49 -137 59 -127 49 b -107 52 -114 49 -110 51 b 16 127 -106 54 14 126 b 42 217 16 127 42 215 b 49 241 42 222 44 229 b 73 320 53 251 73 317 b 57 334 73 327 65 333 "
        },
        v22: {
            x_min: 0,
            x_max: 432.828125,
            ha: 442,
            o: "m 209 186 b 213 187 210 187 212 187 b 216 187 215 187 216 187 b 224 174 216 186 220 180 b 420 -1 269 105 338 43 b 432 -12 431 -8 432 -9 b 421 -23 432 -15 432 -16 b 228 -180 345 -70 264 -137 b 219 -188 221 -188 221 -188 l 219 -188 b 208 -177 215 -188 215 -188 b 10 1 163 -106 93 -44 b 0 11 0 6 0 8 b 10 22 0 13 0 15 b 202 179 87 69 167 136 b 209 186 206 183 209 186 "
        },
        v23: {
            x_min: 0,
            x_max: 133.390625,
            ha: 136,
            o: "m 54 66 b 65 68 58 68 61 68 b 122 37 88 68 110 56 b 133 -1 130 26 133 12 b 104 -58 133 -23 123 -44 b 66 -69 92 -65 78 -69 b 10 -38 44 -69 23 -58 b 0 -1 2 -27 0 -13 b 54 66 0 30 20 61 "
        },
        v25: {
            x_min: 0,
            x_max: 318.5,
            ha: 325,
            o: "m 20 376 b 167 377 23 377 96 377 b 296 376 231 377 294 377 b 318 347 311 371 318 359 b 296 316 318 333 311 320 b 159 315 294 315 227 315 b 21 316 91 315 24 315 b 0 345 6 320 0 333 b 20 376 0 359 6 371 "
        },
        v26: {
            x_min: -21.78125,
            x_max: 483.1875,
            ha: 493,
            o: "m -8 631 b -1 632 -6 632 -4 632 b 19 620 8 632 16 628 b 20 383 20 616 20 616 l 20 148 l 21 151 b 140 199 59 183 102 199 b 206 179 164 199 187 192 l 210 176 l 210 396 l 210 617 l 212 621 b 231 632 216 628 223 632 b 250 620 239 632 247 628 b 251 383 251 616 251 616 l 251 148 l 254 151 b 370 199 291 183 332 199 b 415 191 385 199 400 197 b 483 84 458 176 483 134 b 461 0 483 58 476 29 b 332 -142 439 -40 411 -72 l 255 -215 b 231 -229 240 -229 239 -229 b 216 -223 224 -229 220 -227 b 210 -158 210 -217 210 -223 b 210 -120 210 -148 210 -136 l 210 -29 l 205 -34 b 100 -142 182 -65 159 -88 l 23 -215 b -1 -229 9 -229 6 -229 b -20 -216 -9 -229 -17 -224 l -21 -212 l -21 201 l -21 616 l -20 620 b -8 631 -17 624 -13 630 m 110 131 b 96 133 106 133 100 133 b 89 133 93 133 91 133 b 24 87 63 129 40 113 l 20 80 l 20 -37 l 20 -156 l 23 -152 b 144 81 96 -72 144 20 l 144 83 b 110 131 144 113 134 126 m 341 131 b 328 133 337 133 332 133 b 322 133 326 133 323 133 b 257 87 296 129 273 113 l 251 80 l 251 -37 l 251 -156 l 255 -152 b 375 81 328 -72 375 20 l 375 83 b 341 131 375 113 367 126 "
        },
        v27: {
            x_min: 0,
            x_max: 432.828125,
            ha: 442,
            o: "m 208 184 b 213 187 209 186 212 187 b 224 176 217 187 221 183 b 245 147 225 172 235 159 b 419 -1 288 90 347 38 b 431 -8 424 -4 431 -8 b 432 -12 432 -9 432 -11 b 430 -18 432 -13 432 -16 b 364 -61 424 -20 383 -47 b 225 -183 307 -102 250 -152 b 223 -187 224 -184 223 -187 b 220 -188 221 -188 220 -188 b 208 -176 216 -188 210 -184 b 187 -148 205 -173 197 -159 b 12 0 144 -90 84 -38 b 0 11 4 5 0 8 b 16 24 0 13 4 18 b 183 158 83 69 141 115 b 208 184 194 169 198 173 m 183 105 b 176 113 181 109 176 113 b 172 109 176 113 175 112 b 92 45 149 90 117 62 l 88 41 l 102 31 b 247 -105 160 -6 210 -55 l 254 -115 l 257 -112 l 269 -102 b 340 -45 287 -87 319 -61 l 344 -43 l 330 -33 b 183 105 272 6 221 54 "
        },
        v28: {
            x_min: -73.5,
            x_max: 72.140625,
            ha: 74,
            o: "m -72 252 l -73 254 l 0 254 l 72 254 l 70 252 b 0 -1 70 248 0 -1 b -72 252 -1 -1 -72 248 "
        },
        v2a: {
            x_min: -21.78125,
            x_max: 366.140625,
            ha: 374,
            o: "m 276 1378 b 284 1379 279 1379 281 1379 b 306 1360 292 1379 298 1374 b 352 1247 326 1326 343 1286 b 366 1139 362 1213 366 1175 b 347 1009 366 1093 359 1049 l 344 1002 l 347 992 b 352 971 348 986 351 977 b 366 863 362 936 366 899 b 347 732 366 818 359 773 l 344 725 l 347 716 b 352 695 348 710 351 700 b 366 588 362 659 366 623 b 223 262 366 464 314 345 b 189 233 212 252 212 252 b 35 76 126 183 73 129 b -1 16 20 56 2 27 b -19 4 -4 9 -12 4 l -21 4 l -21 137 l -21 270 l -17 270 b 186 344 59 281 134 308 b 319 606 270 399 319 499 b 317 650 319 620 319 635 l 315 659 l 314 655 b 223 537 288 607 258 570 b 189 509 212 528 212 528 b 35 352 126 459 73 405 b -1 292 20 333 2 303 b -19 280 -4 285 -12 280 l -21 280 l -21 413 l -21 546 l -17 546 b 186 620 59 557 134 584 b 319 882 270 675 319 775 b 317 925 319 896 319 911 l 315 935 l 314 931 b 223 813 288 884 258 846 b 189 785 212 805 212 805 b 35 628 126 735 73 681 b -1 569 20 609 2 580 b -19 556 -4 562 -12 556 l -21 556 l -21 689 l -21 823 l -17 823 b 202 907 68 835 152 867 b 319 1157 280 968 319 1061 b 270 1338 319 1218 303 1281 b 262 1358 264 1349 262 1353 b 262 1364 262 1360 262 1363 b 276 1378 265 1371 269 1376 "
        },
        v2d: {
            x_min: 0,
            x_max: 438.28125,
            ha: 447,
            o: "m 212 190 b 219 191 213 191 216 191 b 236 176 225 191 228 190 b 419 18 277 105 341 49 b 436 5 431 13 434 11 b 438 -1 438 4 438 1 b 424 -16 438 -8 432 -13 b 356 -49 409 -20 379 -36 b 234 -180 306 -83 258 -133 b 219 -192 230 -188 224 -192 b 200 -176 213 -192 206 -187 b 9 -15 157 -102 89 -45 b 0 0 2 -12 0 -6 b 16 18 0 9 2 12 b 200 176 93 48 159 104 b 212 190 205 186 208 188 m 239 113 b 236 117 238 116 238 117 b 230 108 235 117 234 115 b 92 -15 196 58 140 8 b 88 -18 91 -16 88 -18 b 92 -20 88 -18 91 -19 b 198 -116 130 -43 166 -74 b 200 -117 200 -117 200 -117 b 201 -117 200 -117 201 -117 b 264 -43 212 -98 242 -62 b 345 15 288 -19 321 4 b 348 18 347 16 348 16 b 344 20 348 18 347 19 b 239 113 307 41 266 79 "
        },
        v2f: {
            x_min: -1.359375,
            x_max: 680.5625,
            ha: 694,
            o: "m 597 1042 b 604 1042 600 1042 602 1042 b 642 1002 627 1042 642 1022 b 619 966 642 988 635 974 b 439 927 574 942 503 927 l 426 927 l 426 921 b 430 838 428 893 430 866 b 345 480 430 696 398 560 b 179 391 307 423 249 391 b 156 392 171 391 164 392 b 138 394 149 394 142 394 b 103 434 115 396 103 416 b 129 471 103 451 111 466 b 141 474 133 473 137 474 b 172 459 153 474 164 469 b 181 455 175 456 176 455 b 187 456 182 455 185 455 b 253 520 212 460 234 483 b 315 836 294 605 315 714 b 311 928 315 867 314 898 b 302 945 310 943 311 942 b 245 953 283 950 262 953 b 130 891 193 953 149 931 b 84 860 119 870 102 860 b 36 905 61 860 39 877 b 36 910 36 907 36 909 b 80 970 36 931 50 949 b 249 1017 125 1000 187 1017 b 322 1009 273 1017 299 1014 l 341 1003 b 436 991 372 995 406 991 b 577 1031 495 991 545 1004 b 597 1042 583 1038 590 1041 m 416 360 b 424 360 419 360 421 360 b 481 309 454 360 479 338 b 503 145 484 280 495 199 b 585 -185 525 16 555 -106 b 630 -245 596 -213 613 -237 l 634 -247 l 638 -245 b 647 -244 641 -245 645 -244 b 680 -278 666 -244 680 -262 b 664 -308 680 -290 675 -301 b 638 -312 658 -310 650 -312 b 613 -309 631 -312 623 -310 b 477 -201 555 -303 502 -260 b 417 -2 460 -159 434 -72 b 416 5 417 1 416 5 b 416 5 416 5 416 5 b 411 -5 415 5 413 0 b 359 -97 397 -33 377 -70 b 353 -106 355 -102 353 -105 b 359 -112 353 -108 355 -109 b 409 -130 375 -123 390 -129 b 426 -134 420 -130 421 -131 b 431 -147 428 -137 431 -141 b 420 -162 431 -152 427 -159 b 382 -169 409 -166 396 -169 b 323 -155 363 -169 341 -165 l 317 -152 l 314 -155 b 62 -303 240 -240 148 -295 b 36 -305 55 -305 44 -305 b 23 -303 29 -305 24 -305 b -1 -273 6 -299 -1 -287 b 31 -240 -1 -256 10 -240 b 36 -240 32 -240 34 -240 b 42 -241 38 -241 39 -241 b 134 -204 63 -241 99 -226 b 367 288 265 -115 357 81 b 375 330 368 313 370 320 b 416 360 383 347 400 358 m 360 -359 b 379 -359 363 -359 371 -359 b 424 -360 396 -359 416 -359 b 646 -502 536 -373 624 -430 b 649 -527 649 -510 649 -519 b 530 -673 649 -578 604 -635 l 521 -677 l 529 -681 b 653 -811 592 -714 637 -762 b 660 -853 658 -827 660 -839 b 645 -911 660 -873 656 -892 b 426 -1021 608 -981 519 -1021 b 283 -989 377 -1021 328 -1011 b 235 -949 249 -972 239 -964 b 234 -936 234 -946 234 -941 b 234 -928 234 -934 234 -931 l 235 -925 l 234 -927 l 225 -934 b 87 -982 186 -966 138 -982 b 80 -982 85 -982 83 -982 b 55 -981 70 -981 58 -981 b 17 -943 32 -981 17 -964 b 54 -904 17 -921 35 -904 b 78 -914 62 -904 72 -909 l 83 -918 l 88 -918 b 190 -831 122 -918 166 -881 b 269 -506 242 -727 269 -612 b 268 -462 269 -492 269 -477 b 266 -449 266 -458 266 -452 b 265 -444 266 -445 266 -444 b 257 -446 264 -444 261 -445 b 132 -545 196 -470 152 -505 b 88 -573 122 -563 104 -573 b 39 -523 63 -573 39 -553 b 63 -476 39 -505 44 -494 b 360 -359 136 -408 235 -369 m 419 -424 b 393 -423 411 -423 406 -423 l 375 -423 l 377 -426 b 379 -439 377 -427 378 -434 b 383 -510 382 -463 383 -487 b 314 -811 383 -609 360 -710 b 266 -893 296 -850 285 -870 b 264 -898 265 -896 264 -898 l 264 -898 b 264 -898 264 -898 264 -898 b 268 -898 264 -898 266 -898 b 273 -898 270 -898 272 -898 b 300 -909 283 -898 291 -900 b 426 -957 340 -941 385 -957 b 476 -949 443 -957 460 -954 b 547 -853 522 -931 547 -893 b 485 -745 547 -816 526 -775 b 397 -707 460 -727 432 -714 b 366 -675 375 -703 366 -692 b 396 -642 366 -657 377 -645 b 530 -557 455 -637 511 -601 b 536 -527 534 -548 536 -537 b 419 -424 536 -480 490 -437 "
        },
        v30: {
            x_min: -21.78125,
            x_max: 367.5,
            ha: 375,
            o: "m 276 1900 b 284 1901 279 1900 281 1901 b 306 1883 291 1901 298 1896 b 367 1686 347 1825 367 1757 b 343 1558 367 1643 359 1600 l 338 1549 l 343 1537 b 367 1411 359 1497 367 1454 b 343 1282 367 1367 359 1324 l 338 1272 l 343 1261 b 367 1135 359 1221 367 1178 b 343 1007 367 1090 359 1047 l 338 996 l 343 985 b 367 859 359 945 367 902 b 343 731 367 814 359 771 l 338 720 l 343 709 b 367 582 359 667 367 626 b 289 362 367 503 340 426 b 239 312 276 345 259 330 b 29 77 152 237 76 152 b -1 18 14 54 2 30 b -19 4 -4 11 -12 4 l -21 4 l -21 133 l -20 260 l -13 262 b 98 299 17 269 62 284 b 111 305 103 302 110 305 b 167 334 123 310 156 327 b 319 595 264 391 319 491 b 313 659 319 616 318 638 b 310 667 311 664 311 667 b 307 663 310 667 308 666 b 240 588 289 637 269 614 b 16 331 141 505 62 413 b -1 294 8 316 1 302 b -19 280 -4 287 -12 280 l -21 280 l -21 408 l -20 537 l -13 538 b 98 576 17 545 62 560 b 111 581 103 578 110 581 b 167 610 123 587 156 603 b 319 871 264 667 319 767 b 313 935 319 892 318 913 b 310 942 311 941 311 942 b 307 939 310 942 308 941 b 240 864 289 913 269 889 b 16 607 141 781 62 689 b -1 570 8 592 1 578 b -19 556 -4 563 -12 556 l -21 556 l -21 684 l -20 813 l -13 814 b 98 852 17 821 62 836 b 111 857 103 855 110 857 b 167 886 123 863 156 880 b 319 1147 264 943 319 1043 b 313 1211 319 1168 318 1189 b 310 1218 311 1217 311 1218 b 307 1215 310 1218 308 1217 b 240 1140 289 1188 269 1165 b 16 884 141 1057 62 966 b -1 846 8 868 1 855 b -19 832 -4 839 -12 832 l -21 832 l -21 960 l -20 1089 l -13 1090 b 98 1128 17 1097 62 1111 b 111 1134 103 1131 110 1134 b 167 1163 123 1139 156 1156 b 319 1424 264 1220 319 1320 b 313 1486 319 1444 318 1465 b 310 1494 311 1493 311 1494 b 307 1492 310 1494 308 1493 b 240 1417 289 1464 269 1442 b 16 1160 141 1333 62 1242 b -1 1121 8 1145 1 1131 b -19 1109 -4 1115 -12 1109 l -21 1109 l -21 1236 l -20 1365 l -13 1367 b 98 1404 17 1374 62 1388 b 111 1410 103 1407 110 1410 b 250 1508 172 1437 215 1467 b 319 1701 296 1564 319 1633 b 270 1859 319 1757 303 1814 b 262 1882 265 1868 262 1875 b 276 1900 262 1890 266 1896 "
        },
        v33: {
            x_min: -423.3125,
            x_max: 421.9375,
            ha: 431,
            o: "m -10 276 b -2 277 -8 277 -5 277 b 17 265 5 277 13 273 b 19 163 19 260 19 260 l 19 68 l 39 45 b 277 -95 122 -34 200 -81 b 289 -97 281 -97 285 -97 b 378 0 332 -97 371 -54 b 378 11 378 4 378 6 b 302 83 378 55 345 83 b 242 66 283 83 262 77 b 208 56 231 59 219 56 b 148 120 175 56 148 81 b 200 186 148 151 164 172 b 261 198 220 194 240 198 b 420 45 341 198 411 137 b 421 22 421 37 421 29 b 257 -198 421 -86 347 -188 b 242 -198 251 -198 247 -198 b 20 -105 181 -198 95 -163 l 19 -104 l 19 -183 b 19 -216 19 -195 19 -206 b 12 -273 19 -272 17 -267 b -2 -278 8 -277 2 -278 b -21 -266 -10 -278 -19 -274 b -23 -165 -23 -263 -23 -262 l -23 -69 l -44 -47 b -250 86 -117 23 -183 66 b -295 94 -270 93 -284 94 b -315 91 -302 94 -308 94 b -381 5 -356 81 -381 43 b -355 -56 -381 -16 -372 -40 b -299 -81 -338 -73 -319 -81 b -246 -68 -283 -81 -265 -77 b -212 -58 -234 -61 -223 -58 b -168 -77 -196 -58 -179 -65 b -151 -122 -156 -90 -151 -105 b -179 -174 -151 -141 -160 -162 b -239 -195 -194 -184 -217 -192 b -257 -197 -245 -195 -250 -197 b -423 -5 -349 -197 -423 -113 b -423 0 -423 -4 -423 -1 b -277 194 -420 97 -362 173 b -247 197 -268 197 -258 197 b -24 104 -185 197 -100 162 l -23 102 l -23 181 b -21 265 -23 260 -23 260 b -10 276 -20 269 -14 274 "
        },
        v38: {
            x_min: -1.359375,
            x_max: 651.96875,
            ha: 665,
            o: "m 389 644 b 405 645 394 645 400 645 b 504 566 450 645 492 613 b 507 541 506 557 507 549 b 480 471 507 514 498 489 l 477 467 l 483 470 b 609 591 539 485 586 531 b 613 601 611 595 613 599 b 631 609 619 607 624 609 b 651 588 641 609 651 602 b 200 -946 651 584 204 -941 b 182 -957 197 -953 190 -957 b 163 -945 174 -957 166 -953 b 161 -939 161 -942 161 -942 b 217 -743 161 -931 170 -904 b 272 -555 247 -639 272 -555 b 272 -555 272 -555 272 -555 b 264 -560 272 -555 268 -557 b 140 -603 227 -589 182 -603 b 36 -567 102 -603 65 -592 b -1 -487 12 -548 -1 -517 b 17 -427 -1 -466 5 -445 b 103 -380 38 -395 70 -380 b 191 -433 137 -380 172 -398 b 205 -484 201 -448 205 -466 b 178 -553 205 -509 196 -535 l 175 -557 l 182 -555 b 307 -435 236 -539 284 -494 b 372 -213 308 -430 372 -215 b 372 -213 372 -213 372 -213 b 364 -219 372 -213 368 -216 b 240 -262 328 -247 283 -262 b 137 -226 202 -262 166 -249 b 99 -145 112 -206 99 -176 b 118 -84 99 -124 106 -104 b 204 -38 138 -54 171 -38 b 292 -91 238 -38 273 -56 b 306 -141 302 -106 306 -124 b 279 -212 306 -167 296 -194 l 276 -215 l 281 -213 b 408 -93 336 -198 385 -151 b 473 129 409 -88 473 127 b 473 129 473 129 473 129 b 465 122 473 129 469 126 b 341 80 428 94 383 80 b 236 115 303 80 266 91 b 200 195 213 136 200 165 b 217 256 200 217 206 238 b 304 303 239 287 272 303 b 393 249 338 303 374 285 b 406 199 402 234 406 217 b 379 129 406 173 397 148 l 377 126 l 382 127 b 509 248 436 142 485 190 b 574 470 510 254 574 469 b 574 470 574 470 574 470 b 566 464 574 470 570 467 b 442 421 529 435 484 421 b 337 458 404 421 367 433 b 300 537 313 478 300 508 b 389 644 300 585 334 635 "
        },
        v3b: {
            x_min: 0,
            x_max: 484.5625,
            ha: 494,
            o: "m 228 245 b 239 247 234 247 239 247 b 243 247 240 247 242 247 b 303 238 257 247 287 242 b 484 -2 417 208 484 104 b 412 -177 484 -65 461 -127 b 243 -248 363 -226 303 -248 b 6 -63 138 -248 36 -180 b 0 -1 1 -41 0 -20 b 228 245 0 127 98 240 m 255 181 b 240 183 247 183 245 183 b 232 181 238 183 235 183 b 142 152 200 180 168 170 l 138 149 l 190 97 l 242 44 l 294 97 l 345 149 l 340 152 b 255 181 315 169 284 180 m 147 -54 l 197 -1 l 147 51 l 95 104 l 91 99 b 62 -1 72 70 62 34 b 66 -43 62 -15 63 -29 b 91 -101 72 -63 80 -84 l 95 -106 l 147 -54 m 393 99 b 389 104 390 102 389 104 b 337 51 389 104 366 80 l 285 -1 l 337 -54 l 389 -106 l 393 -101 b 421 -1 412 -72 421 -36 b 393 99 421 34 412 69 m 294 -98 b 242 -45 265 -69 242 -45 b 190 -98 242 -45 219 -69 l 138 -151 l 142 -154 b 242 -184 172 -174 206 -184 b 340 -154 276 -184 311 -174 l 345 -151 l 294 -98 "
        },
        v3c: {
            x_min: 0,
            x_max: 450.53125,
            ha: 460,
            o: "m 189 302 b 204 303 193 302 198 303 b 303 224 250 303 292 270 b 306 199 304 216 306 208 b 279 129 306 173 296 147 l 276 126 l 281 127 b 408 249 337 142 385 190 b 412 259 409 254 412 258 b 430 267 417 265 423 267 b 450 247 441 267 450 259 b 200 -605 450 242 204 -599 b 182 -616 197 -612 190 -616 b 163 -602 174 -616 166 -610 b 161 -598 161 -601 161 -601 b 217 -402 161 -589 170 -562 b 272 -213 247 -298 272 -213 b 272 -213 272 -213 272 -213 b 264 -219 272 -213 268 -216 b 140 -262 227 -247 182 -262 b 36 -226 102 -262 65 -249 b 0 -145 12 -206 0 -176 b 17 -84 0 -124 5 -104 b 103 -38 38 -54 70 -38 b 191 -91 137 -38 172 -56 b 205 -141 201 -106 205 -124 b 178 -212 205 -167 196 -194 l 175 -215 l 182 -213 b 307 -93 236 -198 284 -151 b 372 129 308 -88 372 127 b 372 129 372 129 372 129 b 364 122 372 129 368 126 b 240 80 328 94 283 80 b 137 115 202 80 166 91 b 99 194 111 136 99 165 b 189 302 99 244 133 292 "
        },
        v3e: {
            x_min: 0,
            x_max: 406.96875,
            ha: 415,
            o: "m 21 183 b 28 183 24 183 25 183 b 42 181 34 183 39 183 b 127 108 47 179 47 179 b 202 41 168 72 202 41 b 279 108 204 41 238 72 b 357 177 321 145 356 176 b 375 183 363 181 370 183 b 406 151 392 183 406 169 b 404 137 406 147 405 141 b 322 62 401 131 398 129 b 251 0 284 27 251 0 b 322 -63 251 -1 284 -29 b 404 -138 398 -130 401 -133 b 406 -152 405 -142 406 -148 b 375 -184 406 -170 392 -184 b 357 -179 370 -184 363 -183 b 279 -109 356 -177 321 -147 b 202 -43 238 -73 204 -43 b 127 -109 202 -43 168 -73 b 49 -179 85 -147 50 -177 b 31 -184 43 -183 36 -184 b 0 -152 13 -184 0 -170 b 2 -138 0 -148 0 -142 b 83 -63 5 -133 8 -130 b 155 0 122 -29 155 -1 b 83 62 155 0 122 27 b 8 129 43 97 10 127 b 0 151 2 136 0 144 b 21 183 0 165 8 177 "
        },
        v3f: {
            x_min: -24.5,
            x_max: 317.140625,
            ha: 324,
            o: "m -24 -147 l -24 -5 l -20 -5 b -1 -19 -12 -5 -4 -11 b 58 -123 6 -43 31 -86 b 196 -278 93 -173 134 -219 b 317 -570 274 -356 317 -460 b 294 -713 317 -617 308 -666 l 289 -724 l 294 -735 b 317 -873 308 -780 317 -827 b 235 -1132 317 -963 288 -1054 b 209 -1165 228 -1140 224 -1146 b 189 -1177 204 -1172 196 -1177 b 171 -1164 182 -1177 175 -1172 b 168 -1154 170 -1161 168 -1159 b 181 -1132 168 -1149 172 -1142 b 269 -891 238 -1064 269 -975 b 269 -881 269 -886 269 -884 b 262 -814 269 -857 265 -827 b 258 -800 261 -811 259 -806 b 142 -628 240 -731 198 -667 b -8 -589 112 -606 47 -589 b -20 -589 -13 -589 -19 -589 l -24 -589 l -24 -449 l -24 -308 l -20 -308 b -1 -322 -12 -308 -4 -313 b 58 -424 6 -345 31 -388 b 194 -580 93 -476 136 -523 b 259 -660 221 -606 245 -635 b 261 -663 259 -662 261 -663 b 264 -656 262 -663 262 -660 b 269 -587 268 -632 269 -610 b 264 -521 269 -566 268 -544 b 262 -512 264 -517 262 -513 b 258 -498 261 -509 259 -503 b 142 -326 240 -428 198 -365 b -8 -287 112 -303 47 -288 b -20 -287 -13 -287 -19 -287 l -24 -287 l -24 -147 "
        },
        v40: {
            x_min: -1.359375,
            x_max: 436.921875,
            ha: 446,
            o: "m 213 205 b 217 205 215 205 216 205 b 234 194 224 205 234 199 b 236 187 234 194 235 190 l 245 167 l 261 129 l 270 106 b 355 -61 294 54 329 -13 b 420 -163 381 -105 402 -138 b 436 -188 435 -184 436 -184 b 436 -191 436 -190 436 -190 b 421 -206 436 -201 431 -206 l 421 -206 l 416 -206 l 405 -201 b 217 -158 347 -172 283 -158 b 31 -201 153 -158 88 -172 l 20 -206 l 14 -206 l 14 -206 b 0 -191 5 -206 0 -201 b -1 -188 0 -190 -1 -190 b 14 -163 -1 -186 0 -184 b 95 -34 36 -136 72 -77 b 166 106 119 8 148 68 l 175 129 l 183 148 l 200 188 b 213 205 205 199 208 202 "
        },
        v41: {
            x_min: -1.359375,
            x_max: 556.6875,
            ha: 568,
            o: "m 294 322 b 318 323 299 322 308 323 b 360 320 334 323 352 322 b 526 217 430 310 490 273 b 543 166 537 202 543 184 b 447 70 543 117 503 70 b 445 70 447 70 446 70 b 359 159 394 72 359 113 b 368 201 359 173 362 187 b 442 245 382 229 412 245 b 455 244 446 245 451 245 b 460 244 458 244 460 244 b 460 244 460 244 460 244 b 454 248 460 244 458 245 b 325 291 417 276 372 291 b 285 287 313 291 299 290 b 144 -2 183 269 144 190 b 281 -290 144 -208 179 -280 b 304 -291 289 -291 298 -291 b 524 -105 412 -291 506 -212 b 541 -84 526 -88 530 -84 b 556 -101 551 -84 556 -90 b 549 -138 556 -111 553 -122 b 334 -322 521 -237 435 -310 b 302 -324 323 -323 313 -324 b 13 -101 172 -324 54 -234 b -1 -1 4 -68 -1 -34 b 294 322 -1 161 121 303 "
        },
        v42: {
            x_min: -348.4375,
            x_max: 24.5,
            ha: 25,
            o: "m -330 155 b -322 156 -329 156 -326 156 b -315 156 -319 156 -317 156 b -298 147 -311 155 -308 154 b -19 30 -224 98 -122 55 l 2 26 b 24 -1 17 22 24 13 b 2 -27 24 -15 17 -23 l -19 -31 b -298 -148 -122 -56 -224 -99 b -322 -158 -313 -158 -315 -158 b -348 -131 -338 -158 -348 -145 b -344 -117 -348 -127 -347 -122 b -328 -104 -341 -112 -338 -111 b -127 -8 -269 -65 -202 -33 b -106 0 -115 -4 -106 -1 b -127 6 -106 0 -115 2 b -328 102 -202 31 -269 63 b -344 116 -338 109 -341 111 b -348 130 -347 120 -348 124 b -330 155 -348 141 -341 152 "
        },
        v43: {
            x_min: -442.359375,
            x_max: 441,
            ha: 450,
            o: "m -31 487 b -1 488 -21 488 -10 488 b 434 104 216 488 397 330 b 441 27 438 79 441 47 b 439 12 441 20 439 15 b 419 0 435 4 427 0 b 404 5 413 0 408 1 b 398 30 400 11 398 13 b 0 351 390 213 213 351 b -59 348 -20 351 -39 349 b -400 30 -251 324 -393 191 b -405 5 -400 13 -401 11 b -420 0 -409 1 -415 0 b -441 12 -428 0 -436 4 b -442 27 -441 15 -442 20 b -435 104 -442 47 -439 79 b -31 487 -401 316 -235 474 m -13 131 b -1 133 -9 133 -5 133 b 51 105 19 133 39 123 b 61 70 58 95 61 83 b 51 34 61 58 58 45 b -1 6 39 16 19 6 b -46 27 -17 6 -34 13 b -62 69 -57 38 -62 54 b -13 131 -62 98 -44 124 "
        },
        v44: {
            x_min: -21.78125,
            x_max: 251.8125,
            ha: 257,
            o: "m -8 631 b -1 632 -6 632 -4 632 b 19 620 8 632 16 628 b 20 383 20 616 20 616 l 20 148 l 21 151 b 137 199 59 183 99 199 b 182 191 152 199 167 197 b 251 84 227 176 251 134 b 228 0 251 58 243 29 b 100 -142 206 -40 178 -72 l 23 -215 b 0 -229 9 -229 6 -229 b -20 -216 -9 -229 -17 -224 l -21 -212 l -21 201 l -21 616 l -20 620 b -8 631 -17 624 -13 630 m 110 131 b 96 133 106 133 100 133 b 89 133 93 133 91 133 b 24 87 63 129 40 113 l 20 80 l 20 -37 l 20 -156 l 23 -152 b 144 81 96 -72 144 20 l 144 83 b 110 131 144 113 134 126 "
        },
        v45: {
            x_min: -402.890625,
            x_max: 401.53125,
            ha: 410,
            o: "m -10 273 b -4 274 -9 273 -6 274 b 16 262 4 274 12 269 b 17 158 17 259 17 259 l 17 56 l 62 112 b 117 174 110 172 110 172 b 122 174 118 174 119 174 b 132 173 125 174 129 173 b 295 11 134 172 171 134 l 307 -1 l 336 34 b 374 76 366 72 368 74 b 381 77 375 77 378 77 b 401 56 392 77 401 68 b 400 48 401 54 401 51 b 223 -172 397 41 230 -166 b 210 -176 220 -174 215 -176 b 201 -174 206 -176 204 -176 b 112 -87 198 -173 178 -152 b 27 0 65 -38 27 0 b 21 -6 27 0 24 -2 l 17 -12 l 17 -147 b 17 -210 17 -173 17 -194 b 10 -292 17 -297 16 -287 b -2 -299 6 -297 2 -299 b -21 -287 -10 -299 -19 -295 b -24 -174 -23 -284 -23 -284 l -24 -63 l -66 -117 b -121 -176 -110 -170 -114 -176 b -125 -176 -122 -176 -123 -176 b -296 -12 -134 -174 -125 -184 l -308 0 l -337 -34 b -375 -77 -367 -73 -370 -76 b -382 -79 -377 -79 -379 -79 b -402 -58 -393 -79 -402 -69 b -401 -49 -402 -55 -402 -52 b -224 170 -398 -43 -231 165 b -212 174 -221 173 -216 174 b -202 173 -208 174 -205 174 b -39 11 -200 172 -151 122 l -28 -1 l -25 1 l -24 4 l -24 130 b -23 260 -24 256 -24 258 b -10 273 -20 266 -16 270 "
        },
        v46: {
            x_min: 0,
            x_max: 627.46875,
            ha: 640,
            o: "m 306 190 b 314 191 308 191 311 191 b 326 184 318 191 322 190 l 336 173 b 510 52 377 127 442 80 b 515 49 513 51 515 49 b 611 16 537 40 579 24 b 627 0 624 13 627 9 b 607 -18 627 -11 624 -13 b 330 -181 490 -49 389 -109 b 314 -192 323 -190 319 -192 b 306 -191 311 -192 308 -192 b 294 -177 302 -188 302 -188 b 257 -140 287 -170 265 -148 b 19 -18 193 -84 114 -44 b 0 0 2 -13 0 -11 b 16 16 0 9 2 13 b 110 49 47 24 89 40 b 117 52 111 49 114 51 b 145 65 126 56 130 58 b 281 163 200 93 245 124 b 300 186 288 170 291 174 b 306 190 300 187 303 188 m 317 137 b 313 142 315 141 314 142 b 308 137 313 142 311 141 b 161 4 276 84 220 33 b 155 0 159 1 155 0 b 163 -4 155 0 159 -2 b 308 -138 220 -34 276 -84 b 313 -142 311 -141 313 -142 b 317 -138 314 -142 315 -141 b 464 -4 351 -84 406 -34 b 470 0 468 -2 470 0 b 464 4 470 0 468 1 b 317 137 406 33 351 84 "
        },
        v47: {
            x_min: -24.5,
            x_max: 315.78125,
            ha: 322,
            o: "m -24 -145 l -24 -5 l -20 -5 b 1 -26 -10 -5 -6 -9 b 175 -241 31 -86 96 -166 b 314 -548 259 -323 304 -420 b 315 -589 315 -555 315 -571 b 314 -630 315 -606 315 -623 b 298 -730 311 -664 306 -699 l 295 -742 l 296 -748 b 314 -850 304 -778 311 -813 b 315 -892 315 -857 315 -874 b 314 -932 315 -909 315 -925 b 298 -1032 311 -967 306 -1002 l 295 -1045 l 296 -1050 b 314 -1153 304 -1081 311 -1115 b 315 -1193 315 -1160 315 -1177 b 314 -1235 315 -1211 315 -1228 b 217 -1526 306 -1338 270 -1444 b 201 -1533 213 -1532 208 -1533 b 182 -1522 193 -1533 185 -1529 b 179 -1514 181 -1518 179 -1517 b 189 -1489 179 -1508 182 -1501 b 266 -1217 240 -1403 266 -1308 b 262 -1156 266 -1196 265 -1177 b 110 -907 247 -1043 190 -950 b 0 -889 87 -895 50 -889 l -1 -889 l -24 -889 l -24 -749 l -24 -610 l -20 -610 b 1 -631 -10 -610 -6 -614 b 175 -846 31 -691 96 -771 b 259 -956 213 -884 236 -914 b 265 -966 262 -961 264 -966 b 265 -966 265 -966 265 -966 b 265 -953 265 -964 265 -959 b 266 -920 266 -943 266 -932 b 262 -853 266 -898 265 -873 b 110 -605 247 -741 190 -648 b 0 -587 87 -592 50 -587 l -1 -587 l -24 -587 l -24 -448 l -24 -308 l -20 -308 b 1 -328 -10 -308 -6 -312 b 175 -544 31 -388 96 -469 b 259 -655 213 -581 236 -612 b 265 -663 262 -659 264 -663 b 265 -663 265 -663 265 -663 b 265 -650 265 -663 265 -657 b 266 -617 266 -641 266 -630 b 262 -551 266 -595 265 -570 b 110 -303 247 -438 190 -345 b 0 -284 87 -290 50 -284 l -1 -284 l -24 -284 l -24 -145 "
        },
        v49: {
            x_min: 0,
            x_max: 630.203125,
            ha: 643,
            o: "m 308 204 b 314 205 310 205 313 205 b 326 201 319 205 323 204 b 355 154 328 199 338 180 b 401 83 362 142 392 95 l 409 72 b 431 41 412 66 424 49 b 619 -174 498 -51 570 -134 b 630 -192 626 -180 630 -186 b 626 -202 630 -195 628 -199 b 616 -206 623 -205 620 -206 b 552 -188 608 -206 592 -202 b 310 -155 488 -169 392 -155 b 268 -156 295 -155 281 -155 b 77 -188 197 -161 126 -173 b 13 -206 35 -202 20 -206 b 9 -206 12 -206 10 -206 b 0 -191 2 -202 0 -197 b 8 -176 0 -186 2 -180 b 204 49 58 -136 138 -43 l 220 72 l 227 83 b 295 188 245 108 281 166 b 308 204 299 197 304 202 m 315 147 b 314 147 315 147 314 147 b 314 147 314 147 314 147 b 306 129 314 145 310 138 l 296 105 b 281 72 292 97 284 77 l 274 56 b 181 -123 247 -4 212 -72 l 174 -134 l 176 -133 b 314 -123 215 -127 272 -123 b 451 -133 356 -123 413 -127 l 454 -134 l 449 -123 b 353 56 417 -72 381 -4 l 347 72 b 332 105 344 77 336 97 l 322 129 b 315 147 318 138 315 145 "
        },
        v4a: {
            x_min: 70.78125,
            x_max: 378.390625,
            ha: 315,
            o: "m 246 373 b 254 373 249 373 251 373 b 372 324 303 373 360 351 b 378 302 377 317 378 309 b 338 251 378 278 362 255 b 328 249 334 249 332 249 b 283 294 303 249 283 270 b 288 315 283 301 284 308 b 289 319 289 317 289 319 b 289 319 289 319 289 319 b 283 320 289 320 287 320 b 270 322 279 322 274 322 b 206 288 242 322 215 308 b 206 283 206 287 206 285 b 257 223 206 267 230 238 b 284 206 272 213 277 210 b 351 90 328 173 351 130 b 340 47 351 74 348 59 b 205 -30 314 -2 264 -30 b 182 -29 198 -30 190 -30 b 84 15 147 -24 103 -5 b 70 48 74 24 70 36 b 108 99 70 70 85 94 b 121 102 112 101 117 102 b 167 56 147 102 167 80 b 159 31 167 48 164 40 l 156 26 l 157 26 b 190 20 167 22 178 20 b 220 26 201 20 212 22 b 258 65 243 34 258 51 b 257 70 258 66 258 69 b 204 126 249 94 234 109 b 114 258 148 158 114 209 b 125 302 114 273 118 288 b 246 373 147 342 193 370 "
        },
        v4d: {
            x_min: -311.6875,
            x_max: 310.328125,
            ha: 317,
            o: "m -9 388 b -2 390 -8 390 -5 390 b 5 388 1 390 4 390 b 19 378 10 387 16 383 b 23 333 23 371 23 371 b 24 298 23 299 24 298 b 81 276 34 298 65 285 b 213 91 145 240 190 177 b 224 24 217 76 224 36 b 257 24 224 24 235 24 b 299 19 292 24 292 24 b 310 -1 306 15 310 6 b 299 -23 310 -11 306 -19 b 257 -27 292 -27 292 -27 b 224 -29 235 -27 224 -29 b 213 -95 224 -40 217 -80 b 81 -280 190 -181 145 -244 b 24 -301 65 -290 34 -301 b 23 -335 24 -301 23 -303 l 23 -340 b 17 -381 23 -374 23 -374 b -1 -391 13 -388 5 -391 b -21 -381 -9 -391 -17 -388 b -27 -340 -27 -374 -27 -374 l -27 -335 b -28 -301 -27 -303 -27 -301 b -85 -280 -38 -301 -69 -290 b -217 -95 -149 -244 -194 -181 b -228 -29 -221 -80 -228 -40 b -259 -27 -228 -29 -238 -27 b -300 -23 -294 -27 -294 -27 b -311 -2 -307 -19 -311 -11 b -294 23 -311 8 -304 19 b -259 24 -291 23 -284 24 b -228 24 -239 24 -228 24 b -217 91 -228 36 -221 76 b -85 276 -194 177 -149 240 b -28 298 -69 285 -38 298 b -27 333 -27 298 -27 299 b -27 371 -27 362 -27 369 b -9 388 -24 378 -17 385 m -27 136 b -28 247 -27 197 -28 247 b -61 216 -31 247 -53 226 b -123 33 -95 172 -121 98 l -125 24 l -76 24 l -27 24 l -27 136 m 29 242 b 24 247 27 245 24 247 b 23 136 24 247 23 197 l 23 24 l 72 24 l 121 24 l 119 33 b 29 242 115 116 77 206 m -27 -140 l -27 -27 l -76 -27 l -125 -27 l -123 -36 b -61 -220 -121 -102 -95 -176 b -28 -251 -53 -230 -31 -251 b -27 -140 -28 -251 -27 -201 m 119 -36 l 121 -27 l 72 -27 l 23 -27 l 23 -140 b 24 -251 23 -201 24 -251 b 57 -220 27 -251 49 -230 b 119 -36 91 -176 117 -102 "
        },
        v4e: {
            x_min: 0,
            x_max: 239.5625,
            ha: 244,
            o: "m 10 460 b 20 462 13 462 14 462 b 39 449 28 462 35 458 l 40 446 l 40 326 b 40 205 40 259 40 205 b 127 227 40 205 80 215 b 220 249 196 244 213 249 b 227 247 224 249 225 248 b 238 237 231 245 235 241 l 239 233 l 239 -106 l 239 -448 l 238 -451 b 219 -463 234 -459 225 -463 b 198 -451 210 -463 202 -459 l 197 -448 l 197 -324 b 197 -201 197 -248 197 -201 b 110 -223 196 -201 157 -210 b 17 -245 42 -240 24 -245 b 10 -242 13 -245 13 -244 b 0 -233 6 -241 2 -237 l 0 -230 l 0 108 l 0 446 l 0 449 b 10 460 2 453 6 458 m 197 22 b 197 70 197 41 197 58 b 196 116 197 113 197 116 l 196 116 b 118 97 196 116 160 106 l 40 77 l 40 -18 b 40 -112 40 -69 40 -112 l 119 -93 l 197 -73 l 197 22 "
        },
        v52: {
            x_min: -10.890625,
            x_max: 298.078125,
            ha: 294,
            o: "m 138 473 b 142 474 140 473 141 474 b 164 459 148 474 153 470 b 191 402 183 442 191 423 b 181 353 191 388 187 371 b 178 349 179 352 178 349 b 179 348 178 348 179 348 b 185 349 181 348 182 348 b 255 376 210 355 234 363 b 272 381 264 381 266 381 b 298 355 287 381 298 370 b 288 330 298 348 298 345 b 171 34 238 254 194 141 b 166 13 168 16 168 16 b 144 1 161 5 152 1 b 121 15 134 1 125 5 b 115 33 119 18 117 24 b 0 330 91 145 49 252 b -10 355 -9 345 -10 348 b 13 381 -10 371 0 381 b 31 376 19 381 25 380 b 132 345 61 358 103 345 l 136 345 l 137 355 b 145 378 138 359 142 370 b 152 415 149 394 152 405 b 137 452 152 427 148 438 b 133 464 134 458 133 460 b 138 473 133 467 134 470 "
        },
        v54: {
            x_min: -24.5,
            x_max: 317.140625,
            ha: 324,
            o: "m -24 -161 l -24 -5 l -20 -5 b 0 -24 -9 -5 -2 -12 b 171 -315 21 -124 84 -233 b 317 -660 268 -406 317 -531 b 187 -1014 317 -782 274 -909 b 161 -1034 172 -1034 171 -1034 b 141 -1013 149 -1034 141 -1025 b 152 -991 141 -1004 142 -1002 b 266 -682 228 -899 266 -788 b 174 -430 266 -588 236 -498 b -23 -317 136 -388 66 -348 b -24 -161 -23 -316 -24 -285 "
        },
        v55: {
            x_min: 0,
            x_max: 551.25,
            ha: 563,
            o: "m 289 644 b 304 645 294 645 299 645 b 404 566 349 645 392 613 b 406 541 405 557 406 549 b 379 471 406 514 397 489 l 377 467 l 382 470 b 509 591 438 485 485 531 b 513 601 510 595 513 599 b 530 609 518 607 524 609 b 551 588 540 609 551 602 b 200 -605 551 584 204 -599 b 182 -616 197 -612 190 -616 b 163 -602 174 -616 166 -610 b 161 -598 161 -601 161 -601 b 217 -402 161 -589 170 -562 b 272 -213 247 -298 272 -213 b 272 -213 272 -213 272 -213 b 264 -219 272 -213 268 -216 b 140 -262 227 -247 182 -262 b 36 -226 102 -262 65 -249 b 0 -145 12 -206 0 -176 b 17 -84 0 -124 5 -104 b 103 -38 38 -54 70 -38 b 191 -91 137 -38 172 -56 b 205 -141 201 -106 205 -124 b 178 -212 205 -167 196 -194 l 175 -215 l 182 -213 b 307 -93 236 -198 284 -151 b 372 129 308 -88 372 127 b 372 129 372 129 372 129 b 364 122 372 129 368 126 b 240 80 328 94 283 80 b 137 115 202 80 166 91 b 99 195 112 136 99 165 b 118 256 99 217 106 238 b 204 303 138 287 171 303 b 292 249 238 303 273 285 b 306 199 302 234 306 217 b 279 129 306 173 296 148 l 276 126 l 281 127 b 408 248 336 142 385 190 b 473 470 409 254 473 469 b 473 470 473 470 473 470 b 465 464 473 470 469 467 b 341 421 428 435 383 421 b 236 458 303 421 266 433 b 200 537 212 478 200 508 b 289 644 200 585 234 635 "
        },
        v58: {
            x_min: -21.78125,
            x_max: 367.5,
            ha: 375,
            o: "m 259 1553 b 265 1553 261 1553 264 1553 b 288 1540 272 1553 277 1550 b 367 1351 340 1493 367 1424 b 336 1221 367 1308 357 1263 l 332 1211 l 333 1208 b 367 1077 356 1170 367 1124 b 336 945 367 1032 357 986 l 332 935 l 333 932 b 367 800 356 893 367 848 b 336 669 367 756 357 710 l 332 659 l 333 656 b 367 523 356 617 367 571 b 345 412 367 485 360 446 b 231 273 322 356 284 310 b -1 19 121 195 27 93 b -17 4 -4 11 -10 5 l -21 4 l -21 134 l -21 265 l -17 265 b 133 291 20 265 96 278 b 318 537 245 328 318 433 b 307 603 318 559 315 582 b 303 614 304 612 304 614 b 298 609 302 614 300 613 b 231 549 281 589 258 567 b -1 295 121 471 27 369 b -17 280 -4 287 -10 281 l -21 280 l -21 410 l -21 541 l -17 541 b 133 567 20 541 96 555 b 318 813 245 605 318 709 b 307 880 318 835 315 859 b 303 891 304 888 304 891 b 298 885 302 891 300 888 b 231 825 281 866 258 843 b -1 571 121 748 27 645 b -17 556 -4 563 -10 557 l -21 556 l -21 687 l -21 817 l -17 817 b 133 843 20 817 96 830 b 318 1089 245 881 318 985 b 307 1156 318 1111 315 1134 b 303 1167 304 1164 304 1167 b 298 1161 302 1167 300 1164 b 231 1102 281 1140 258 1120 b -1 848 121 1024 27 921 b -17 832 -4 839 -10 834 l -21 832 l -21 963 l -21 1093 l -17 1093 b 114 1113 12 1093 78 1103 b 313 1314 215 1142 289 1218 b 318 1364 317 1331 318 1347 b 255 1511 318 1422 295 1478 b 243 1532 247 1519 243 1525 b 259 1553 243 1540 250 1550 "
        },
        v59: {
            x_min: 0,
            x_max: 464.140625,
            ha: 474,
            o: "m 0 0 l 0 347 l 76 347 l 153 347 l 153 0 l 153 -348 l 76 -348 l 0 -348 l 0 0 m 308 -1 l 308 347 l 386 347 l 464 347 l 464 -1 l 464 -348 l 386 -348 l 308 -348 l 308 -1 "
        },
        v5b: {
            x_min: -441,
            x_max: 439.640625,
            ha: 449,
            o: "m -428 -2 b -421 0 -427 -1 -424 0 b -406 -6 -416 0 -409 -2 b -400 -31 -401 -12 -400 -15 b -1 -352 -392 -215 -215 -352 b 58 -349 19 -352 38 -351 b 398 -31 250 -326 392 -192 b 404 -6 398 -15 400 -12 b 419 -1 408 -2 413 -1 b 439 -13 427 -1 435 -5 b 439 -29 439 -16 439 -22 b 434 -105 439 -48 438 -80 b 0 -489 397 -333 213 -489 b -68 -484 -23 -489 -44 -488 b -441 -36 -280 -452 -436 -263 b -441 -30 -441 -34 -441 -31 b -428 -2 -441 -11 -439 -5 m -13 -9 b -1 -8 -9 -8 -5 -8 b 50 -36 19 -8 39 -19 b 61 -72 57 -47 61 -59 b 50 -106 61 -84 57 -97 b -1 -134 39 -124 19 -134 b -46 -115 -17 -134 -34 -129 b -62 -72 -57 -102 -62 -87 b -13 -9 -62 -44 -44 -16 "
        },
        v5c: {
            x_min: 0,
            x_max: 447.8125,
            ha: 457,
            o: "m 0 -87 l 0 0 l 223 0 l 447 0 l 447 -87 l 447 -174 l 223 -174 l 0 -174 l 0 -87 "
        },
        v62: {
            x_min: 46.28125,
            x_max: 669.671875,
            ha: 563,
            o: "m 183 376 b 189 376 185 376 187 376 b 212 374 197 376 208 376 b 265 337 234 369 253 355 b 274 317 268 331 273 320 b 274 316 274 317 274 316 b 280 323 276 316 276 319 b 311 358 288 337 299 348 b 319 366 315 360 318 365 b 356 376 326 373 340 376 b 382 371 364 376 374 374 b 428 337 400 366 417 352 b 436 317 431 331 436 320 b 438 316 436 317 436 316 b 442 323 438 316 439 319 b 475 358 451 337 462 348 b 483 366 477 360 481 365 b 518 376 488 373 503 376 b 544 373 528 376 536 376 b 604 285 579 360 604 326 b 597 249 604 273 601 258 b 543 63 596 247 544 70 b 541 54 543 61 541 55 b 540 44 540 51 540 47 b 552 23 540 33 545 23 b 552 23 552 23 552 23 b 647 126 586 29 627 72 b 658 138 651 136 653 138 b 660 138 660 138 660 138 b 669 129 666 137 669 136 b 654 88 669 122 665 109 b 562 -12 631 43 602 9 l 549 -19 b 521 -27 540 -24 530 -27 b 447 30 490 -27 458 -4 b 443 58 445 38 443 48 b 450 93 443 72 446 84 b 504 278 453 97 504 272 b 507 288 506 283 506 287 b 509 298 507 292 509 295 b 491 326 509 310 502 320 b 487 327 490 327 488 327 b 479 324 484 327 483 326 b 441 270 462 316 443 288 b 435 249 441 265 436 254 b 398 127 434 248 419 195 b 362 4 379 61 362 5 b 328 -1 359 -1 362 -1 b 314 -1 323 -1 319 -1 b 302 -1 310 -1 306 -1 b 266 4 266 -1 269 -1 b 265 6 265 5 265 5 b 303 144 265 13 272 34 b 343 278 325 216 343 276 b 344 288 343 281 344 285 b 345 298 345 291 345 295 b 330 326 345 310 340 320 b 323 327 328 327 325 327 b 317 324 322 327 321 326 b 279 270 300 316 281 288 b 273 249 279 265 274 254 b 236 127 272 248 255 195 b 200 4 216 61 200 5 b 164 -1 197 -1 198 -1 b 151 -1 161 -1 156 -1 b 140 -1 147 -1 142 -1 b 103 4 104 -1 106 -1 b 103 6 103 5 103 5 b 141 144 103 13 108 34 b 181 278 161 216 179 276 b 182 288 181 281 181 285 b 183 298 182 291 183 295 b 168 324 183 310 178 320 b 160 327 166 326 163 327 b 141 320 156 327 151 324 b 69 230 112 305 85 272 b 57 215 65 217 62 215 b 55 215 57 215 55 215 b 46 224 49 215 46 217 b 59 260 46 231 50 242 b 151 363 81 306 112 341 b 161 369 155 365 160 367 b 183 376 166 371 174 374 "
        },
        v70: {
            x_min: 0,
            x_max: 436.921875,
            ha: 446,
            o: "m 213 190 b 217 191 215 191 216 191 b 231 184 223 191 228 188 b 249 154 240 167 246 159 b 419 18 292 91 348 45 b 436 -1 435 11 436 8 b 424 -16 436 -9 434 -13 b 308 -87 394 -26 340 -59 b 231 -186 276 -117 257 -142 b 219 -192 228 -191 225 -192 b 198 -174 209 -192 208 -191 b 47 -33 161 -113 110 -63 b 10 -16 34 -26 17 -19 b 0 -1 2 -13 0 -9 b 17 18 0 8 1 11 b 198 173 95 48 156 101 b 213 190 206 187 208 188 "
        },
        v72: {
            x_min: -423.3125,
            x_max: 421.9375,
            ha: 431,
            o: "m -262 197 b -247 197 -257 197 -253 197 b -118 162 -210 197 -163 184 b 40 45 -61 134 -13 98 b 277 -95 119 -33 200 -81 b 289 -97 281 -97 285 -97 b 378 0 332 -97 371 -55 b 378 11 378 4 378 6 b 302 83 378 55 345 83 b 242 66 283 83 262 77 b 208 56 231 59 219 56 b 148 120 175 56 148 81 b 201 186 148 151 164 172 b 261 198 220 194 240 198 b 420 45 341 198 411 136 b 421 22 421 37 421 29 b 245 -199 421 -93 338 -199 b 238 -198 243 -199 240 -199 b -44 -47 148 -194 50 -141 b -250 86 -114 22 -183 66 b -295 94 -270 91 -283 94 b -315 91 -302 94 -307 94 b -381 4 -356 81 -381 43 b -355 -56 -381 -18 -372 -40 b -298 -81 -338 -73 -319 -81 b -246 -68 -283 -81 -265 -77 b -212 -58 -234 -61 -223 -58 b -178 -69 -200 -58 -189 -62 b -151 -122 -160 -81 -151 -101 b -171 -167 -151 -138 -157 -155 b -239 -195 -185 -181 -213 -192 b -257 -197 -245 -197 -250 -197 b -423 -5 -352 -197 -423 -109 b -412 65 -423 16 -419 40 b -262 197 -389 137 -329 188 "
        },
        v74: {
            x_min: -206.890625,
            x_max: 428.75,
            ha: 438,
            o: "m 389 -351 b 394 -351 390 -351 393 -351 b 428 -385 413 -351 428 -367 b 428 -394 428 -388 428 -391 b 394 -428 426 -406 421 -410 l 332 -473 l 269 -516 l 205 -560 l 141 -603 l 77 -648 l 13 -692 l -50 -737 l -114 -780 l -145 -802 b -171 -813 -157 -810 -163 -813 b -175 -813 -172 -813 -174 -813 b -206 -777 -194 -811 -206 -795 b -202 -760 -206 -771 -205 -766 b -87 -675 -197 -752 -206 -757 l -34 -639 l 83 -557 l 145 -514 l 209 -470 l 272 -427 b 389 -351 375 -356 381 -352 "
        },
        v75: {
            x_min: -149.71875,
            x_max: 148.359375,
            ha: 151,
            o: "m -137 381 b -130 383 -134 383 -133 383 b -111 371 -122 383 -114 378 b -55 224 -110 370 -85 305 b 0 80 -25 145 -1 80 b 54 224 0 80 24 145 b 112 377 114 384 110 373 b 127 384 118 381 122 384 b 148 362 138 384 148 374 l 148 356 l 83 183 b 16 9 47 88 17 11 b -1 0 12 2 5 0 b -14 5 -5 0 -10 1 b -84 183 -19 9 -13 -6 l -149 356 l -149 362 b -137 381 -149 371 -145 378 "
        },
        v79: {
            x_min: -1.359375,
            x_max: 899.703125,
            ha: 918,
            o: "m 307 349 b 332 351 315 351 323 351 b 443 340 367 351 408 347 b 741 47 607 306 720 195 b 744 0 743 31 744 16 b 660 -303 744 -90 713 -206 b 28 -755 534 -531 304 -695 b 14 -756 23 -755 19 -756 b -1 -741 4 -756 -1 -750 b 21 -720 -1 -731 1 -728 b 567 -56 337 -601 548 -344 b 568 -11 568 -41 568 -24 b 442 285 568 129 525 233 b 325 319 406 308 367 319 b 93 177 232 319 137 266 b 84 154 91 170 84 155 b 84 154 84 154 84 154 b 88 156 84 154 85 155 b 159 177 110 170 134 177 b 257 134 194 177 231 162 b 294 41 281 108 294 73 b 171 -97 294 -24 246 -90 b 156 -98 166 -97 161 -98 b 6 74 73 -98 6 -22 b 6 80 6 76 6 79 b 307 349 10 223 141 340 m 839 215 b 845 216 841 216 842 216 b 862 213 852 216 860 215 b 899 163 887 206 899 184 b 872 117 899 145 890 127 b 847 111 865 112 856 111 b 808 130 833 111 818 117 b 796 162 800 140 796 151 b 839 215 796 187 812 212 m 839 -112 b 845 -112 841 -112 842 -112 b 862 -115 852 -112 860 -113 b 899 -165 887 -122 899 -144 b 872 -210 899 -183 890 -201 b 847 -217 865 -215 856 -217 b 808 -198 833 -217 818 -210 b 796 -165 800 -188 796 -177 b 839 -112 796 -140 812 -116 "
        },
        v7c: {
            x_min: 0,
            x_max: 300.8125,
            ha: 307,
            o: "m 49 505 b 53 506 50 505 51 506 b 70 496 58 506 62 503 b 81 485 73 492 78 488 l 96 473 l 111 459 l 122 449 l 134 438 l 182 396 l 255 330 b 292 291 292 298 292 298 l 292 290 l 292 284 l 283 270 b 209 36 234 197 209 113 b 288 -170 209 -44 235 -119 b 299 -184 295 -179 299 -181 b 300 -191 300 -187 300 -188 b 285 -206 300 -199 294 -206 b 280 -206 283 -206 281 -206 b 247 -201 270 -202 259 -201 b 176 -222 223 -201 197 -208 b 114 -340 136 -249 114 -292 b 172 -471 114 -384 134 -433 b 185 -492 182 -481 185 -487 b 181 -502 185 -496 183 -499 b 171 -508 176 -505 174 -508 b 152 -498 166 -508 160 -503 b 0 -284 65 -428 12 -352 b 0 -260 0 -278 0 -270 b 1 -238 0 -252 0 -242 b 148 -140 16 -177 73 -140 b 209 -148 167 -140 189 -142 b 215 -149 212 -148 215 -149 b 215 -149 215 -149 215 -149 l 215 -149 b 201 -136 215 -148 209 -142 l 157 -97 l 96 -41 b 17 34 21 24 17 29 b 17 37 17 36 17 36 b 17 38 17 37 17 38 b 25 56 17 44 17 44 b 110 298 81 131 110 219 b 46 474 110 367 88 431 b 38 491 40 480 38 487 b 49 505 38 498 42 502 "
        },
        v7d: {
            x_min: -1.359375,
            x_max: 436.921875,
            ha: 446,
            o: "m 213 205 b 217 205 215 205 216 205 b 234 194 224 205 234 199 b 236 187 234 194 235 190 l 245 167 l 261 129 l 270 106 b 355 -61 294 54 329 -13 b 420 -163 381 -105 402 -138 b 436 -188 435 -184 436 -184 b 436 -191 436 -190 436 -190 b 421 -206 436 -201 431 -206 l 421 -206 l 416 -206 l 405 -201 b 217 -158 347 -172 283 -158 b 31 -201 153 -158 88 -172 l 20 -206 l 14 -206 l 14 -206 b 0 -191 5 -206 0 -201 b -1 -188 0 -190 -1 -190 b 14 -163 -1 -186 0 -184 b 95 -34 36 -136 72 -77 b 166 106 119 8 148 68 l 175 129 l 183 148 l 200 188 b 213 205 205 199 208 202 "
        },
        v7f: {
            x_min: 0,
            x_max: 367.5,
            ha: 375,
            o: "m 0 124 l 0 187 l 61 187 l 122 187 l 122 138 l 122 91 l 153 61 l 183 30 l 213 61 l 243 91 l 243 138 l 243 187 l 306 187 l 367 187 l 367 124 l 367 61 l 321 61 l 274 61 l 243 30 l 213 0 l 243 -31 l 274 -62 l 321 -62 l 367 -62 l 367 -124 l 367 -188 l 306 -188 l 243 -188 l 243 -140 l 243 -93 l 213 -62 l 183 -31 l 153 -62 l 122 -93 l 122 -140 l 122 -188 l 61 -188 l 0 -188 l 0 -124 l 0 -62 l 46 -62 l 92 -62 l 123 -31 l 153 0 l 123 30 l 92 61 l 46 61 l 0 61 l 0 124 "
        },
        v80: {
            x_min: 29.9375,
            x_max: 420.578125,
            ha: 371,
            o: "m 115 345 b 221 347 117 345 166 347 b 411 345 306 347 409 345 b 420 330 416 342 420 335 b 415 319 420 326 419 321 b 178 118 397 303 179 118 b 178 117 178 118 178 117 b 181 117 178 117 178 117 b 189 117 182 117 185 117 b 193 117 190 117 191 117 b 247 98 215 117 232 111 b 296 75 266 83 280 76 b 302 75 299 75 300 75 b 322 91 311 75 315 79 b 322 91 322 91 322 91 b 322 91 322 91 322 91 b 319 91 322 91 321 91 b 313 90 318 90 315 90 b 283 107 300 90 288 97 b 277 126 279 114 277 121 b 319 167 277 149 295 167 b 319 167 319 167 319 167 b 362 118 347 167 362 147 b 355 82 362 108 359 96 b 311 33 349 65 340 55 b 224 1 284 12 253 1 b 194 5 213 1 204 2 b 168 18 183 8 178 11 b 110 36 151 30 130 36 b 57 15 88 36 68 29 b 47 11 54 12 51 11 b 31 20 40 11 34 13 b 29 26 31 22 29 25 b 68 66 29 36 39 45 b 285 250 73 71 281 248 b 285 250 285 250 285 250 b 231 252 285 252 261 252 b 137 250 190 252 141 250 b 93 227 122 248 110 241 b 78 220 88 222 83 220 b 66 227 74 220 70 222 b 63 234 65 229 63 231 b 85 291 63 241 69 252 b 115 345 108 342 108 344 "
        },
        v81: {
            x_min: 0,
            x_max: 428.75,
            ha: 438,
            o: "m 262 186 b 273 186 266 186 272 186 b 274 186 273 186 274 186 b 285 186 274 186 280 186 b 428 48 375 181 428 122 b 386 -68 428 12 416 -29 b 155 -187 329 -145 236 -187 b 12 -111 92 -187 38 -162 b 0 -51 4 -91 0 -72 b 262 186 0 58 122 179 m 366 131 b 352 134 362 133 357 134 b 219 81 321 134 269 115 b 47 -111 126 23 50 -62 b 47 -112 47 -111 47 -112 b 77 -136 47 -129 58 -136 b 264 -45 118 -136 194 -101 b 382 109 336 12 382 76 b 366 131 382 120 377 129 "
        },
        v83: {
            x_min: -1.359375,
            x_max: 847.96875,
            ha: 865,
            o: "m 488 1499 b 495 1500 490 1500 492 1500 b 541 1465 507 1500 521 1490 b 679 1078 622 1372 679 1210 b 677 1050 679 1068 677 1060 b 477 642 668 893 604 764 l 443 609 l 431 596 l 431 592 l 438 562 l 449 508 l 460 458 b 481 355 475 390 481 355 b 481 355 481 355 481 355 b 490 356 481 355 485 355 b 528 358 495 356 511 358 b 558 356 540 358 552 356 b 839 95 699 338 808 237 b 847 22 845 72 847 47 b 631 -303 847 -113 766 -242 b 620 -309 623 -308 620 -309 l 620 -310 b 631 -359 620 -310 626 -333 l 646 -435 l 660 -496 b 672 -588 668 -535 672 -563 b 664 -653 672 -610 669 -630 b 383 -875 630 -792 509 -875 b 201 -810 321 -875 257 -855 b 129 -680 151 -768 129 -730 b 274 -530 129 -592 200 -530 b 351 -553 300 -530 326 -538 b 412 -669 393 -582 412 -626 b 287 -805 412 -735 366 -800 l 279 -805 l 285 -809 b 383 -830 318 -823 351 -830 b 586 -718 464 -830 540 -789 b 626 -584 612 -678 626 -631 b 619 -528 626 -566 623 -548 b 612 -495 619 -526 616 -510 b 577 -324 590 -387 577 -324 b 577 -324 577 -324 577 -324 b 568 -326 575 -324 571 -324 b 528 -334 558 -328 537 -333 b 465 -338 506 -337 485 -338 b 24 -11 269 -338 87 -206 b -1 145 8 41 -1 93 b 96 442 -1 249 32 351 b 322 714 166 541 236 626 l 352 745 l 345 782 l 332 843 l 315 921 b 303 984 310 950 304 978 b 295 1082 298 1017 295 1049 b 413 1426 295 1208 336 1329 b 488 1499 436 1456 477 1496 m 549 1301 b 541 1301 547 1301 544 1301 b 411 1207 500 1301 447 1263 b 355 1004 374 1152 355 1079 b 359 942 355 984 356 963 b 371 881 362 927 363 917 l 385 818 b 392 782 389 799 392 784 l 392 782 b 434 828 393 782 424 816 b 607 1165 534 941 594 1060 b 608 1193 608 1175 608 1183 b 597 1270 608 1224 604 1254 b 549 1301 589 1286 571 1299 m 398 528 b 393 555 396 542 393 553 b 392 555 393 555 393 555 b 317 470 390 555 347 505 b 190 298 266 408 212 334 b 127 70 148 227 127 148 b 155 -77 127 19 137 -30 b 468 -303 209 -216 333 -303 b 519 -299 484 -303 502 -302 b 568 -284 541 -295 568 -287 l 568 -284 b 563 -263 568 -284 566 -274 l 534 -120 l 511 -13 l 496 61 l 480 133 b 469 187 472 176 469 187 b 468 188 469 187 469 188 b 416 162 462 188 430 172 b 337 13 364 126 337 69 b 413 -124 337 -40 363 -93 b 428 -144 424 -131 428 -137 b 428 -149 428 -145 428 -148 b 409 -166 426 -161 419 -166 b 394 -162 405 -166 400 -165 b 240 77 302 -122 240 -27 l 240 77 b 430 342 240 197 315 301 l 436 344 l 426 394 l 398 528 m 548 194 b 526 195 540 195 532 195 b 519 195 524 195 521 195 l 514 195 l 518 177 l 539 79 l 552 15 l 566 -48 l 594 -187 l 605 -240 b 612 -266 609 -254 611 -266 b 612 -266 612 -266 612 -266 b 641 -248 613 -266 630 -256 b 744 -98 692 -212 730 -156 b 751 -40 749 -79 751 -59 b 548 194 751 76 665 181 "
        },
        v84: {
            x_min: 25.859375,
            x_max: 164.6875,
            ha: 168,
            o: "m 34 369 b 40 370 35 370 38 370 b 59 353 49 370 50 367 b 164 40 122 254 155 158 b 164 0 164 33 164 16 b 164 -40 164 -16 164 -34 b 59 -353 155 -158 122 -254 b 40 -371 53 -366 47 -371 b 34 -370 38 -371 36 -370 b 25 -358 28 -367 25 -363 b 31 -337 25 -352 27 -347 b 92 0 72 -234 92 -117 b 31 335 92 116 72 233 b 25 356 27 345 25 352 b 34 369 25 363 28 366 "
        },
        v8b: {
            x_min: 0,
            x_max: 319.859375,
            ha: 326,
            o: "m 149 508 b 159 509 152 509 155 509 b 186 494 170 509 181 503 b 190 440 190 487 190 488 l 190 430 l 190 377 l 242 377 l 251 377 b 303 373 298 377 296 377 b 319 345 314 367 319 356 b 304 319 319 335 314 324 b 250 315 296 315 299 315 l 242 315 l 190 315 l 190 262 l 190 252 b 186 198 190 204 190 205 b 159 183 179 188 170 183 b 132 198 148 183 138 188 b 127 252 127 205 127 204 l 127 262 l 127 315 l 76 315 l 68 315 b 14 319 20 315 21 315 b 0 347 4 324 0 335 b 14 373 0 356 4 367 b 68 377 21 377 20 377 l 76 377 l 127 377 l 127 430 l 127 440 b 132 494 127 488 127 487 b 149 508 136 501 142 505 "
        },
        v8c: {
            x_min: -330.75,
            x_max: 329.390625,
            ha: 336,
            o: "m -133 483 b -117 484 -127 484 -122 484 b 31 373 -51 484 9 440 b 35 348 34 365 35 356 b -25 285 35 313 10 285 b -87 331 -55 285 -76 302 b -167 402 -100 376 -133 402 b -191 398 -175 402 -183 401 b -227 341 -215 388 -227 369 b -225 320 -227 334 -227 327 b -13 74 -209 230 -125 133 b 6 65 -4 70 5 66 l 9 63 l 10 65 b 117 231 12 68 40 112 l 189 341 l 242 424 b 268 460 262 456 264 458 b 283 464 273 463 277 464 b 308 438 296 464 308 453 l 308 437 b 287 396 308 430 308 428 l 95 98 l 59 43 l 58 41 l 65 37 b 253 -156 151 -8 217 -77 b 281 -285 272 -199 281 -244 b 148 -481 281 -381 231 -463 b 115 -485 137 -484 126 -485 b -32 -376 51 -485 -9 -442 b -36 -349 -35 -366 -36 -358 b 25 -287 -36 -315 -12 -287 b 85 -333 54 -287 74 -302 b 166 -403 99 -377 133 -403 b 190 -399 174 -403 182 -402 b 225 -342 215 -390 225 -370 b 224 -322 225 -335 225 -328 b 12 -76 208 -231 125 -134 b -8 -66 2 -72 -6 -68 l -10 -65 l -12 -66 b -118 -231 -13 -68 -42 -113 l -190 -342 l -243 -426 b -269 -462 -264 -458 -265 -458 b -284 -466 -274 -464 -279 -466 b -310 -440 -298 -466 -310 -455 l -310 -438 b -288 -398 -310 -430 -308 -430 l -96 -99 l -59 -44 l -59 -43 l -66 -38 b -281 284 -198 33 -281 158 l -281 284 b -133 483 -281 392 -220 474 m 254 177 b 266 179 258 177 262 179 b 319 149 287 179 307 167 b 329 115 326 140 329 127 b 319 79 329 102 326 90 b 268 51 307 61 287 51 b 221 72 250 51 234 58 b 205 115 210 84 205 99 b 254 177 205 142 223 170 m -281 -54 b -269 -52 -277 -52 -273 -52 b -223 -73 -253 -52 -235 -59 b -206 -116 -212 -84 -206 -101 b -216 -151 -206 -129 -209 -141 b -269 -179 -228 -170 -249 -179 b -314 -159 -285 -179 -302 -173 b -330 -116 -325 -147 -330 -131 b -281 -54 -330 -88 -313 -61 "
        },
        v8f: {
            x_min: -21.78125,
            x_max: 362.0625,
            ha: 369,
            o: "m 302 1031 b 308 1032 304 1032 307 1032 b 330 1016 318 1032 325 1027 b 362 867 351 970 362 920 b 340 738 362 824 353 780 l 336 727 l 340 717 b 362 591 355 677 362 634 b 257 323 362 496 325 401 b 204 272 243 306 227 290 b 20 56 129 206 66 133 b -1 18 12 44 0 22 b -19 4 -4 9 -12 4 l -21 4 l -21 140 l -21 276 l -12 277 b 167 333 61 288 127 309 b 319 598 262 388 319 491 b 311 664 319 620 317 642 l 310 673 l 304 664 b 204 548 279 620 250 587 b 20 333 129 483 66 409 b -1 292 12 320 0 298 b -19 280 -4 285 -12 280 l -21 280 l -21 416 l -21 552 l -12 553 b 167 609 61 564 127 585 b 319 874 264 666 319 770 b 294 992 319 914 311 954 b 288 1011 288 1004 288 1007 b 302 1031 288 1021 294 1028 "
        },
        v92: {
            x_min: 0,
            x_max: 598.890625,
            ha: 611,
            o: "m 62 181 b 77 183 66 183 72 183 b 91 181 83 183 88 183 b 202 131 100 180 106 177 l 299 87 l 394 131 b 517 183 499 181 502 183 b 519 183 517 183 518 183 b 598 104 567 183 598 144 b 577 49 598 84 592 65 b 518 15 567 38 563 37 b 484 0 499 6 484 0 b 518 -16 484 -1 499 -8 b 577 -51 563 -38 567 -40 b 598 -105 592 -66 598 -86 b 519 -184 598 -145 567 -184 b 517 -184 518 -184 517 -184 b 394 -133 502 -184 499 -183 l 299 -88 l 202 -133 b 81 -184 99 -183 95 -184 b 77 -184 80 -184 78 -184 b 0 -105 29 -184 0 -145 b 20 -51 0 -86 5 -66 b 80 -16 29 -40 34 -38 b 114 -1 98 -8 114 -1 b 80 15 114 0 98 6 b 20 49 34 37 29 38 b 0 104 6 65 0 84 b 62 181 0 140 23 174 m 88 134 b 74 136 85 134 80 136 b 68 134 72 136 69 136 b 46 104 54 130 46 117 b 55 81 46 95 49 88 b 149 34 59 76 53 80 b 224 -1 190 15 224 0 b 144 -38 224 -1 187 -18 b 54 -84 59 -79 58 -79 b 46 -105 49 -90 46 -98 b 76 -137 46 -122 58 -137 b 78 -137 77 -137 77 -137 b 194 -86 87 -137 76 -141 b 298 -36 250 -58 298 -36 b 298 -36 298 -36 298 -36 b 402 -84 299 -36 345 -58 b 518 -137 522 -141 510 -137 b 521 -137 519 -137 519 -137 b 551 -105 539 -137 551 -122 b 541 -83 551 -98 548 -90 b 447 -36 537 -77 544 -81 b 374 -1 406 -16 374 -1 b 447 34 374 0 406 15 b 541 81 544 80 537 76 b 551 104 548 88 551 97 b 521 136 551 120 539 136 b 518 136 519 136 519 136 b 517 136 518 136 517 136 l 517 136 b 402 83 511 136 511 136 b 298 34 345 56 299 34 b 298 34 298 34 298 34 b 194 84 298 34 250 56 b 88 134 137 111 89 133 "
        },
        v93: {
            x_min: 0,
            x_max: 438.28125,
            ha: 447,
            o: "m 212 205 b 219 205 213 205 216 205 b 239 183 228 205 231 204 b 421 -163 298 40 363 -83 b 438 -191 434 -180 438 -186 b 436 -197 438 -192 438 -195 b 424 -206 434 -204 431 -206 b 406 -201 420 -206 415 -205 b 216 -156 347 -172 281 -156 b 23 -205 148 -156 80 -173 b 14 -206 20 -206 17 -206 b 0 -191 6 -206 0 -201 b 6 -176 0 -187 1 -183 b 202 192 63 -104 142 45 b 212 205 205 199 208 202 m 264 48 l 249 81 l 243 94 l 242 91 b 89 -126 208 36 137 -66 b 81 -138 85 -133 81 -138 b 81 -138 81 -138 81 -138 b 81 -138 81 -138 81 -138 b 95 -133 81 -138 87 -136 b 280 -94 156 -108 221 -94 b 334 -98 299 -94 317 -95 b 343 -99 338 -99 343 -99 b 343 -99 343 -99 343 -99 b 338 -94 343 -99 341 -97 b 264 48 318 -58 287 1 "
        },
        v94: {
            x_min: -149.71875,
            x_max: 148.359375,
            ha: 151,
            o: "m -9 215 b 0 217 -6 217 -4 217 b 19 205 8 217 14 213 b 20 142 20 202 20 201 l 20 84 l 23 84 b 144 -27 81 74 129 30 b 148 -66 147 -40 148 -54 b 36 -213 148 -134 103 -197 b 0 -219 24 -217 12 -219 b -145 -104 -68 -219 -129 -173 b -149 -68 -148 -91 -149 -79 b -24 84 -149 6 -98 74 l -21 84 l -21 142 b -19 205 -20 201 -20 202 b -9 215 -17 209 -13 213 m -21 -15 b -23 41 -21 37 -21 41 b -23 41 -23 41 -23 41 b -76 11 -35 40 -62 26 b -108 -65 -98 -11 -108 -38 b -1 -176 -108 -122 -65 -176 b 107 -65 63 -176 107 -122 b 74 11 107 -38 96 -11 b 20 41 61 26 32 41 b 20 -15 20 41 20 15 b 19 -74 20 -72 20 -72 b 0 -87 14 -83 6 -87 b -19 -74 -8 -87 -16 -83 b -21 -15 -20 -72 -20 -72 "
        },
        v95: {
            x_min: 0,
            x_max: 406.96875,
            ha: 415,
            o: "m 55 181 b 70 183 61 183 66 183 b 111 170 85 183 99 179 b 160 130 115 167 137 149 l 202 95 l 245 130 b 319 181 299 176 302 179 b 334 183 325 183 330 183 b 406 109 375 183 406 148 b 401 81 406 99 405 91 b 348 24 394 65 390 59 b 318 -1 332 11 318 0 b 348 -26 318 -1 332 -12 b 401 -83 390 -61 394 -66 b 406 -111 405 -93 406 -101 b 334 -184 406 -149 375 -184 b 319 -183 330 -184 325 -184 b 245 -131 302 -180 299 -177 l 202 -97 l 160 -131 b 85 -183 107 -177 103 -180 b 70 -184 80 -184 76 -184 b 0 -111 31 -184 0 -149 b 4 -83 0 -101 1 -93 b 58 -26 10 -66 16 -61 b 88 -1 74 -12 88 -1 b 58 24 88 0 74 11 b 10 69 23 54 17 59 b 0 109 2 81 0 95 b 55 181 0 142 21 173 m 83 133 b 72 136 78 136 76 136 b 57 131 66 136 61 134 b 46 109 49 126 46 117 b 50 93 46 104 47 98 b 107 45 51 91 77 70 b 160 0 137 20 160 0 b 107 -47 160 -1 137 -22 b 50 -94 77 -72 51 -93 b 46 -111 47 -99 46 -105 b 59 -134 46 -120 50 -130 b 72 -137 62 -136 68 -137 b 83 -136 76 -137 80 -136 b 144 -84 84 -134 107 -116 b 202 -36 176 -58 202 -36 b 261 -84 202 -36 230 -58 b 323 -136 299 -116 321 -134 b 334 -137 326 -136 330 -137 b 345 -134 338 -137 343 -136 b 360 -111 355 -130 360 -120 b 355 -94 360 -105 359 -99 b 299 -47 353 -93 329 -72 b 245 0 269 -22 245 -1 b 299 45 245 0 269 20 b 355 93 329 70 353 91 b 360 109 359 98 360 104 b 345 133 360 119 355 129 b 334 136 343 134 338 136 b 323 134 330 136 326 134 b 261 83 321 133 299 115 b 202 34 230 56 202 34 b 144 83 202 34 176 56 b 83 133 106 115 84 133 "
        },
        v97: {
            x_min: -228.671875,
            x_max: 227.3125,
            ha: 232,
            o: "m -217 487 l -213 488 l 0 488 l 212 488 l 216 487 b 225 476 220 484 224 480 l 227 473 l 227 244 l 227 15 l 225 12 b 206 0 223 4 215 0 b 197 1 204 0 200 0 b 187 12 193 4 189 6 l 186 15 l 186 138 l 186 262 l -1 262 l -187 262 l -187 138 l -187 15 l -189 12 b -208 0 -193 4 -200 0 b -227 12 -216 0 -223 4 l -228 15 l -228 244 l -228 473 l -227 476 b -217 487 -225 480 -221 484 "
        },
        v9a: {
            x_min: -21.78125,
            x_max: 367.5,
            ha: 375,
            o: "m 230 1031 b 238 1032 232 1032 235 1032 b 259 1014 245 1032 251 1027 b 367 662 330 906 367 782 b 364 602 367 641 367 621 b 232 317 352 488 304 384 b 57 120 155 245 103 187 b -1 18 31 84 6 40 b -19 4 -4 11 -12 4 l -21 4 l -21 159 l -21 315 l -16 315 b 96 335 10 315 62 324 b 315 695 227 380 315 527 b 313 738 315 709 314 724 b 224 991 304 825 273 916 b 216 1013 219 999 216 1007 b 230 1031 216 1021 220 1028 "
        },
        v9b: {
            x_min: -24.5,
            x_max: 313.0625,
            ha: 319,
            o: "m -24 -133 l -24 -5 l -20 -5 b -1 -19 -12 -5 -4 -11 b 142 -213 13 -61 74 -144 b 258 -376 196 -269 230 -315 b 313 -605 295 -449 313 -528 b 292 -742 313 -652 306 -699 b 288 -752 289 -748 288 -752 b 288 -752 288 -752 288 -752 b 292 -764 289 -753 291 -757 b 313 -907 306 -811 313 -860 b 292 -1045 313 -954 306 -1002 b 288 -1054 289 -1050 288 -1054 b 288 -1054 288 -1054 288 -1054 b 292 -1067 289 -1054 291 -1060 b 313 -1210 306 -1113 313 -1161 b 292 -1346 313 -1257 306 -1304 b 288 -1357 289 -1353 288 -1357 b 288 -1357 288 -1357 288 -1357 b 292 -1368 289 -1357 291 -1363 b 313 -1512 306 -1415 313 -1464 b 292 -1648 313 -1560 306 -1605 b 288 -1660 289 -1654 288 -1660 b 288 -1660 288 -1660 288 -1660 b 292 -1671 289 -1660 291 -1665 b 313 -1814 306 -1719 313 -1766 b 250 -2040 313 -1897 291 -1977 b 232 -2062 238 -2057 236 -2059 b 221 -2065 230 -2063 225 -2065 b 200 -2045 210 -2065 201 -2057 b 200 -2043 200 -2044 200 -2044 b 208 -2026 200 -2037 202 -2034 b 269 -1826 249 -1966 269 -1897 b 153 -1544 269 -1726 230 -1625 b -9 -1472 115 -1506 58 -1481 b -21 -1471 -14 -1471 -19 -1471 l -24 -1471 l -24 -1343 l -24 -1215 l -20 -1215 b -1 -1229 -12 -1215 -4 -1221 b 142 -1424 13 -1270 74 -1353 b 257 -1582 196 -1478 228 -1524 b 264 -1594 261 -1589 264 -1594 l 264 -1594 b 265 -1582 264 -1594 264 -1589 b 270 -1525 268 -1562 270 -1544 b 153 -1243 270 -1424 228 -1321 b -9 -1170 115 -1203 58 -1178 b -21 -1168 -14 -1170 -19 -1168 l -24 -1168 l -24 -1041 l -24 -913 l -20 -913 b -1 -927 -12 -913 -4 -918 b 142 -1121 13 -967 74 -1050 b 257 -1281 196 -1175 228 -1221 b 264 -1292 261 -1286 264 -1292 l 264 -1292 b 265 -1279 264 -1292 264 -1286 b 270 -1222 268 -1261 270 -1242 b 153 -941 270 -1121 228 -1018 b -9 -867 115 -900 58 -875 b -21 -866 -14 -867 -19 -866 l -24 -866 l -24 -738 l -24 -610 l -20 -610 b -1 -624 -12 -610 -4 -616 b 142 -818 13 -664 74 -749 b 257 -978 196 -873 228 -918 b 264 -989 261 -984 264 -989 l 264 -989 b 265 -977 264 -989 264 -984 b 270 -920 268 -959 270 -939 b 153 -638 270 -818 228 -716 b -9 -564 115 -598 58 -573 b -21 -563 -14 -564 -19 -563 l -24 -563 l -24 -435 l -24 -308 l -20 -308 b -1 -322 -12 -308 -4 -313 b 142 -516 13 -363 74 -446 b 257 -675 196 -571 228 -616 b 264 -687 261 -681 264 -687 l 264 -687 b 265 -674 264 -687 264 -681 b 270 -617 268 -656 270 -637 b 153 -335 270 -516 228 -413 b -9 -262 115 -295 58 -270 b -21 -260 -14 -262 -19 -260 l -24 -260 l -24 -133 "
        },
        v9c: {
            x_min: -166.0625,
            x_max: -25.859375,
            ha: 0,
            o: "m -49 369 b -42 370 -46 369 -44 370 b -27 360 -36 370 -29 366 b -25 355 -27 359 -25 358 b -32 335 -25 351 -28 347 b -92 52 -66 248 -87 159 b -93 -1 -93 43 -93 20 b -92 -54 -93 -23 -93 -45 b -32 -337 -85 -162 -66 -251 b -25 -355 -27 -349 -25 -352 b -42 -371 -25 -365 -32 -371 b -61 -353 -50 -371 -51 -369 b -163 -63 -119 -262 -153 -165 b -166 -1 -166 -37 -166 -31 b -163 62 -166 30 -166 36 b -61 352 -153 163 -119 260 b -49 369 -54 365 -51 366 "
        },
        va3: {
            x_min: 58.53125,
            x_max: 228.671875,
            ha: 294,
            o: "m 138 371 b 142 373 140 371 141 373 b 178 342 149 373 156 366 b 228 251 217 297 228 278 b 228 244 228 248 228 247 b 176 147 227 212 212 184 b 123 73 152 122 132 93 b 121 62 122 70 121 66 b 145 13 121 48 129 31 b 153 -2 151 6 153 1 b 149 -9 153 -5 152 -6 b 144 -11 148 -11 145 -11 b 129 -1 140 -11 136 -8 b 61 87 89 37 68 68 b 58 113 59 95 58 105 b 110 215 58 144 74 177 b 163 287 134 240 155 269 b 166 299 166 291 166 295 b 141 348 166 313 157 330 b 133 360 134 356 133 358 b 133 363 133 362 133 362 b 138 371 133 367 136 370 "
        },
        va5: {
            x_min: 0,
            x_max: 349.8125,
            ha: 357,
            o: "m 88 302 b 103 303 93 302 98 303 b 202 224 149 303 191 270 b 205 199 204 216 205 208 b 178 129 205 173 196 147 l 175 126 l 182 127 b 307 249 236 142 284 190 b 313 259 308 254 311 258 b 329 267 317 265 323 267 b 349 247 340 267 349 259 b 201 -263 349 242 204 -258 b 182 -273 197 -270 190 -273 b 163 -260 174 -273 166 -269 b 161 -256 161 -259 161 -258 b 217 -59 161 -248 170 -220 b 272 129 247 43 272 127 b 272 129 272 129 272 129 b 264 122 272 129 268 126 b 140 80 227 94 183 80 b 36 115 102 80 65 91 b 0 194 10 136 0 165 b 88 302 0 244 32 292 "
        },
        va9: {
            x_min: -24.5,
            x_max: 314.421875,
            ha: 321,
            o: "m -24 -145 l -24 -5 l -20 -5 b 0 -23 -9 -5 -2 -12 b 27 -87 4 -38 14 -66 b 138 -220 53 -136 88 -177 b 235 -328 179 -255 208 -288 b 314 -592 287 -409 314 -501 b 292 -732 314 -639 307 -687 l 289 -742 l 294 -756 b 314 -896 307 -802 314 -849 b 292 -1035 314 -943 307 -991 l 289 -1045 l 294 -1057 b 314 -1197 307 -1104 314 -1152 b 292 -1338 314 -1246 307 -1292 l 289 -1347 l 294 -1360 b 314 -1500 307 -1407 314 -1454 b 273 -1689 314 -1565 300 -1628 b 250 -1712 265 -1710 261 -1712 b 228 -1691 236 -1712 228 -1704 l 228 -1685 l 234 -1675 b 270 -1507 258 -1621 270 -1564 b 98 -1193 270 -1381 209 -1261 b 40 -1174 76 -1179 58 -1174 b -10 -1189 24 -1174 8 -1178 b -20 -1192 -14 -1192 -16 -1192 l -24 -1192 l -24 -1052 l -24 -913 l -20 -913 b 0 -931 -9 -913 -2 -920 b 27 -995 4 -946 14 -974 b 138 -1128 53 -1043 88 -1085 b 257 -1275 190 -1172 228 -1220 b 262 -1283 259 -1279 262 -1283 l 262 -1283 b 269 -1249 264 -1282 268 -1260 b 270 -1206 270 -1233 270 -1220 b 98 -891 270 -1075 206 -957 b 40 -871 76 -877 58 -871 b -10 -886 24 -871 8 -875 b -20 -889 -14 -889 -16 -889 l -24 -889 l -24 -749 l -24 -610 l -20 -610 b 0 -628 -9 -610 -2 -617 b 27 -692 4 -644 14 -671 b 138 -825 53 -741 88 -782 b 257 -973 190 -870 228 -917 b 262 -981 259 -977 262 -981 l 262 -981 b 269 -946 264 -979 268 -957 b 270 -903 270 -931 270 -917 b 98 -588 270 -774 206 -655 b 40 -569 76 -574 58 -569 b -10 -584 24 -569 8 -574 b -20 -587 -14 -587 -16 -587 l -24 -587 l -24 -448 l -24 -308 l -20 -308 b 0 -326 -9 -308 -2 -315 b 27 -390 4 -341 14 -369 b 138 -523 53 -438 88 -480 b 257 -670 190 -567 228 -614 b 262 -678 259 -674 262 -678 b 262 -678 262 -678 262 -678 b 269 -644 264 -677 268 -656 b 270 -601 270 -628 270 -614 b 98 -285 270 -471 206 -352 b 40 -266 76 -273 58 -266 b -10 -281 24 -266 8 -272 b -20 -284 -14 -284 -16 -284 l -24 -284 l -24 -145 "
        },
        vaa: {
            x_min: -1.359375,
            x_max: 752.703125,
            ha: 768,
            o: "m 490 985 b 504 986 495 986 500 986 b 604 907 551 986 593 954 b 607 884 607 900 607 892 b 581 813 607 857 597 831 l 578 810 l 583 811 b 710 932 638 827 687 873 b 714 943 711 936 713 942 b 730 952 720 949 725 952 b 752 931 741 952 752 943 b 200 -946 752 927 204 -941 b 182 -957 197 -953 190 -957 b 163 -945 174 -957 166 -953 b 161 -939 161 -942 161 -942 b 217 -743 161 -931 170 -904 b 272 -555 247 -639 272 -555 b 272 -555 272 -555 272 -555 b 264 -560 272 -555 268 -557 b 140 -603 227 -589 182 -603 b 36 -567 102 -603 65 -592 b -1 -487 12 -548 -1 -517 b 17 -427 -1 -466 5 -445 b 103 -380 38 -395 70 -380 b 191 -433 137 -380 172 -398 b 205 -484 201 -448 205 -466 b 178 -553 205 -509 196 -535 l 175 -557 l 182 -555 b 307 -435 236 -539 284 -494 b 372 -213 308 -430 372 -215 b 372 -213 372 -213 372 -213 b 364 -219 372 -213 368 -216 b 240 -262 328 -247 283 -262 b 137 -226 202 -262 166 -249 b 99 -145 112 -206 99 -176 b 118 -84 99 -124 106 -104 b 204 -38 138 -54 171 -38 b 292 -91 238 -38 273 -56 b 306 -141 302 -106 306 -124 b 279 -212 306 -167 296 -194 l 276 -215 l 281 -213 b 408 -93 336 -198 385 -151 b 473 129 409 -88 473 127 b 473 129 473 129 473 129 b 465 122 473 129 469 126 b 341 80 428 94 383 80 b 236 115 303 80 266 91 b 200 195 213 136 200 165 b 217 256 200 217 206 238 b 304 303 239 287 272 303 b 393 249 338 303 374 285 b 406 199 402 234 406 217 b 379 129 406 173 397 148 l 377 126 l 382 127 b 509 248 436 142 485 190 b 574 470 510 254 574 469 b 574 470 574 470 574 470 b 566 464 574 470 570 467 b 442 421 529 435 484 421 b 337 458 404 421 367 433 b 300 538 314 477 300 508 b 318 598 300 559 306 580 b 404 645 340 630 372 645 b 494 592 439 645 475 627 b 507 541 502 577 507 559 b 480 471 507 516 498 489 l 477 467 l 483 470 b 608 589 537 485 586 531 b 675 811 611 595 675 810 b 675 811 675 811 675 811 b 666 806 675 811 671 809 b 543 763 628 777 585 763 b 438 799 504 763 468 775 b 401 878 412 820 401 849 b 490 985 401 928 434 977 "
        },
        vad: {
            x_min: 0,
            x_max: 873.828125,
            ha: 892,
            o: "m 0 0 l 0 703 l 81 703 l 164 703 l 164 0 l 164 -705 l 81 -705 l 0 -705 l 0 0 m 225 0 l 225 703 l 246 703 l 268 703 l 268 366 l 268 30 l 274 36 b 314 79 284 44 302 63 b 413 302 357 137 392 213 b 432 327 419 324 421 327 b 449 306 443 327 447 322 b 611 115 457 195 529 115 b 651 122 624 115 638 117 b 728 316 705 140 724 188 b 729 388 728 342 729 366 b 671 635 729 533 711 602 b 581 662 649 652 616 662 b 477 637 545 662 510 653 l 475 635 l 477 634 b 503 627 488 632 495 631 b 545 556 532 612 545 584 b 491 480 545 524 526 491 b 465 474 481 476 473 474 b 379 563 417 474 379 516 b 389 602 379 576 382 588 b 541 691 409 641 479 681 b 582 694 555 692 568 694 b 865 462 714 694 834 598 b 873 392 871 440 873 416 b 865 317 873 367 871 341 b 639 84 839 194 748 101 b 612 83 630 83 620 83 b 511 116 577 83 543 94 b 504 120 509 119 506 120 b 504 120 504 120 504 120 b 469 59 504 120 488 93 l 432 -1 l 469 -61 b 504 -122 488 -94 504 -122 b 504 -122 504 -122 504 -122 b 511 -117 506 -122 509 -120 b 612 -84 543 -95 577 -84 b 665 -91 630 -84 647 -87 b 869 -338 771 -122 850 -216 b 873 -392 872 -356 873 -374 b 798 -595 873 -469 847 -539 b 581 -695 741 -662 660 -695 b 406 -626 517 -695 454 -671 b 381 -563 389 -607 381 -585 b 465 -477 381 -519 413 -477 b 545 -559 514 -477 545 -519 b 503 -628 545 -587 532 -613 b 477 -635 495 -632 488 -634 l 475 -637 l 477 -638 b 581 -663 510 -655 545 -663 b 671 -637 616 -663 649 -653 b 729 -391 711 -603 729 -534 b 728 -317 729 -367 728 -344 b 623 -117 722 -173 698 -124 b 611 -116 619 -116 615 -116 b 449 -308 528 -116 457 -198 b 432 -328 447 -323 443 -328 b 413 -303 421 -328 419 -326 b 314 -80 392 -215 357 -138 b 274 -37 302 -65 284 -45 l 268 -31 l 268 -367 l 268 -705 l 246 -705 l 225 -705 l 225 0 "
        },
        vb3: {
            x_min: 0,
            x_max: 227.3125,
            ha: 232,
            o: "m 91 213 b 100 215 93 215 96 215 b 227 58 167 215 224 144 b 227 52 227 56 227 54 b 61 -201 227 -43 164 -138 b 29 -216 44 -212 36 -216 b 23 -210 27 -216 24 -213 b 21 -205 21 -208 21 -206 b 34 -192 21 -201 25 -197 b 122 -55 89 -161 122 -106 b 104 6 122 -33 117 -12 l 103 9 l 96 9 b 4 79 57 9 17 38 b 0 112 1 90 0 101 b 91 213 0 163 36 209 "
        },
        vb6: {
            x_min: 0,
            x_max: 556.6875,
            ha: 568,
            o: "m 289 545 b 298 546 292 545 295 546 b 318 533 306 546 315 541 b 319 428 319 530 319 528 l 319 327 l 334 327 b 526 223 412 326 485 285 b 543 172 537 206 543 190 b 447 76 543 122 503 76 b 445 76 446 76 446 76 b 359 165 394 77 359 119 b 368 205 359 179 362 192 b 441 251 382 233 412 251 b 455 249 446 251 451 251 b 460 248 458 249 460 248 b 460 248 460 248 460 248 b 454 254 460 249 458 251 b 334 295 419 280 378 294 l 319 295 l 319 4 l 319 -287 l 321 -285 b 328 -285 322 -285 325 -285 b 524 -99 424 -277 507 -198 b 541 -79 526 -84 530 -79 b 556 -97 551 -79 556 -84 b 548 -133 556 -105 553 -117 b 334 -317 521 -233 434 -306 b 322 -319 329 -317 323 -317 l 319 -319 l 319 -424 b 319 -471 319 -444 319 -459 b 313 -541 319 -544 318 -535 b 298 -548 308 -545 303 -548 b 279 -534 289 -548 281 -542 b 277 -424 277 -531 277 -530 l 277 -317 l 273 -317 b 13 -95 153 -305 51 -217 b 0 2 4 -62 0 -29 b 182 295 0 126 66 238 b 274 324 210 309 249 320 l 277 324 l 277 427 b 279 533 277 528 277 530 b 289 545 281 538 285 542 m 277 2 b 277 291 277 161 277 291 b 268 288 277 291 273 290 b 144 1 179 265 144 184 b 276 -284 144 -199 175 -267 l 277 -285 l 277 2 "
        },
        vb9: {
            x_min: -122.5,
            x_max: 121.140625,
            ha: 124,
            o: "m -16 145 b 0 147 -10 147 -5 147 b 121 -1 66 147 121 77 b 114 -49 121 -16 118 -33 b -1 -148 95 -112 47 -148 b -85 -106 -31 -148 -61 -134 b -122 -1 -110 -76 -122 -38 b -16 145 -122 68 -81 134 m 12 111 b 0 113 8 113 4 113 b -68 22 -29 113 -61 73 b -70 0 -69 15 -70 6 b -13 -113 -70 -49 -47 -98 b -1 -115 -9 -115 -5 -115 b 63 -40 24 -115 53 -83 b 68 -1 66 -27 68 -15 b 12 111 68 48 46 97 "
        },
        vba: {
            x_min: -118.421875,
            x_max: 597.53125,
            ha: 381,
            o: "m 460 574 b 464 574 461 574 462 574 b 488 574 470 574 481 574 b 500 573 491 574 498 574 b 594 503 543 570 588 538 b 597 488 596 498 597 494 b 528 417 597 449 564 417 b 502 423 519 417 510 419 b 465 481 477 434 465 458 b 488 528 465 499 472 516 b 490 530 490 530 490 530 b 490 530 490 530 490 530 b 468 517 488 530 475 523 b 349 340 419 485 377 420 b 347 330 348 334 347 330 b 383 328 347 328 363 328 b 428 326 423 328 424 328 b 442 302 438 320 442 312 b 430 281 442 294 438 285 b 385 276 424 277 426 276 l 377 276 l 332 276 l 330 269 b 178 -117 303 126 250 -9 b 1 -249 129 -194 69 -237 b -20 -251 -6 -251 -13 -251 b -114 -187 -65 -251 -100 -227 b -118 -156 -117 -177 -118 -166 b -51 -84 -118 -116 -91 -84 b -31 -87 -46 -84 -39 -86 b 16 -152 0 -95 16 -124 b -12 -205 16 -173 8 -194 b -16 -208 -14 -206 -16 -208 b -14 -208 -16 -208 -14 -208 b -9 -206 -14 -208 -12 -208 b 74 -124 23 -197 54 -166 b 172 224 98 -79 125 22 b 185 276 178 252 183 274 b 185 276 185 276 185 276 b 141 276 185 276 181 276 b 91 280 96 276 96 276 b 77 302 83 285 77 294 b 91 326 77 312 83 320 b 148 328 95 328 96 328 l 198 330 l 202 341 b 460 574 249 473 351 566 "
        },
        vbf: {
            x_min: -53.078125,
            x_max: 513.140625,
            ha: 485,
            o: "m 185 383 b 196 384 187 383 191 384 b 277 334 230 384 259 365 b 288 301 281 324 288 306 b 288 297 288 298 288 297 b 294 302 289 297 291 299 b 394 370 323 338 367 367 b 404 371 398 370 401 371 b 510 272 453 371 498 328 b 513 237 513 262 513 251 b 507 172 513 217 511 192 b 326 -34 487 59 412 -26 b 314 -36 322 -36 318 -36 b 274 -24 298 -36 283 -31 l 265 -16 b 224 44 246 -1 232 20 b 223 49 224 47 223 49 b 223 49 223 49 223 49 b 149 -197 221 48 149 -194 b 149 -198 149 -197 149 -198 b 170 -210 149 -202 155 -205 b 187 -215 174 -210 175 -212 b 204 -231 201 -219 204 -222 b 197 -245 204 -240 202 -242 l 194 -248 l 76 -248 l -42 -248 l -46 -245 b -53 -231 -51 -242 -53 -240 b -35 -215 -53 -222 -49 -217 b -13 -210 -21 -212 -20 -212 b -6 -208 -10 -209 -8 -208 b 0 -206 -6 -208 -2 -206 b 25 -188 13 -201 21 -195 b 163 280 28 -183 163 276 b 166 291 163 283 164 287 b 167 302 167 295 167 299 b 155 324 167 315 161 324 b 155 324 155 324 155 324 b 65 230 125 322 85 280 b 53 215 61 217 58 215 b 51 215 53 215 51 215 b 42 224 46 215 42 217 b 57 263 42 231 47 244 b 140 360 77 305 104 337 b 152 370 144 365 149 369 b 185 383 157 376 172 381 m 374 306 b 366 308 371 308 368 308 b 300 273 348 308 321 294 b 284 254 288 262 287 259 b 280 242 283 249 281 245 b 257 169 279 240 270 213 l 236 98 l 236 93 b 251 48 238 77 243 61 b 279 27 258 37 272 27 b 281 27 279 27 280 27 b 291 31 281 27 287 30 b 396 170 334 52 378 109 b 406 247 402 197 406 224 b 401 277 406 259 405 270 b 374 306 397 290 383 303 "
        },
        vc3: {
            x_min: -10.890625,
            x_max: 299.4375,
            ha: 294,
            o: "m 136 460 b 142 462 137 462 140 462 b 166 449 152 462 161 456 b 171 428 168 446 168 445 b 288 131 194 322 238 209 b 298 115 295 120 296 117 b 299 106 298 112 299 109 b 273 81 299 91 287 81 b 255 86 268 81 261 83 b 155 116 225 104 183 116 l 152 116 l 149 108 b 141 83 148 102 144 91 b 134 48 137 69 134 58 b 149 9 134 34 140 24 b 153 -1 152 5 153 1 b 149 -9 153 -5 152 -6 b 144 -11 148 -11 147 -11 b 122 2 138 -11 133 -6 b 95 61 104 20 95 38 b 107 108 95 74 99 90 b 108 113 107 111 108 112 b 107 113 108 113 108 113 b 102 113 106 113 104 113 b 31 86 76 108 53 98 b 14 80 24 81 20 80 b -10 106 0 80 -10 91 b 0 131 -10 115 -9 116 b 115 430 49 209 91 317 b 136 460 119 451 123 456 "
        }
    },
    cssFontWeight: "normal",
    ascender: 1903,
    underlinePosition: -125,
    cssFontStyle: "normal",
    boundingBox: {
        yMin: -2065.375,
        xMin: -695.53125,
        yMax: 1901.578125,
        xMax: 1159.671875
    },
    resolution: 1e3,
    descender: -2066,
    familyName: "VexFlow-18",
    lineHeight: 4093,
    underlineThickness: 50
};
Vex.Flow.renderGlyph = function (t, i, e, n, s, o) {
    var r = 72 * n / (100 * Vex.Flow.Font.resolution),
        h = Vex.Flow.Glyph.loadMetrics(Vex.Flow.Font, s, !o);
    Vex.Flow.Glyph.renderOutline(t, h.outline, r, i, e)
}, Vex.Flow.Glyph = function () {
    function t(t, i, e) {
        this.code = t, this.point = i, this.context = null, this.options = {
            cache: !0,
            font: Vex.Flow.Font
        }, this.width = null, this.metrics = null, this.x_shift = 0, this.y_shift = 0, e ? this.setOptions(e) : this.reset()
    }
    return t.prototype = {
        setOptions: function (t) {
            Vex.Merge(this.options, t), this.reset()
        },
        setStave: function (t) {
            return this.stave = t, this
        },
        setXShift: function (t) {
            return this.x_shift = t, this
        },
        setYShift: function (t) {
            return this.y_shift = t, this
        },
        setContext: function (t) {
            return this.context = t, this
        },
        getContext: function () {
            return this.context
        },
        reset: function () {
            this.metrics = Vex.Flow.Glyph.loadMetrics(this.options.font, this.code, this.options.cache), this.scale = 72 * this.point / (100 * this.options.font.resolution)
        },
        getMetrics: function () {
            if (!this.metrics) throw new Vex.RuntimeError("BadGlyph", "Glyph " + this.code + " is not initialized.");
            return {
                x_min: this.metrics.x_min * this.scale,
                x_max: this.metrics.x_max * this.scale,
                width: (this.metrics.x_max - this.metrics.x_min) * this.scale
            }
        },
        render: function (i, e, n) {
            if (!this.metrics) throw new Vex.RuntimeError("BadGlyph", "Glyph " + this.code + " is not initialized.");
            var s = this.metrics.outline,
                o = this.scale;
            t.renderOutline(i, s, o, e, n)
        },
        renderToStave: function (i) {
            if (!this.metrics) throw new Vex.RuntimeError("BadGlyph", "Glyph " + this.code + " is not initialized.");
            if (!this.stave) throw new Vex.RuntimeError("GlyphError", "No valid stave");
            if (!this.context) throw new Vex.RERR("GlyphError", "No valid context");
            var e = this.metrics.outline,
                n = this.scale;
            t.renderOutline(this.context, e, n, i + this.x_shift, this.stave.getYForGlyphs() + this.y_shift)
        }
    }, t.loadMetrics = function (t, i, e) {
        var n = t.glyphs[i];
        if (!n) throw new Vex.RuntimeError("BadGlyph", "Glyph " + i + " does not exist in font.");
        var s, o = n.x_min,
            r = n.x_max;
        if (n.o) return e ? n.cached_outline ? s = n.cached_outline : (s = n.o.split(" "), n.cached_outline = s) : (n.cached_outline && delete n.cached_outline, s = n.o.split(" ")), {
            x_min: o,
            x_max: r,
            outline: s
        };
        throw new Vex.RuntimeError("BadGlyph", "Glyph " + this.code + " has no outline defined.")
    }, t.renderOutline = function (t, i, e, n, s) {
        var o = i.length;
        t.beginPath(), t.moveTo(n, s);
        for (var r = 0; o > r;) {
            var h = i[r++];
            switch (h) {
            case "m":
                t.moveTo(n + i[r++] * e, s + i[r++] * -e);
                break;
            case "l":
                t.lineTo(n + i[r++] * e, s + i[r++] * -e);
                break;
            case "q":
                var l = n + i[r++] * e,
                    c = s + i[r++] * -e;
                t.quadraticCurveTo(n + i[r++] * e, s + i[r++] * -e, l, c);
                break;
            case "b":
                var a = n + i[r++] * e,
                    u = s + i[r++] * -e;
                t.bezierCurveTo(n + i[r++] * e, s + i[r++] * -e, n + i[r++] * e, s + i[r++] * -e, a, u)
            }
        }
        t.fill()
    }, t
}();
Vex.Flow.Stave = function () {
    function t(t, i, e, n) {
        arguments.length > 0 && this.init(t, i, e, n)
    }
    var i = Vex.Flow.STAVE_LINE_THICKNESS > 1 ? Vex.Flow.STAVE_LINE_THICKNESS : 0;
    return t.prototype = {
        init: function (t, i, e, n) {
            this.x = t, this.y = i, this.width = e, this.glyph_start_x = t + 5, this.glyph_end_x = t + e, this.start_x = this.glyph_start_x, this.end_x = this.glyph_end_x, this.context = null, this.glyphs = [], this.end_glyphs = [], this.modifiers = [], this.measure = 0, this.clef = "treble", this.font = {
                family: "sans-serif",
                size: 8,
                weight: ""
            }, this.options = {
                vertical_bar_width: 10,
                glyph_spacing_px: 10,
                num_lines: 5,
                fill_style: "#999999",
                spacing_between_lines_px: 10,
                space_above_staff_ln: 4,
                space_below_staff_ln: 4,
                top_text_position: 1,
                bottom_text_position: 6
            }, this.bounds = {
                x: this.x,
                y: this.y,
                w: this.width,
                h: 0
            }, Vex.Merge(this.options, n), this.options.line_config = [];
            for (var s = 0; s < this.options.num_lines; s++) this.options.line_config.push({
                visible: !0
            });
            this.height = (this.options.num_lines + this.options.space_above_staff_ln) * this.options.spacing_between_lines_px, this.modifiers.push(new Vex.Flow.Barline(Vex.Flow.Barline.type.SINGLE, this.x)), this.modifiers.push(new Vex.Flow.Barline(Vex.Flow.Barline.type.SINGLE, this.x + this.width))
        },
        setNoteStartX: function (t) {
            return this.start_x = t, this
        },
        getNoteStartX: function () {
            var t = this.start_x;
            return this.modifiers[0].barline == Vex.Flow.Barline.type.REPEAT_BEGIN && (t += 20), t
        },
        getNoteEndX: function () {
            return this.end_x
        },
        getTieStartX: function () {
            return this.start_x
        },
        getTieEndX: function () {
            return this.x + this.width
        },
        setContext: function (t) {
            return this.context = t, this
        },
        getContext: function () {
            return this.context
        },
        getX: function () {
            return this.x
        },
        getNumLines: function () {
            return this.options.num_lines
        },
        setY: function (t) {
            return this.y = t, this
        },
        setWidth: function (t) {
            return this.width = t, this.modifiers[1].setX(this.x + this.width), this
        },
        setMeasure: function (t) {
            return this.measure = t, this
        },
        setBegBarType: function (t) {
            return (t == Vex.Flow.Barline.type.SINGLE || t == Vex.Flow.Barline.type.REPEAT_BEGIN || t == Vex.Flow.Barline.type.NONE) && (this.modifiers[0] = new Vex.Flow.Barline(t, this.x)), this
        },
        setEndBarType: function (t) {
            return t != Vex.Flow.Barline.type.REPEAT_BEGIN && (this.modifiers[1] = new Vex.Flow.Barline(t, this.x + this.width)), this
        },
        getModifierXShift: function (t) {
            "undefined" == typeof t && (t = this.glyphs.length - 1), "number" != typeof t && new Vex.RERR("InvalidIndex", "Must be of number type");
            for (var i = this.glyph_start_x, e = 0, n = 0; t + 1 > n; ++n) {
                var s = this.glyphs[n];
                i += s.getMetrics().width, e += s.getMetrics().width
            }
            return e > 0 && (e += this.options.vertical_bar_width + 10), e
        },
        setRepetitionTypeLeft: function (t, i) {
            return this.modifiers.push(new Vex.Flow.Repetition(t, this.x, i)), this
        },
        setRepetitionTypeRight: function (t, i) {
            return this.modifiers.push(new Vex.Flow.Repetition(t, this.x, i)), this
        },
        setVoltaType: function (t, i, e) {
            return this.modifiers.push(new Vex.Flow.Volta(t, i, this.x, e)), this
        },
        setSection: function (t, i) {
            return this.modifiers.push(new Vex.Flow.StaveSection(t, this.x, i)), this
        },
        setTempo: function (t, i) {
            return this.modifiers.push(new Vex.Flow.StaveTempo(t, this.x, i)), this
        },
        getHeight: function () {
            return this.height
        },
        getSpacingBetweenLines: function () {
            return this.options.spacing_between_lines_px
        },
        getBoundingBox: function () {
            return new Vex.Flow.BoundingBox(this.x, this.y, this.width, this.getBottomY() - this.y)
        },
        getBottomY: function () {
            var t = this.options,
                i = t.spacing_between_lines_px,
                e = this.getYForLine(t.num_lines) + t.space_below_staff_ln * i;
            return e
        },
        getYForLine: function (t) {
            var e = this.options,
                n = e.spacing_between_lines_px,
                s = e.space_above_staff_ln,
                o = this.y + (t * n + s * n) - i / 2;
            return o
        },
        getYForTopText: function (t) {
            var i = t || 0;
            return this.getYForLine(-i - this.options.top_text_position)
        },
        getYForBottomText: function (t) {
            var i = t || 0;
            return this.getYForLine(this.options.bottom_text_position + i)
        },
        getYForNote: function (t) {
            var i = this.options,
                e = i.spacing_between_lines_px,
                n = i.space_above_staff_ln,
                s = this.y + n * e + 5 * e - t * e;
            return s
        },
        getYForGlyphs: function () {
            return this.getYForLine(3)
        },
        addGlyph: function (t) {
            return t.setStave(this), this.glyphs.push(t), this.start_x += t.getMetrics().width, this
        },
        addEndGlyph: function (t) {
            return t.setStave(this), this.end_glyphs.push(t), this.end_x -= t.getMetrics().width, this
        },
        addModifier: function (t) {
            return this.modifiers.push(t), t.addToStave(this, 0 === this.glyphs.length), this
        },
        addEndModifier: function (t) {
            return this.modifiers.push(t), t.addToStaveEnd(this, 0 === this.end_glyphs.length), this
        },
        addKeySignature: function (t) {
            return this.addModifier(new Vex.Flow.KeySignature(t)), this
        },
        addClef: function (t) {
            return this.clef = t, this.addModifier(new Vex.Flow.Clef(t)), this
        },
        addEndClef: function (t) {
            return this.addEndModifier(new Vex.Flow.Clef(t)), this
        },
        addTimeSignature: function (t, i) {
            return this.addModifier(new Vex.Flow.TimeSignature(t, i)), this
        },
        addEndTimeSignature: function (t, i) {
            this.addEndModifier(new Vex.Flow.TimeSignature(t, i))
        },
        addTrebleGlyph: function () {
            return this.clef = "treble", this.addGlyph(new Vex.Flow.Glyph("v83", 40)), this
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
            for (var t, i, e = this.options.num_lines, n = this.width, s = this.x, o = 0; e > o; o++) t = this.getYForLine(o), this.context.save(), this.context.setFillStyle(this.options.fill_style), this.context.setStrokeStyle(this.options.fill_style), this.options.line_config[o].visible && this.context.fillRect(s, t, n, Vex.Flow.STAVE_LINE_THICKNESS), this.context.restore();
            s = this.glyph_start_x;
            for (var h = 0; h < this.glyphs.length; ++h) i = this.glyphs[h], i.getContext() || i.setContext(this.context), i.renderToStave(s), s += i.getMetrics().width;
            for (s = this.glyph_end_x, h = 0; h < this.end_glyphs.length; ++h) i = this.end_glyphs[h], i.getContext() || i.setContext(this.context), s -= i.getMetrics().width, i.renderToStave(s);
            for (h = 0; h < this.modifiers.length; h++) "function" == typeof this.modifiers[h].draw && this.modifiers[h].draw(this, this.getModifierXShift());
            if (this.measure > 0) {
                this.context.save(), this.context.setFont(this.font.family, this.font.size, this.font.weight);
                var r = this.context.measureText("" + this.measure).width;
                t = this.getYForTopText(0) + 3, this.context.fillText("" + this.measure, this.x - r / 2, t), this.context.restore()
            }
            return this
        },
        drawVertical: function (t, i) {
            this.drawVerticalFixed(this.x + t, i)
        },
        drawVerticalFixed: function (t, i) {
            if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
            var e = this.getYForLine(0),
                n = this.getYForLine(this.options.num_lines - 1);
            i && this.context.fillRect(t - 3, e, 1, n - e + 1), this.context.fillRect(t, e, 1, n - e + 1)
        },
        drawVerticalBar: function (t) {
            this.drawVerticalBarFixed(this.x + t, !1)
        },
        drawVerticalBarFixed: function (t) {
            if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
            var i = this.getYForLine(0),
                e = this.getYForLine(this.options.num_lines - 1);
            this.context.fillRect(t, i, 1, e - i + 1)
        },
        getConfigForLines: function () {
            return this.options.line_config
        },
        setConfigForLine: function (t, i) {
            if (t >= this.options.num_lines || 0 > t) throw new Vex.RERR("StaveConfigError", "The line number must be within the range of the number of lines in the Stave.");
            if (!i.hasOwnProperty("visible")) throw new Vex.RERR("StaveConfigError", "The line configuration object is missing the 'visible' property.");
            if ("boolean" != typeof i.visible) throw new Vex.RERR("StaveConfigError", "The line configuration objects 'visible' property must be true or false.");
            return this.options.line_config[t] = i, this
        },
        setConfigForLines: function (t) {
            if (t.length !== this.options.num_lines) throw new Vex.RERR("StaveConfigError", "The length of the lines configuration array must match the number of lines in the Stave");
            for (var i in t) t[i] || (t[i] = this.options.line_config[i]), Vex.Merge(this.options.line_config[i], t[i]);
            return this.options.line_config = t, this
        }
    }, t
}();
Vex.Flow.StaveConnector = function () {
    function t(t, e) {
        this.init(t, e)
    }

    function e(e, i, s, h, o) {
        if (i !== t.type.BOLD_DOUBLE_LEFT && i !== t.type.BOLD_DOUBLE_RIGHT) throw Vex.RERR("InvalidConnector", "A REPEAT_BEGIN or REPEAT_END type must be provided.");
        var p = 3,
            E = 3.5,
            r = 2;
        i === t.type.BOLD_DOUBLE_RIGHT && (p = -5, E = 3), e.fillRect(s + p, h, 1, o - h), e.fillRect(s - r, h, E, o - h)
    }
    t.type = {
        SINGLE_RIGHT: 0,
        SINGLE_LEFT: 1,
        SINGLE: 1,
        DOUBLE: 2,
        BRACE: 3,
        BRACKET: 4,
        BOLD_DOUBLE_LEFT: 5,
        BOLD_DOUBLE_RIGHT: 6,
        THIN_DOUBLE: 7
    };
    var i = Vex.Flow.STAVE_LINE_THICKNESS;
    return t.prototype = {
        init: function (e, i) {
            this.width = 3, this.top_stave = e, this.bottom_stave = i, this.type = t.type.DOUBLE, this.x_shift = 0
        },
        setContext: function (t) {
            return this.ctx = t, this
        },
        setType: function (e) {
            return e >= t.type.SINGLE_RIGHT && e <= t.type.THIN_DOUBLE && (this.type = e), this
        },
        setXShift: function (t) {
            if ("number" != typeof t) throw Vex.RERR("InvalidType", "x_shift must be a Number");
            return this.x_shift = t, this
        },
        draw: function () {
            if (!this.ctx) throw new Vex.RERR("NoContext", "Can't draw without a context.");
            var s = this.top_stave.getYForLine(0),
                h = this.bottom_stave.getYForLine(this.bottom_stave.getNumLines() - 1) + i,
                o = this.width,
                p = this.top_stave.getX(),
                E = this.type === t.type.SINGLE_RIGHT || this.type === t.type.BOLD_DOUBLE_RIGHT || this.type === t.type.THIN_DOUBLE;
            E && (p = this.top_stave.getX() + this.top_stave.width);
            var r = h - s;
            switch (this.type) {
            case t.type.SINGLE:
                o = 1;
                break;
            case t.type.SINGLE_LEFT:
                o = 1;
                break;
            case t.type.SINGLE_RIGHT:
                o = 1;
                break;
            case t.type.DOUBLE:
                p -= this.width + 2;
                break;
            case t.type.BRACE:
                o = 12;
                var _ = this.top_stave.getX() - 2,
                    L = s,
                    y = _,
                    c = h,
                    a = _ - o,
                    n = L + r / 2,
                    B = a - .9 * o,
                    T = L + .2 * r,
                    x = _ + 1.1 * o,
                    R = n - .135 * r,
                    D = x,
                    I = n + .135 * r,
                    O = B,
                    v = c - .2 * r,
                    f = a - o,
                    u = v,
                    b = _ + .4 * o,
                    G = n + .135 * r,
                    N = b,
                    l = n - .135 * r,
                    U = f,
                    w = T;
                this.ctx.beginPath(), this.ctx.moveTo(_, L), this.ctx.bezierCurveTo(B, T, x, R, a, n), this.ctx.bezierCurveTo(D, I, O, v, y, c), this.ctx.bezierCurveTo(f, u, b, G, a, n), this.ctx.bezierCurveTo(N, l, U, w, _, L), this.ctx.fill(), this.ctx.stroke();
                break;
            case t.type.BRACKET:
                s -= 4, h += 4, r = h - s, Vex.Flow.renderGlyph(this.ctx, p - 5, s - 3, 40, "v1b", !0), Vex.Flow.renderGlyph(this.ctx, p - 5, h + 3, 40, "v10", !0), p -= this.width + 2;
                break;
            case t.type.BOLD_DOUBLE_LEFT:
                e(this.ctx, this.type, p + this.x_shift, s, h);
                break;
            case t.type.BOLD_DOUBLE_RIGHT:
                e(this.ctx, this.type, p, s, h);
                break;
            case t.type.THIN_DOUBLE:
                o = 1
            }
            this.type !== t.type.BRACE && this.type !== t.type.BOLD_DOUBLE_LEFT && this.type !== t.type.BOLD_DOUBLE_RIGHT && this.ctx.fillRect(p, s, o, r), this.type === t.type.THIN_DOUBLE && this.ctx.fillRect(p - 3, s, o, r)
        }
    }, t
}();
Vex.Flow.TabStave = function () {
    function t(t, e, n, i) {
        arguments.length > 0 && this.init(t, e, n, i)
    }
    return Vex.Inherit(t, Vex.Flow.Stave, {
        init: function (e, n, i, s) {
            var o = {
                spacing_between_lines_px: 13,
                num_lines: 6,
                top_text_position: 1,
                bottom_text_position: 7
            };
            Vex.Merge(o, s), t.superclass.init.call(this, e, n, i, o)
        },
        setNumberOfLines: function (t) {
            return this.options.num_lines = t, this
        },
        getYForGlyphs: function () {
            return this.getYForLine(2.5)
        },
        addTabGlyph: function () {
            var t, e;
            switch (this.options.num_lines) {
            case 6:
                t = 40, e = 0;
                break;
            case 5:
                t = 30, e = -6;
                break;
            case 4:
                t = 23, e = -12
            }
            var n = new Vex.Flow.Glyph("v2f", t);
            return n.y_shift = e, this.addGlyph(n), this
        }
    }), t
}();
Vex.Flow.TickContext = function () {
    function t() {
        this.init()
    }
    return t.prototype = {
        init: function () {
            this.currentTick = new Vex.Flow.Fraction(0, 1), this.maxTicks = new Vex.Flow.Fraction(0, 1), this.minTicks = null, this.width = 0, this.padding = 3, this.pixelsUsed = 0, this.x = 0, this.tickables = [], this.notePx = 0, this.extraLeftPx = 0, this.extraRightPx = 0, this.ignore_ticks = !0, this.preFormatted = !1, this.context = null
        },
        setContext: function (t) {
            return this.context = t, this
        },
        getContext: function () {
            return this.context
        },
        shouldIgnoreTicks: function () {
            return this.ignore_ticks
        },
        getWidth: function () {
            return this.width + 2 * this.padding
        },
        getX: function () {
            return this.x
        },
        setX: function (t) {
            return this.x = t, this
        },
        getPixelsUsed: function () {
            return this.pixelsUsed
        },
        setPixelsUsed: function (t) {
            return this.pixelsUsed = t, this
        },
        setPadding: function (t) {
            return this.padding = t, this
        },
        getMaxTicks: function () {
            return this.maxTicks
        },
        getMinTicks: function () {
            return this.minTicks
        },
        getTickables: function () {
            return this.tickables
        },
        getMetrics: function () {
            return {
                width: this.width,
                notePx: this.notePx,
                extraLeftPx: this.extraLeftPx,
                extraRightPx: this.extraRightPx
            }
        },
        getCurrentTick: function () {
            return this.currentTick
        },
        setCurrentTick: function (t) {
            this.currentTick = t, this.preFormatted = !1
        },
        getExtraPx: function () {
            for (var t = 0, i = 0, e = 0, s = 0, n = 0; n < this.tickables.length; n++) {
                e = Math.max(this.tickables[n].extraLeftPx, e), s = Math.max(this.tickables[n].extraRightPx, s);
                var h = this.tickables[n].modifierContext;
                h && null != h && (t = Math.max(t, h.state.left_shift), i = Math.max(i, h.state.right_shift))
            }
            return {
                left: t,
                right: i,
                extraLeft: e,
                extraRight: s
            }
        },
        addTickable: function (t) {
            if (!t) throw new Vex.RERR("BadArgument", "Invalid tickable added.");
            if (!t.shouldIgnoreTicks()) {
                this.ignore_ticks = !1;
                var i = t.getTicks();
                i.value() > this.maxTicks.value() && (this.maxTicks = i.clone()), null == this.minTicks ? this.minTicks = i.clone() : i.value() < this.minTicks.value() && (this.minTicks = i.clone())
            }
            return t.setTickContext(this), this.tickables.push(t), this.preFormatted = !1, this
        },
        preFormat: function () {
            if (!this.preFormatted) {
                for (var t = 0; t < this.tickables.length; ++t) {
                    var i = this.tickables[t];
                    i.preFormat();
                    var e = i.getMetrics();
                    this.extraLeftPx = Math.max(this.extraLeftPx, e.extraLeftPx + e.modLeftPx), this.extraRightPx = Math.max(this.extraRightPx, e.extraRightPx + e.modRightPx), this.notePx = Math.max(this.notePx, e.noteWidth), this.width = this.notePx + this.extraLeftPx + this.extraRightPx
                }
                return this
            }
        }
    }, t
}();
Vex.Flow.Tickable = function () {
    function t() {
        this.init()
    }
    return t.prototype = {
        init: function () {
            this.intrinsicTicks = 0, this.tickMultiplier = new Vex.Flow.Fraction(1, 1), this.ticks = new Vex.Flow.Fraction(0, 1), this.width = 0, this.x_shift = 0, this.voice = null, this.tickContext = null, this.modifierContext = null, this.modifiers = [], this.preFormatted = !1, this.tuplet = null, this.ignore_ticks = !1, this.context = null
        },
        setContext: function (t) {
            this.context = t
        },
        getBoundingBox: function () {
            return null
        },
        getTicks: function () {
            return this.ticks
        },
        shouldIgnoreTicks: function () {
            return this.ignore_ticks
        },
        getWidth: function () {
            return this.width
        },
        setXShift: function (t) {
            this.x_shift = t
        },
        getVoice: function () {
            if (!this.voice) throw new Vex.RERR("NoVoice", "Tickable has no voice.");
            return this.voice
        },
        setVoice: function (t) {
            this.voice = t
        },
        getTuplet: function () {
            return this.tuplet
        },
        setTuplet: function (t) {
            var i, e;
            return this.tuplet && (i = this.tuplet.getNoteCount(), e = this.tuplet.getBeatsOccupied(), this.applyTickMultiplier(i, e)), t && (i = t.getNoteCount(), e = t.getBeatsOccupied(), this.applyTickMultiplier(e, i)), this.tuplet = t, this
        },
        addToModifierContext: function (t) {
            this.modifierContext = t, this.preFormatted = !1
        },
        addModifier: function (t) {
            return this.modifiers.push(t), this.preFormatted = !1, this
        },
        setTickContext: function (t) {
            this.tickContext = t, this.preFormatted = !1
        },
        preFormat: function () {
            this.preFormatted || (this.width = 0, this.modifierContext && (this.modifierContext.preFormat(), this.width += this.modifierContext.getWidth()))
        },
        getIntrinsicTicks: function () {
            return this.intrinsicTicks
        },
        setIntrinsicTicks: function (t) {
            this.intrinsicTicks = t, this.ticks = this.tickMultiplier.clone().multiply(this.intrinsicTicks)
        },
        getTickMultiplier: function () {
            return this.tickMultiplier
        },
        applyTickMultiplier: function (t, i) {
            this.tickMultiplier.multiply(t, i), this.ticks = this.tickMultiplier.clone().multiply(this.intrinsicTicks)
        }
    }, t
}();
Vex.Flow.Note = function () {
    function t(t) {
        arguments.length > 0 && this.init(t)
    }
    return Vex.Inherit(t, Vex.Flow.Tickable, {
        init: function (e) {
            if (t.superclass.init.call(this), !e) throw new Vex.RuntimeError("BadArguments", "Note must have valid initialization data to identify duration and type.");
            var i = Vex.Flow.parseNoteData(e);
            if (!i) throw new Vex.RuntimeError("BadArguments", "Invalid note initialization object: " + JSON.stringify(e));
            if (this.duration = i.duration, this.dots = i.dots, this.noteType = i.type, this.setIntrinsicTicks(i.ticks), this.modifiers = [], this.positions && ("object" != typeof this.positions || !this.positions.length)) throw new Vex.RuntimeError("BadArguments", "Note keys must be array type.");
            this.playNote = null, this.tickContext = null, this.modifierContext = null, this.ignore_ticks = !1, this.width = 0, this.extraLeftPx = 0, this.extraRightPx = 0, this.x_shift = 0, this.left_modPx = 0, this.right_modPx = 0, this.voice = null, this.preFormatted = !1, this.ys = [], this.context = null, this.stave = null, this.render_options = {
                annotation_spacing: 5
            }
        },
        setPlayNote: function (t) {
            return this.playNote = t, this
        },
        getPlayNote: function () {
            return this.playNote
        },
        isRest: function () {
            return !1
        },
        addStroke: function (t, e) {
            return e.setNote(this), e.setIndex(t), this.modifiers.push(e), this.setPreFormatted(!1), this
        },
        getStave: function () {
            return this.stave
        },
        setStave: function (t) {
            return this.stave = t, this.setYs([t.getYForLine(0)]), this.context = this.stave.context, this
        },
        setContext: function (t) {
            return this.context = t, this
        },
        getExtraLeftPx: function () {
            return this.extraLeftPx
        },
        getExtraRightPx: function () {
            return this.extraRightPx
        },
        setExtraLeftPx: function (t) {
            return this.extraLeftPx = t, this
        },
        setExtraRightPx: function (t) {
            return this.extraRightPx = t, this
        },
        shouldIgnoreTicks: function () {
            return this.ignore_ticks
        },
        getLineNumber: function () {
            return 0
        },
        setYs: function (t) {
            return this.ys = t, this
        },
        getYs: function () {
            if (0 === this.ys.length) throw new Vex.RERR("NoYValues", "No Y-values calculated for this note.");
            return this.ys
        },
        getYForTopText: function (t) {
            if (!this.stave) throw new Vex.RERR("NoStave", "No stave attached to this note.");
            return this.stave.getYForTopText(t)
        },
        getBoundingBox: function () {
            return null
        },
        getVoice: function () {
            if (!this.voice) throw new Vex.RERR("NoVoice", "Note has no voice.");
            return this.voice
        },
        setVoice: function (t) {
            return this.voice = t, this.preFormatted = !1, this
        },
        getTickContext: function () {
            return this.tickContext
        },
        setTickContext: function (t) {
            return this.tickContext = t, this.preFormatted = !1, this
        },
        getDuration: function () {
            return this.duration
        },
        isDotted: function () {
            return this.dots > 0
        },
        hasStem: function () {
            return !1
        },
        getDots: function () {
            return this.dots
        },
        getNoteType: function () {
            return this.noteType
        },
        setModifierContext: function (t) {
            return this.modifierContext = t, this
        },
        addModifier: function (t, e) {
            return t.setNote(this), t.setIndex(e || 0), this.modifiers.push(t), this.setPreFormatted(!1), this
        },
        getModifierStartXY: function () {
            if (!this.preFormatted) throw new Vex.RERR("UnformattedNote", "Can't call GetModifierStartXY on an unformatted note");
            var t = 0;
            return {
                x: this.getAbsoluteX() + t,
                y: this.ys[0]
            }
        },
        getMetrics: function () {
            if (!this.preFormatted) throw new Vex.RERR("UnformattedNote", "Can't call getMetrics on an unformatted note.");
            var t = 0,
                e = 0;
            null != this.modifierContext && (t = this.modifierContext.state.left_shift, e = this.modifierContext.state.right_shift);
            var i = this.getWidth();
            return {
                width: i,
                noteWidth: i - t - e - this.extraLeftPx - this.extraRightPx,
                left_shift: this.x_shift,
                modLeftPx: t,
                modRightPx: e,
                extraLeftPx: this.extraLeftPx,
                extraRightPx: this.extraRightPx
            }
        },
        setWidth: function (t) {
            this.width = t
        },
        getWidth: function () {
            if (!this.preFormatted) throw new Vex.RERR("UnformattedNote", "Can't call GetWidth on an unformatted note.");
            return this.width + (this.modifierContext ? this.modifierContext.getWidth() : 0)
        },
        setXShift: function (t) {
            return this.x_shift = t, this
        },
        getX: function () {
            if (!this.tickContext) throw new Vex.RERR("NoTickContext", "Note needs a TickContext assigned for an X-Value");
            return this.tickContext.getX() + this.x_shift
        },
        getAbsoluteX: function () {
            if (!this.tickContext) throw new Vex.RERR("NoTickContext", "Note needs a TickContext assigned for an X-Value");
            var t = this.tickContext.getX();
            return this.stave && (t += this.stave.getNoteStartX() + 12), t
        },
        setPreFormatted: function (t) {
            if (this.preFormatted = t, this.preFormatted) {
                var e = this.tickContext.getExtraPx();
                this.left_modPx = Math.max(this.left_modPx, e.left), this.right_modPx = Math.max(this.right_modPx, e.right)
            }
        }
    }), t
}();
Vex.Flow.GhostNote = function () {
    function t(t) {
        arguments.length > 0 && this.init(t)
    }
    return Vex.Inherit(t, Vex.Flow.Note, {
        init: function (i) {
            if (!i) throw new Vex.RuntimeError("BadArguments", "Ghost note must have valid initialization data to identify duration.");
            var e;
            if ("string" == typeof i) e = {
                duration: i
            };
            else {
                if ("object" != typeof i) throw new Vex.RuntimeError("BadArguments", "Ghost note must have valid initialization data to identify duration.");
                e = i
            }
            t.superclass.init.call(this, e), this.setWidth(0)
        },
        isRest: function () {
            return !0
        },
        setStave: function (i) {
            t.superclass.setStave.call(this, i)
        },
        addToModifierContext: function () {
            return this
        },
        preFormat: function () {
            return this.setPreFormatted(!0), this
        },
        draw: function () {
            if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");
            for (var t = 0; t < this.modifiers.length; ++t) {
                var i = this.modifiers[t];
                i.setContext(this.context), i.draw()
            }
        }
    }), t
}();
Vex.Flow.NoteHead = function () {
    function t(t, e, o, i) {
        var s = 15 + Vex.Flow.STEM_WIDTH / 2;
        t.beginPath(), t.moveTo(o, i + 11), t.lineTo(o, i + 1), t.lineTo(o + s, i - 10), t.lineTo(o + s, i), t.lineTo(o, i + 11), t.closePath(), 1 != e && 2 != e && "h" != e && "w" != e ? t.fill() : t.stroke()
    }
    var e = function (t) {
        arguments.length > 0 && this.init(t)
    };
    return e.prototype = {
        init: function (t) {
            if (this.x = t.x || 0, this.y = t.y || 0, this.note_type = t.note_type, this.duration = t.duration, this.displaced = t.displaced || !1, this.stem_direction = t.stem_direction || Vex.Flow.StaveNote.STEM_UP, this.glyph = Vex.Flow.durationToGlyph(this.duration, this.note_type), !this.glyph) throw new Vex.RuntimeError("BadArguments", "No glyph found for duration '" + this.duration + "' and type '" + this.note_type + "'");
            this.width = this.glyph.head_width, this.glyph_code = this.glyph.code_head, this.absolute_x = this.x + (this.displaced ? this.width * this.stem_direction : 0), t.custom_glyph_code && (this.glyph_code = t.custom_glyph_code, this.absolute_x = this.x + t.x_shift), this.glyph_font_scale = t.glyph_font_scale, this.context = null, this.key_style = null, this.slashed = t.slashed
        },
        getCategory: function () {
            return "notehead"
        },
        setContext: function (t) {
            return this.context = t, this
        },
        getWidth: function () {
            return this.width
        },
        getAbsoluteX: function () {
            return this.absolute_x
        },
        getBoundingBox: function () {
            throw new Vex.RERR("NotImplemented", "getBoundingBox() not implemented.")
        },
        applyKeyStyle: function (t, e) {
            t.shadowColor && e.setShadowColor(t.shadowColor), t.shadowBlur && e.setShadowBlur(t.shadowBlur), t.fillStyle && e.setFillStyle(t.fillStyle), t.strokeStyle && e.setStrokeStyle(t.strokeStyle)
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
            var e = this.context,
                o = this.absolute_x,
                i = this.y,
                s = this.stem_direction,
                h = this.glyph_font_scale,
                n = this.key_style;
            if ("s" == this.note_type) {
                var l = Vex.Flow.STEM_WIDTH / 2;
                t(e, this.duration, o + (1 == s ? -l : l), i)
            } else n ? (e.save(), this.applyKeyStyle(n, e), Vex.Flow.renderGlyph(e, o, i, h, this.glyph_code), e.restore()) : Vex.Flow.renderGlyph(e, o, i, h, this.glyph_code)
        }
    }, e
}();
Vex.Flow.Stem = function () {
    var t = function (t) {
        arguments.length > 0 && this.init(t)
    };
    return t.UP = 1, t.DOWN = -1, t.WIDTH = Vex.Flow.STEM_WIDTH, t.HEIGHT = Vex.Flow.STEM_HEIGHT, t.prototype = {
        init: function (e) {
            this.x_begin = e.x_begin, this.x_end = e.x_end, this.y_top = e.y_top, this.y_bottom = e.y_bottom, this.y_extend = e.y_extend || 0, this.stem_direction = e.stem_direction, this.stem_extension = e.stem_extension, this.stem_height = (this.y_bottom - this.y_top) * this.stem_direction + (t.HEIGHT + this.stem_extension) * this.stem_direction
        },
        getCategory: function () {
            return "stem"
        },
        setContext: function (t) {
            return this.context = t, this
        },
        getHeight: function () {
            return this.stem_height
        },
        getBoundingBox: function () {
            throw new Vex.RERR("NotImplemented", "getBoundingBox() not implemented.")
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
            var e, i, n = this.context,
                o = this.stem_direction;
            o == t.DOWN ? (e = this.x_begin, i = this.y_top) : (e = this.x_end, i = this.y_bottom), i += this.y_extend * o, n.fillRect(e, i - (this.stem_height < 0 ? 0 : this.stem_height), t.WIDTH, Math.abs(this.stem_height))
        }
    }, t
}();
Vex.Flow.StemmableNote = function () {
    var t = function (t) {
        arguments.length > 0 && this.init(t)
    }, e = Vex.Flow.Stem;
    return Vex.Inherit(t, Vex.Flow.Note, {
        init: function (e) {
            t.superclass.init.call(this, e), this.beam = null, this.stem_extension = 0, this.setStemDirection(e.stem_direction)
        },
        getStemLength: function () {
            return e.HEIGHT + this.stem_extension
        },
        getStemMinumumLength: function () {
            var t = "w" == this.duration || "1" == this.duration ? 0 : 20;
            switch (this.duration) {
            case "8":
                null == this.beam && (t = 35);
                break;
            case "16":
                t = null == this.beam ? 35 : 25;
                break;
            case "32":
                t = null == this.beam ? 45 : 35;
                break;
            case "64":
                t = null == this.beam ? 50 : 40;
                break;
            case "128":
                t = null == this.beam ? 55 : 45
            }
            return t
        },
        getStemDirection: function () {
            return this.stem_direction
        },
        setStemDirection: function (t) {
            if (t || (t = e.UP), t != e.UP && t != e.DOWN) throw new Vex.RERR("BadArgument", "Invalid stem direction: " + t);
            return this.stem_direction = t, this.beam = null, this.preFormatted && this.preFormat(), this
        },
        getStemX: function () {
            var t = this.getAbsoluteX() + this.x_shift,
                i = this.getAbsoluteX() + this.x_shift + this.glyph.head_width,
                s = this.stem_direction == e.DOWN ? t : i;
            return s -= e.WIDTH / 2 * this.stem_direction
        },
        setStemLength: function (t) {
            return this.stem_extension = t - e.HEIGHT, this
        },
        getStemExtents: function () {
            if (!this.ys || 0 === this.ys.length) throw new Vex.RERR("NoYValues", "Can't get top stem Y when note has no Y values.");
            for (var t = this.ys[0], i = this.ys[0], s = e.HEIGHT + this.stem_extension, n = 0; n < this.ys.length; ++n) {
                var o = this.ys[n] + s * -this.stem_direction;
                this.stem_direction == e.DOWN ? (t = t > o ? t : o, i = i < this.ys[n] ? i : this.ys[n]) : (t = o > t ? t : o, i = i > this.ys[n] ? i : this.ys[n]), ("s" == this.noteType || "x" == this.noteType) && (t -= 7 * this.stem_direction, i -= 7 * this.stem_direction)
            }
            return {
                topY: t,
                baseY: i
            }
        },
        setBeam: function (t) {
            return this.beam = t, this
        },
        getYForTopText: function (t) {
            var e = this.getStemExtents();
            return this.hasStem() ? Vex.Min(this.stave.getYForTopText(t), e.topY - this.render_options.annotation_spacing * (t + 1)) : this.stave.getYForTopText(t)
        },
        getYForBottomText: function (t) {
            var e = this.getStemExtents();
            return this.hasStem() ? Vex.Max(this.stave.getYForTopText(t), e.baseY + this.render_options.annotation_spacing * t) : this.stave.getYForBottomText(t)
        },
        drawStem: function (t) {
            if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
            this.stem = new e(t), this.stem.setContext(this.context).draw()
        }
    }), t
}();
Vex.Flow.StaveNote = function () {
    var t = function (t) {
        arguments.length > 0 && this.init(t)
    }, e = Vex.Flow.Stem,
        i = Vex.Flow.NoteHead;
    return t.STEM_UP = e.UP, t.STEM_DOWN = e.DOWN, Vex.Inherit(t, Vex.Flow.StemmableNote, {
        init: function (i) {
            if (t.superclass.init.call(this, i), this.keys = i.keys, this.clef = i.clef, this.beam = null, this.glyph = Vex.Flow.durationToGlyph(this.duration, this.noteType), !this.glyph) throw new Vex.RuntimeError("BadArguments", "Invalid note initialization data (No glyph found): " + JSON.stringify(i));
            this.notes_displaced = !1, this.dot_shiftY = 0, this.keyProps = [], this.keyStyles = [], this.displaced = !1;
            for (var s = null, o = 0; o < this.keys.length; ++o) {
                var n = this.keys[o];
                this.glyph.rest && (this.glyph.position = n);
                var r = Vex.Flow.keyProperties(n, this.clef);
                if (!r) throw new Vex.RuntimeError("BadArguments", "Invalid key for note properties: " + n);
                var h = r.line;
                null == s ? s = h : .5 == Math.abs(s - h) && (this.displaced = !0, r.displaced = !0, this.keyProps.length > 0 && (this.keyProps[o - 1].displaced = !0)), s = h, this.keyProps.push(r), this.keyStyles.push(null)
            }
            switch (this.keyProps.sort(function (t, e) {
                return t.line - e.line
            }), this.modifiers = [], Vex.Merge(this.render_options, {
                glyph_font_scale: 35,
                stroke_px: 3,
                stroke_spacing: 10
            }), this.duration) {
            case "w":
            case "1":
                this.stem_extension = -1 * e.HEIGHT;
                break;
            case "32":
                this.stem_extension = 10;
                break;
            case "64":
                this.stem_extension = 15;
                break;
            case "128":
                this.stem_extension = 20;
                break;
            default:
                this.stem_extension = 0
            }
            var a;
            i.auto_stem ? (this.min_line = this.keyProps[0].line, a = this.min_line < 3 ? 1 : -1, this.setStemDirection(a)) : this.setStemDirection(i.stem_direction), this.calcExtraPx()
        },
        getCategory: function () {
            return "stavenotes"
        },
        getBoundingBox: function () {
            if (!this.preFormatted) throw new Vex.RERR("UnformattedNote", "Can't call getBoundingBox on an unformatted note.");
            var t = this.getMetrics(),
                e = t.width,
                i = this.getAbsoluteX() - t.modLeftPx - t.extraLeftPx,
                s = 0,
                o = 0,
                n = this.getStave().getSpacingBetweenLines() / 2,
                r = 2 * n;
            if (this.isRest()) {
                var h = this.ys[0];
                "w" == this.duration || "h" == this.duration || "1" == this.duration || "2" == this.duration ? (s = h - n, o = h + n) : (s = h - this.glyph.line_above * r, o = h + this.glyph.line_below * r)
            } else if (this.glyph.stem) {
                var a = this.getStemExtents();
                a.baseY += n * this.stem_direction, s = Vex.Min(a.topY, a.baseY), o = Vex.Max(a.topY, a.baseY)
            } else {
                s = null, o = null;
                for (var l = 0; l < this.ys.length; ++l) {
                    var d = this.ys[l];
                    0 === l ? (s = d, o = d) : (s = Vex.Min(d, s), o = Vex.Max(d, o)), s -= n, o += n
                }
            }
            return new Vex.Flow.BoundingBox(i, s, e, o - s)
        },
        getLineNumber: function (t) {
            if (!this.keyProps.length) throw new Vex.RERR("NoKeyProps", "Can't get bottom note line, because note is not initialized properly.");
            for (var e = this.keyProps[0].line, i = 0; i < this.keyProps.length; i++) {
                var s = this.keyProps[i].line;
                t && (s > e ? e = s : e > s && (e = s))
            }
            return e
        },
        isRest: function () {
            return this.glyph.rest
        },
        hasStem: function () {
            return this.glyph.stem
        },
        getYForTopText: function (t) {
            var e = this.getStemExtents();
            return Vex.Min(this.stave.getYForTopText(t), e.topY - this.render_options.annotation_spacing * (t + 1))
        },
        getYForBottomText: function (t) {
            var e = this.getStemExtents();
            return Vex.Max(this.stave.getYForTopText(t), e.baseY + this.render_options.annotation_spacing * t)
        },
        setStave: function (t) {
            var e = Vex.Flow.StaveNote.superclass;
            e.setStave.call(this, t);
            for (var i = [], s = 0; s < this.keyProps.length; ++s) {
                var o = this.keyProps[s].line;
                i.push(this.stave.getYForNote(o))
            }
            return this.setYs(i)
        },
        getKeys: function () {
            return this.keys
        },
        getKeyProps: function () {
            return this.keyProps
        },
        isDisplaced: function () {
            return this.notes_displaced
        },
        setNoteDisplaced: function (t) {
            return this.notes_displaced = t, this
        },
        getTieRightX: function () {
            var t = this.getAbsoluteX();
            return t += this.glyph.head_width + this.x_shift + this.extraRightPx, this.modifierContext && (t += this.modifierContext.getExtraRightPx()), t
        },
        getTieLeftX: function () {
            var t = this.getAbsoluteX();
            return t += this.x_shift - this.extraLeftPx
        },
        getLineForRest: function () {
            var t = this.keyProps[0].line;
            if (this.keyProps.length > 1) {
                var e = this.keyProps[this.keyProps.length - 1].line,
                    i = Vex.Max(t, e),
                    s = Vex.Min(t, e);
                t = Vex.MidLine(i, s)
            }
            return t
        },
        getModifierStartXY: function (t, e) {
            if (!this.preFormatted) throw new Vex.RERR("UnformattedNote", "Can't call GetModifierStartXY on an unformatted note");
            if (0 === this.ys.length) throw new Vex.RERR("NoYValues", "No Y-Values calculated for this note.");
            var i = 0;
            return t == Vex.Flow.Modifier.Position.LEFT ? i = -2 : t == Vex.Flow.Modifier.Position.RIGHT ? i = this.glyph.head_width + this.x_shift + 2 : (t == Vex.Flow.Modifier.Position.BELOW || t == Vex.Flow.Modifier.Position.ABOVE) && (i = this.glyph.head_width / 2), {
                x: this.getAbsoluteX() + i,
                y: this.ys[e]
            }
        },
        getGlyph: function () {
            return this.glyph
        },
        setKeyStyle: function (t, e) {
            return this.keyStyles[t] = e, this
        },
        applyKeyStyle: function (t, e) {
            t && (t.shadowColor && e.setShadowColor(t.shadowColor), t.shadowBlur && e.setShadowBlur(t.shadowBlur), t.fillStyle && e.setFillStyle(t.fillStyle), t.strokeStyle && e.setStrokeStyle(t.strokeStyle))
        },
        addToModifierContext: function (t) {
            this.setModifierContext(t);
            for (var e = 0; e < this.modifiers.length; ++e) this.modifierContext.addModifier(this.modifiers[e]);
            return this.modifierContext.addModifier(this), this.setPreFormatted(!1), this
        },
        addModifier: function (t, e) {
            return e.setNote(this), e.setIndex(t), this.modifiers.push(e), this.setPreFormatted(!1), this
        },
        addAccidental: function (t, e) {
            return this.addModifier(t, e)
        },
        addArticulation: function (t, e) {
            return this.addModifier(t, e)
        },
        addAnnotation: function (t, e) {
            return this.addModifier(t, e)
        },
        addDot: function (t) {
            var e = new Vex.Flow.Dot;
            return e.setDotShiftY(this.glyph.dot_shiftY), this.dots++, this.addModifier(t, e)
        },
        addDotToAll: function () {
            for (var t = 0; t < this.keys.length; ++t) this.addDot(t);
            return this
        },
        getAccidentals: function () {
            return this.modifierContext.getModifiers("accidentals")
        },
        getDots: function () {
            return this.modifierContext.getModifiers("dots")
        },
        getVoiceShiftWidth: function () {
            return this.glyph.head_width * (this.displaced ? 2 : 1)
        },
        calcExtraPx: function () {
            this.setExtraLeftPx(this.displaced && -1 == this.stem_direction ? this.glyph.head_width : 0), this.setExtraRightPx(this.displaced && 1 == this.stem_direction ? this.glyph.head_width : 0)
        },
        preFormat: function () {
            if (!this.preFormatted) {
                this.modifierContext && this.modifierContext.preFormat();
                var t = this.glyph.head_width + this.extraLeftPx + this.extraRightPx;
                this.glyph.flag && null == this.beam && 1 == this.stem_direction && (t += this.glyph.head_width), this.setWidth(t), this.setPreFormatted(!0)
            }
        },
        draw: function () {
            function t(t) {
                null != l && (C = l), s.fillRect(C - E.render_options.stroke_px, t, C + h.head_width - C + 2 * E.render_options.stroke_px, 1)
            }
            if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
            if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");
            if (0 === this.ys.length) throw new Vex.RERR("NoYValues", "Can't draw note without Y values.");
            var s = this.context,
                o = this.getAbsoluteX() + this.x_shift,
                n = this.ys,
                r = this.keys,
                h = this.glyph,
                a = this.stem_direction,
                l = null,
                d = null == this.beam,
                f = null == this.beam,
                u = o,
                c = o + h.head_width,
                p = null,
                x = null,
                g = null,
                y = null,
                _ = !1,
                m = 0,
                w = r.length,
                v = 1;
            a == e.DOWN && (m = r.length - 1, w = -1, v = -1);
            var k, P, S, V = 5,
                R = 1;
            for (k = m; k != w; k += v) {
                var M = this.keyProps[k];
                P = this.keyStyles[k], S = M.line, V = S > V ? S : V, R = R > S ? S : R, null == g ? g = S : (y = Math.abs(g - S), 0 === y || .5 === y ? _ = !_ : (_ = !1, l = o)), g = S;
                var F = n[k];
                (null == p || p > F) && (p = F), (null == x || F > x) && (x = F);
                var b = new i({
                    x: u,
                    y: F,
                    note_type: this.noteType,
                    custom_glyph_code: M.code,
                    x_shift: M.shift_right,
                    duration: this.duration,
                    displaced: _,
                    stem_direction: a,
                    key_style: P,
                    glyph_font_scale: this.render_options.glyph_font_scale
                }),
                    C = b.getAbsoluteX();
                if (b.setContext(this.context).draw(), 0 >= S || S >= 6) {
                    var N = F,
                        Y = Math.floor(S);
                    0 > S && Y - S == -.5 ? N -= 5 : S > 6 && Y - S == -.5 && (N += 5), s.fillRect(C - this.render_options.stroke_px, N, C + h.head_width - C + 2 * this.render_options.stroke_px, 1)
                }
            }
            var E = this;
            for (S = 6; V >= S; ++S) t(this.stave.getYForNote(S));
            for (S = 0; S >= R; --S) t(this.stave.getYForNote(S));
            if (this.hasStem() && d) {
                var T = 0;
                ("v95" == h.code_head || "v3e" == h.code_head) && (T = -4), this.drawStem({
                    x_begin: u,
                    x_end: c,
                    y_top: p,
                    y_bottom: x,
                    y_extend: T,
                    stem_extension: this.stem_extension,
                    stem_direction: a
                })
            }
            if (h.flag && f) {
                var B, A, D, L = this.stem.getHeight();
                a == e.DOWN ? (B = u + 1, A = p - L, D = h.code_flag_downstem) : (B = c + 1, A = x - L, D = h.code_flag_upstem), Vex.Flow.renderGlyph(s, B, A, this.render_options.glyph_font_scale, D)
            }
            for (k = 0; k < this.modifiers.length; ++k) {
                var X = this.modifiers[k];
                P = this.keyStyles[X.getIndex()], P && (s.save(), this.applyKeyStyle(P, s)), X.setContext(s), X.draw(), P && s.restore()
            }
        }
    }), t
}();
Vex.Flow.TabNote = function () {
    function t(t, i) {
        arguments.length > 0 && this.init(t, i)
    }
    var i = Vex.Flow.Stem;
    return Vex.Inherit(t, Vex.Flow.StemmableNote, {
        init: function (t, e) {
            var s = Vex.Flow.TabNote.superclass;
            if (s.init.call(this, t), this.positions = t.positions, Vex.Merge(this.render_options, {
                glyph_font_scale: 30,
                draw_stem: e,
                draw_dots: e
            }), this.glyph = Vex.Flow.durationToGlyph(this.duration, this.noteType), !this.glyph) throw new Vex.RuntimeError("BadArguments", "Invalid note initialization data (No glyph found): " + JSON.stringify(t));
            switch (this.duration) {
            case "w":
            case "1":
                this.stem_extension = -1 * i.HEIGHT;
                break;
            case "32":
                this.stem_extension = 5;
                break;
            case "64":
                this.stem_extension = 10;
                break;
            case "128":
                this.stem_extension = 15;
                break;
            default:
                this.stem_extension = 0
            }
            this.ghost = !1, this.updateWidth()
        },
        getCategory: function () {
            return "tabnotes"
        },
        setGhost: function (t) {
            return this.ghost = t, this.updateWidth(), this
        },
        hasStem: function () {
            return this.render_options.draw_stem
        },
        getGlyph: function () {
            return this.glyph
        },
        addDot: function () {
            var t = new Vex.Flow.Dot;
            return this.dots++, this.addModifier(t, 0)
        },
        updateWidth: function () {
            this.glyphs = [], this.width = 0;
            for (var t = 0; t < this.positions.length; ++t) {
                var i = this.positions[t].fret;
                this.ghost && (i = "(" + i + ")");
                var e = Vex.Flow.tabToGlyph(i);
                this.glyphs.push(e), this.width = e.width > this.width ? e.width : this.width
            }
        },
        setStave: function (t) {
            var i = Vex.Flow.TabNote.superclass;
            i.setStave.call(this, t), this.context = t.context, this.width = 0;
            var e;
            if (this.context)
                for (e = 0; e < this.glyphs.length; ++e) {
                    var s = "" + this.glyphs[e].text;
                    "X" != s.toUpperCase() && (this.glyphs[e].width = this.context.measureText(s).width), this.width = this.glyphs[e].width > this.width ? this.glyphs[e].width : this.width
                }
            var h = [];
            for (e = 0; e < this.positions.length; ++e) {
                var o = this.positions[e].str;
                h.push(this.stave.getYForLine(o - 1))
            }
            return this.setYs(h)
        },
        getPositions: function () {
            return this.positions
        },
        addToModifierContext: function (t) {
            this.setModifierContext(t);
            for (var i = 0; i < this.modifiers.length; ++i) this.modifierContext.addModifier(this.modifiers[i]);
            return this.modifierContext.addModifier(this), this.preFormatted = !1, this
        },
        getTieRightX: function () {
            var t = this.getAbsoluteX(),
                i = this.glyph.head_width;
            return t += i / 2, t += -this.width / 2 + this.width + 2
        },
        getTieLeftX: function () {
            var t = this.getAbsoluteX(),
                i = this.glyph.head_width;
            return t += i / 2, t -= this.width / 2 + 2
        },
        getModifierStartXY: function (t, i) {
            if (!this.preFormatted) throw new Vex.RERR("UnformattedNote", "Can't call GetModifierStartXY on an unformatted note");
            if (0 === this.ys.length) throw new Vex.RERR("NoYValues", "No Y-Values calculated for this note.");
            var e = 0;
            if (t == Vex.Flow.Modifier.Position.LEFT) e = -2;
            else if (t == Vex.Flow.Modifier.Position.RIGHT) e = this.width + 2;
            else if (t == Vex.Flow.Modifier.Position.BELOW || t == Vex.Flow.Modifier.Position.ABOVE) {
                var s = this.glyph.head_width;
                e = s / 2
            }
            return {
                x: this.getAbsoluteX() + e,
                y: this.ys[i]
            }
        },
        preFormat: function () {
            this.preFormatted || (this.modifierContext && this.modifierContext.preFormat(), this.setPreFormatted(!0))
        },
        getStemX: function () {
            return this.getAbsoluteX() + this.x_shift + this.glyph.head_width / 2
        },
        getStemY: function () {
            var t = -.7,
                e = this.stave.options.num_lines - .3,
                s = i.UP === this.stem_direction ? t : e;
            return this.stave.getYForLine(s)
        },
        getStemExtents: function () {
            var t = this.getStemY(),
                e = t + i.HEIGHT * -this.stem_direction;
            return {
                topY: e,
                baseY: t
            }
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
            if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");
            if (0 === this.ys.length) throw new Vex.RERR("NoYValues", "Can't draw note without Y values.");
            var t, e, s = this.context,
                h = this.getAbsoluteX(),
                o = this.ys,
                n = null == this.beam && this.render_options.draw_stem,
                r = null == this.beam && n;
            for (e = 0; e < this.positions.length; ++e) {
                t = o[e];
                var a = this.glyphs[e],
                    d = this.glyph.head_width,
                    l = h + d / 2 - a.width / 2;
                if (s.clearRect(l - 2, t - 3, a.width + 4, 6), a.code) Vex.Flow.renderGlyph(s, l, t + 5 + a.shift_y, this.render_options.glyph_font_scale, a.code);
                else {
                    var f = a.text.toString();
                    s.fillText(f, l, t + 5)
                }
            }
            var g = this.getStemX(),
                u = this.getStemY();
            if (n && this.drawStem({
                x_begin: g,
                x_end: g,
                y_top: u,
                y_bottom: u,
                y_extend: 0,
                stem_extension: this.stem_extension,
                stem_direction: this.stem_direction
            }), this.glyph.flag && r) {
                var w, p = this.getStemX() + 1,
                    c = this.getStemY() - this.stem.getHeight();
                w = this.stem_direction == i.DOWN ? this.glyph.code_flag_downstem : this.glyph.code_flag_upstem, Vex.Flow.renderGlyph(s, p, c, this.render_options.glyph_font_scale, w)
            }
            this.modifiers.forEach(function (t) {
                ("dots" !== t.getCategory() || this.render_options.draw_dots) && (t.setContext(this.context), t.draw())
            }, this)
        }
    }), t
}();
Vex.Flow.ClefNote = function () {
    function t(t) {
        this.init(t)
    }
    return Vex.Inherit(t, Vex.Flow.Note, {
        init: function (e) {
            t.superclass.init.call(this, {
                duration: "b"
            }), this.setClef(e), this.ignore_ticks = !0
        },
        setClef: function (t) {
            return this.clef = Vex.Flow.Clef.types[t], this.glyph = new Vex.Flow.Glyph(this.clef.code, this.clef.point), this.setWidth(this.glyph.getMetrics().width), this
        },
        getClef: function () {
            return this.clef
        },
        setStave: function (t) {
            var e = Vex.Flow.ClefNote.superclass;
            e.setStave.call(this, t)
        },
        getBoundingBox: function () {
            return new Vex.Flow.BoundingBox(0, 0, 0, 0)
        },
        addToModifierContext: function () {
            return this
        },
        preFormat: function () {
            return this.setPreFormatted(!0), this
        },
        draw: function () {
            if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");
            this.glyph.getContext() || this.glyph.setContext(this.context), this.glyph.setStave(this.stave), this.glyph.setYShift(this.stave.getYForLine(this.clef.line) - this.stave.getYForGlyphs()), this.glyph.renderToStave(this.getAbsoluteX())
        }
    }), t
}();
Vex.Flow.TimeSigNote = function () {
    function t(t, i) {
        arguments.length > 0 && this.init(t, i)
    }
    return Vex.Inherit(t, Vex.Flow.Note, {
        init: function (i, e) {
            t.superclass.init.call(this, {
                duration: "b"
            });
            var s = new Vex.Flow.TimeSignature(i, e);
            this.timeSig = s.getTimeSig(), this.setWidth(this.timeSig.glyph.getMetrics().width), this.ignore_ticks = !0
        },
        setStave: function (t) {
            var i = Vex.Flow.TimeSigNote.superclass;
            i.setStave.call(this, t)
        },
        getBoundingBox: function () {
            return new Vex.Flow.BoundingBox(0, 0, 0, 0)
        },
        addToModifierContext: function () {
            return this
        },
        preFormat: function () {
            return this.setPreFormatted(!0), this
        },
        draw: function () {
            if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");
            this.timeSig.glyph.getContext() || this.timeSig.glyph.setContext(this.context), this.timeSig.glyph.setStave(this.stave), this.timeSig.glyph.setYShift(this.stave.getYForLine(this.timeSig.line) - this.stave.getYForGlyphs()), this.timeSig.glyph.renderToStave(this.getAbsoluteX())
        }
    }), t
}();
Vex.Flow.Beam = function () {
    function t(t, e) {
        arguments.length > 0 && this.init(t, e)
    }
    return t.prototype = {
        init: function (t, e) {
            if (!t || t == []) throw new Vex.RuntimeError("BadArguments", "No notes provided for beam.");
            if (1 == t.length) throw new Vex.RuntimeError("BadArguments", "Too few notes for beam.");
            if (this.unbeamable = !1, !t[0].hasStem() || !t[t.length - 1].hasStem()) return this.unbeamable = !0, void 0;
            if (this.stem_direction = t[0].getStemDirection(), this.ticks = t[0].getIntrinsicTicks(), this.ticks >= Vex.Flow.durationToTicks("4")) throw new Vex.RuntimeError("BadArguments", "Beams can only be applied to notes shorter than a quarter note.");
            var n, i;
            if (!e)
                for (n = 1; n < t.length; ++n)
                    if (i = t[n], i.hasStem() && i.getStemDirection() != this.stem_direction) throw new Vex.RuntimeError("BadArguments", "Notes in a beam all have the same stem direction");
            var o = -1;
            if (e && "stavenotes" === t[0].getCategory()) {
                for (this.min_line = 1e3, n = 0; n < t.length; ++n) i = t[n], i.getKeyProps && (this.min_line = Vex.Min(i.getKeyProps()[0].line, this.min_line));
                this.min_line < 3 && (o = 1)
            } else if (e && "tabnotes" === t[0].getCategory()) {
                var s = t.reduce(function (t, e) {
                    return t + e.stem_direction
                }, 0);
                o = s > -1 ? 1 : -1
            }
            for (n = 0; n < t.length; ++n) i = t[n], e && (i.setStemDirection(o), this.stem_direction = o), i.setBeam(this);
            this.notes = t, this.beam_count = this.notes[0].getGlyph().beam_count, this.render_options = {
                beam_width: 5,
                max_slope: .25,
                min_slope: -.25,
                slope_iterations: 20,
                slope_cost: 25
            }
        },
        setContext: function (t) {
            return this.context = t, this
        },
        getNotes: function () {
            return this.notes
        },
        draw: function () {
            function t(t) {
                return h + (t - c) * _
            }

            function e(t) {
                for (var e, n = [], i = !1, o = 0; o < V.notes.length; ++o) {
                    var s = V.notes[o],
                        r = s.getIntrinsicTicks();
                    r < Vex.Flow.durationToTicks(t) ? i ? (e = n[n.length - 1], e.end = s.getStemX()) : (n.push({
                        start: s.getStemX(),
                        end: null
                    }), i = !0) : (i && (e = n[n.length - 1], null == e.end && (e.end = e.start + 10)), i = !1)
                }
                return i === !0 && (e = n[n.length - 1], null == e.end && (e.end = e.start - 10)), n
            }
            if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
            if (!this.unbeamable) {
                for (var n, i, o, s = this.notes[0], r = this.notes[this.notes.length - 1], h = s.getStemExtents().topY, a = r.getStemExtents().topY, c = s.getStemX(), u = this.render_options.beam_width * this.stem_direction, l = (this.render_options.max_slope - this.render_options.min_slope) / this.render_options.slope_iterations, m = Number.MAX_VALUE, f = 0, d = 0, _ = this.render_options.min_slope; _ <= this.render_options.max_slope; _ += l) {
                    var g = 0,
                        p = 0;
                    for (i = 1; i < this.notes.length; ++i) {
                        o = this.notes[i], n = o.getStemX();
                        var x = o.getStemExtents().topY,
                            v = t(n) + p;
                        if (x * this.stem_direction < v * this.stem_direction) {
                            var w = Math.abs(x - v);
                            p += w * -this.stem_direction, g += w * i
                        } else g += (x - v) * this.stem_direction
                    }
                    var b = this.render_options.slope_cost * Math.abs(_) + Math.abs(g);
                    m > b && (m = b, f = _, d = p)
                }
                for (_ = f, i = 0; i < this.notes.length; ++i)
                    if (o = this.notes[i], o.hasStem()) {
                        n = o.getStemX();
                        var T = o.getStemExtents(),
                            S = T.baseY;
                        S += this.stem_direction * o.glyph.stem_offset;
                        var E = Vex.Flow.STEM_WIDTH;
                        o.drawStem({
                            x_begin: n,
                            x_end: n,
                            y_top: S,
                            y_bottom: S,
                            y_extend: E,
                            stem_extension: Math.abs(S - (t(n) + d)) - Vex.Flow.Stem.HEIGHT,
                            stem_direction: this.stem_direction
                        })
                    }
                var V = this,
                    k = ["4", "8", "16", "32"];
                for (i = 0; i < k.length; ++i) {
                    for (var y = k[i], B = e(y), F = 0; F < B.length; ++F) {
                        var M = B[F],
                            A = M.start,
                            I = t(A),
                            C = M.end + Vex.Flow.STEM_WIDTH / 2,
                            R = t(C);
                        this.context.beginPath(), this.context.moveTo(A, I + d), this.context.lineTo(A, I + u + d), this.context.lineTo(C + 1, R + u + d), this.context.lineTo(C + 1, R + d), this.context.closePath(), this.context.fill()
                    }
                    h += 1.5 * u, a += 1.5 * u
                }
                return !0
            }
        }
    }, t.applyAndGetBeams = function (t, e) {
        function n(t) {
            return t.reduce(function (t, e) {
                return e.getTicks().value() + t
            }, 0)
        }

        function i() {
            var t = [];
            c.forEach(function (e) {
                return t = [], e.shouldIgnoreTicks() ? (l.push(m), m = t, void 0) : (m.push(e), n(m) > u ? (t.push(m.pop()), l.push(m), m = t) : n(m) == u && (l.push(m), m = t), void 0)
            }), m.length > 0 && l.push(m)
        }

        function o() {
            return l.filter(function (t) {
                if (t.length > 1) {
                    var e = !0;
                    return t.forEach(function (t) {
                        t.getIntrinsicTicks() >= Vex.Flow.durationToTicks("4") && (e = !1)
                    }), e
                }
                return !1
            })
        }

        function s() {
            l.forEach(function (t) {
                var e = r(t);
                h(t, e)
            })
        }

        function r(t) {
            if (e) return e;
            var n = 0;
            return t.forEach(function (t) {
                t.keyProps && t.keyProps.forEach(function (t) {
                    n += t.line - 3
                })
            }), n > 0 ? -1 : 1
        }

        function h(t, e) {
            t.forEach(function (t) {
                t.hasStem() && t.setStemDirection(e)
            })
        }

        function a() {
            return l.filter(function (t) {
                return t[0] ? t[0].tuplet : void 0
            })
        }
        var c = t.tickables,
            u = 4096,
            l = [],
            m = [];
        i(), s();
        var f = o(),
            d = a(),
            _ = [];
        return f.forEach(function (t) {
            _.push(new Vex.Flow.Beam(t))
        }), d.forEach(function (t) {
            var e = t[0],
                n = e.tuplet;
            e.beam && n.setBracketed(!1), -1 == e.stem_direction && n.setTupletLocation(Vex.Flow.Tuplet.LOCATION_BOTTOM)
        }), _
    }, t
}();
Vex.Flow.Voice = function () {
    function t(t) {
        arguments.length > 0 && this.init(t)
    }
    return t.Mode = {
        STRICT: 1,
        SOFT: 2,
        FULL: 3
    }, t.prototype = {
        init: function (t) {
            this.time = t, this.totalTicks = new Vex.Flow.Fraction(this.time.num_beats * (this.time.resolution / this.time.beat_value), 1), this.resolutionMultiplier = 1, this.tickables = [], this.ticksUsed = new Vex.Flow.Fraction(0, 1), this.smallestTickCount = this.totalTicks.clone(), this.largestTickWidth = 0, this.stave = null, this.boundingBox = null, this.mode = Vex.Flow.Voice.Mode.STRICT, this.voiceGroup = null
        },
        getTotalTicks: function () {
            return this.totalTicks
        },
        getTicksUsed: function () {
            return this.ticksUsed
        },
        getLargestTickWidth: function () {
            return this.largestTickWidth
        },
        getSmallestTickCount: function () {
            return this.smallestTickCount
        },
        getTickables: function () {
            return this.tickables
        },
        getMode: function () {
            return this.mode
        },
        setMode: function (t) {
            return this.mode = t, this
        },
        getResolutionMultiplier: function () {
            return this.resolutionMultiplier
        },
        getActualResolution: function () {
            return this.resolutionMultiplier * this.time.resolution
        },
        setStave: function (t) {
            return this.stave = t, this.boundingBox = null, this
        },
        getBoundingBox: function () {
            if (!this.boundingBox) {
                if (!this.stave) throw Vex.RERR("NoStave", "Can't get bounding box without stave.");
                var t = this.stave,
                    i = null;
                this.tickables[0] && (this.tickables[0].setStave(t), i = this.tickables[0].getBoundingBox());
                for (var e = 0; e < this.tickables.length; ++e)
                    if (this.tickables[e].setStave(t), e > 0 && i) {
                        var s = this.tickables[e].getBoundingBox();
                        s && i.mergeWith(s)
                    }
                this.boundingBox = i
            }
            return this.boundingBox
        },
        getVoiceGroup: function () {
            if (!this.voiceGroup) throw new Vex.RERR("NoVoiceGroup", "No voice group for voice.");
            return this.voiceGroup
        },
        setVoiceGroup: function (t) {
            return this.voiceGroup = t, this
        },
        setStrict: function (t) {
            return this.mode = t ? Vex.Flow.Voice.Mode.STRICT : Vex.Flow.Voice.Mode.SOFT, this
        },
        isComplete: function () {
            return this.mode == Vex.Flow.Voice.Mode.STRICT || this.mode == Vex.Flow.Voice.Mode.FULL ? this.ticksUsed.equals(this.totalTicks) : !0
        },
        addTickable: function (t) {
            if (!t.shouldIgnoreTicks()) {
                var i = t.getTicks();
                if (this.ticksUsed.add(i), (this.mode == Vex.Flow.Voice.Mode.STRICT || this.mode == Vex.Flow.Voice.Mode.FULL) && this.ticksUsed.value() > this.totalTicks.value()) throw this.totalTicks.subtract(i), new Vex.RERR("BadArgument", "Too many ticks.");
                i.value() < this.smallestTickCount.value() && (this.smallestTickCount = i.clone()), this.resolutionMultiplier = this.ticksUsed.denominator, this.totalTicks.add(0, this.ticksUsed.denominator)
            }
            return this.tickables.push(t), t.setVoice(this), this
        },
        addTickables: function (t) {
            for (var i = 0; i < t.length; ++i) this.addTickable(t[i]);
            return this
        },
        draw: function (t, i) {
            var e = null;
            this.tickables[0] && (this.tickables[0].setStave(i), e = this.tickables[0].getBoundingBox());
            for (var s = 0; s < this.tickables.length; ++s) {
                if (this.tickables[s].setStave(i), s > 0 && e) {
                    var o = this.tickables[s].getBoundingBox();
                    o && e.mergeWith(o)
                }
                this.tickables[s].setContext(t), this.tickables[s].setStave(i), this.tickables[s].draw()
            }
            this.boundingBox = e
        }
    }, t
}();
Vex.Flow.VoiceGroup = function () {
    function i() {
        this.init()
    }
    return i.prototype = {
        init: function () {
            this.voices = [], this.modifierContexts = []
        },
        getVoices: function () {
            return this.voices
        },
        getModifierContexts: function () {
            return this.modifierContexts
        },
        addVoice: function (i) {
            if (!i) throw new Vex.RERR("BadArguments", "Voice cannot be null.");
            this.voices.push(i), i.setVoiceGroup(this)
        }
    }, i
}();
Vex.Flow.Modifier = function () {
    function t() {
        this.init()
    }
    return t.Position = {
        LEFT: 1,
        RIGHT: 2,
        ABOVE: 3,
        BELOW: 4
    }, t.prototype = {
        init: function () {
            this.width = 0, this.context = null, this.note = null, this.index = null, this.text_line = 0, this.position = t.Position.LEFT, this.modifier_context = null, this.x_shift = 0, this.y_shift = 0
        },
        getCategory: function () {
            return "none"
        },
        getWidth: function () {
            return this.width
        },
        setWidth: function (t) {
            return this.width = t, this
        },
        getNote: function () {
            return this.note
        },
        setNote: function (t) {
            return this.note = t, this
        },
        getIndex: function () {
            return this.index
        },
        setIndex: function (t) {
            return this.index = t, this
        },
        getContext: function () {
            return this.context
        },
        setContext: function (t) {
            return this.context = t, this
        },
        getModifierContext: function () {
            return this.modifier_context
        },
        setModifierContext: function (t) {
            return this.modifier_context = t, this
        },
        setTextLine: function (t) {
            return this.text_line = t, this
        },
        setYShift: function (t) {
            return this.y_shift = t, this
        },
        setXShift: function (i) {
            this.x_shift = 0, this.position == t.Position.LEFT ? this.x_shift -= i : this.x_shift += i
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
            throw new Vex.RERR("MethodNotImplemented", "Draw() not implemented for this modifier.")
        }
    }, t
}();
Vex.Flow.ModifierContext = function () {
    function t() {
        this.modifiers = {}, this.preFormatted = !1, this.width = 0, this.spacing = 0, this.state = {
            left_shift: 0,
            right_shift: 0,
            text_line: 0
        }
    }
    var e = function (t, e, i) {
        if (Vex.Debug) {
            var s, n = 0;
            1 == i ? (s = e.isrest ? 0 : .5, n = e.max_line - t.min_line, n += s) : (s = e.isrest ? 0 : .5, n = e.min_line - t.max_line, n -= s), t.line += n, t.max_line += n, t.min_line += n, t.note.keyProps[0].line += n
        }
    }, i = function (t, e, i) {
            var s = t.line - Vex.MidLine(e.min_line, i.max_line);
            t.note.keyProps[0].line -= s, t.line -= s, t.max_line -= s, t.min_line -= s
        };
    return t.prototype = {
        addModifier: function (t) {
            var e = t.getCategory();
            return this.modifiers[e] || (this.modifiers[e] = []), this.modifiers[e].push(t), t.setModifierContext(this), this.preFormatted = !1, this
        },
        getModifiers: function (t) {
            return this.modifiers[t]
        },
        getWidth: function () {
            return this.width
        },
        getExtraLeftPx: function () {
            return this.state.left_shift
        },
        getExtraRightPx: function () {
            return this.state.right_shift
        },
        getMetrics: function () {
            if (!this.formatted) throw new Vex.RERR("UnformattedModifier", "Unformatted modifier has no metrics.");
            return {
                width: this.state.left_shift + this.state.right_shift + this.spacing,
                spacing: this.spacing,
                extra_left_px: this.state.left_shift,
                extra_right_px: this.state.right_shift
            }
        },
        formatNotes: function () {
            var t = this.modifiers.stavenotes;
            if (!t || t.length < 2) return this;
            if (null != t[0].getStave()) return this.formatNotesByY(t);
            Vex.Assert(t.length < 4, "Got more than three notes in Vex.Flow.ModifierContext.formatNotes!");
            for (var s = [], n = 0; n < t.length; n++) {
                var r, h = t[n].getKeyProps(),
                    a = h[0].line,
                    o = h[h.length - 1].line,
                    f = t[n].getStemDirection(),
                    l = t[n].getStemLength() / 10,
                    g = t[n].getStemMinumumLength() / 10;
                t[n].isRest() ? (r = a + t[n].glyph.line_above, o = a - t[n].glyph.line_below) : (r = 1 == f ? h[h.length - 1].line + l : h[h.length - 1].line, o = 1 == f ? h[0].line : h[0].line - l), s.push({
                    line: h[0].line,
                    max_line: r,
                    min_line: o,
                    isrest: t[n].isRest(),
                    stem_dir: f,
                    stem_max: l,
                    stem_min: g,
                    voice_shift: t[n].getVoiceShiftWidth(),
                    is_displaced: t[n].isDisplaced(),
                    note: t[n]
                })
            }
            var m = s.length,
                _ = s[0],
                u = m > 2 ? s[1] : null,
                d = m > 2 ? s[2] : s[1];
            2 == m && -1 == _.stem_dir && 1 == d.stem_dir && (_ = s[1], d = s[0]);
            var x, v = Math.max(_.voice_shift, d.voice_shift),
                c = 0;
            if (2 == m) {
                var p = _.stem_dir == d.stem_dir ? 0 : .5;
                return _.stem_dir == d.stem_dir && _.min_line <= d.max_line && (_.isrest || (x = Math.abs(_.line - (d.max_line + .5)), x = Math.max(x, _.stem_min), _.min_line = _.line - x, _.note.setStemLength(10 * x))), _.min_line <= d.max_line + p && (_.isrest ? e(_, d, 1) : d.isrest ? e(d, _, -1) : (c = v, _.stem_dir == d.stem_dir ? _.note.setXShift(c + 3) : d.note.setXShift(c))), this
            }
            if (null != u && u.min_line < d.max_line + .5 && (u.isrest || (x = Math.abs(u.line - (d.max_line + .5)), x = Math.max(x, u.stem_min), u.min_line = u.line - x, u.note.setStemLength(10 * x))), u.isrest && !_.isrest && !d.isrest && (_.min_line <= u.max_line || u.min_line <= d.max_line)) {
                var S = u.max_line - u.min_line,
                    y = _.min_line - d.max_line;
                return y > S ? i(u, _, d) : (c = v + 3, u.note.setXShift(c)), this
            }
            return _.isrest && u.isrest && d.isrest ? (e(_, u, 1), e(d, u, -1), this) : (u.isrest && _.isrest && u.min_line <= d.max_line && e(u, d, 1), u.isrest && d.isrest && _.min_line <= u.max_line && e(u, _, -1), _.isrest && _.min_line <= u.max_line && e(_, u, 1), d.isrest && u.min_line <= d.max_line && e(d, u, -1), (!_.isrest && !u.isrest && _.min_line <= u.max_line + .5 || !u.isrest && !d.isrest && u.min_line <= d.max_line) && (c = v + 3, u.note.setXShift(c)), this)
        },
        formatNotesByY: function (t) {
            var e, i = !0;
            for (e = 0; e < t.length; e++) i = i && null != t[e].getStave();
            if (!i) throw new Vex.RERR("Stave Missing", "All notes must have a stave - Vex.Flow.ModifierContext.formatMultiVoice!");
            var s = 0;
            for (e = 0; e < t.length - 1; e++) {
                var n = t[e],
                    r = t[e + 1];
                n.getStemDirection() == Vex.Flow.StaveNote.STEM_DOWN && (n = t[e + 1], r = t[e]);
                var h = n.getKeyProps(),
                    a = r.getKeyProps(),
                    o = n.getStave().getYForLine(h[0].line),
                    f = r.getStave().getYForLine(a[a.length - 1].line),
                    l = n.getStave().options.spacing_between_lines_px;
                Math.abs(o - f) == l / 2 && (s = n.getVoiceShiftWidth(), r.setXShift(s))
            }
            return this.state.right_shift += s, this
        },
        formatDots: function () {
            var t = this.state.right_shift,
                e = this.modifiers.dots,
                i = 1;
            if (!e || 0 === e.length) return this;
            var s, n, r, h, a = [];
            for (s = 0; s < e.length; ++s) {
                n = e[s], r = n.getNote();
                var o;
                "function" == typeof r.getKeyProps ? (o = r.getKeyProps()[n.getIndex()], h = o.displaced ? r.getExtraRightPx() : 0) : (o = {
                    line: .5
                }, h = 0), a.push({
                    line: o.line,
                    shift: h,
                    note: r,
                    dot: n
                })
            }
            a.sort(function (t, e) {
                return e.line - t.line
            });
            var f = t,
                l = 0,
                g = null,
                m = null,
                _ = null,
                u = 0;
            for (s = 0; s < a.length; ++s) {
                n = a[s].dot, r = a[s].note, h = a[s].shift;
                var d = a[s].line;
                (d != g || r != m) && (f = h), r.isRest() || d == g || (.5 == d % 1 ? u = 0 : r.isRest() || (u = .5, null == m || m.isRest() || .5 != g - d ? d + u == _ && (u = -.5) : u = -.5)), n.dot_shiftY += -u, _ = d + u, n.setXShift(f), f += n.getWidth() + i, l = f > l ? f : l, g = d, m = r
            }
            return this.state.right_shift += l, this
        },
        formatAccidentals: function () {
            var t = this.state.left_shift,
                e = this.modifiers.accidentals,
                i = 2;
            if (!e || 0 === e.length) return this;
            var s, n, r, h = [],
                a = !1,
                o = null,
                f = 0;
            for (s = 0; s < e.length; ++s) {
                n = e[s];
                var l = n.getNote(),
                    g = l.getStave(),
                    m = l.getKeyProps()[n.getIndex()];
                if (l != o) {
                    for (var _ = 0; _ < l.keys.length; ++_) r = l.getKeyProps()[_], f = r.displaced ? l.getExtraLeftPx() : f;
                    o = l
                }
                if (null != g) {
                    a = !0;
                    var u = g.options.spacing_between_lines_px,
                        d = g.getYForLine(m.line);
                    h.push({
                        y: d,
                        shift: f,
                        acc: n,
                        lineSpace: u
                    })
                } else h.push({
                    line: m.line,
                    shift: f,
                    acc: n
                })
            }
            if (a) return this.formatAccidentalsByY(h);
            h.sort(function (t, e) {
                return e.line - t.line
            });
            var x = h[0].shift,
                v = 0,
                c = h[0].line;
            for (s = 0; s < h.length; ++s) {
                n = h[s].acc;
                var p = h[s].line,
                    S = h[s].shift;
                c - 3 > p && (c = p, x = S), n.setXShift(t + x), x += n.getWidth() + i, v = x > v ? x : v
            }
            return this.state.left_shift += v, this
        },
        formatAccidentalsByY: function (t) {
            var e = this.state.left_shift,
                i = 2;
            t.sort(function (t, e) {
                return e.y - t.y
            });
            for (var s = t[0].shift, n = 0, r = t[0].y, h = 0; h < t.length; ++h) {
                var a = t[h].acc,
                    o = t[h].y,
                    f = t[h].shift;
                r - o > 3 * t[h].lineSpace && (r = o, s = f), a.setXShift(s + e), s += a.getWidth() + i, n = s > n ? s : n
            }
            return this.state.left_shift += n, this
        },
        formatStrokes: function () {
            var t = this.state.left_shift,
                e = this.modifiers.strokes,
                i = 0;
            if (!e || 0 === e.length) return this;
            var s, n, r, h = [];
            for (s = 0; s < e.length; ++s) {
                n = e[s];
                var a, o = n.getNote();
                o instanceof Vex.Flow.StaveNote ? (a = o.getKeyProps()[n.getIndex()], r = a.displaced ? o.getExtraLeftPx() : 0, h.push({
                    line: a.line,
                    shift: r,
                    str: n
                })) : (a = o.getPositions()[n.getIndex()], h.push({
                    line: a.str,
                    shift: 0,
                    str: n
                }))
            }
            var f = t,
                l = 0;
            for (s = 0; s < h.length; ++s) n = h[s].str, r = h[s].shift, n.setXShift(f + r), l = Math.max(n.getWidth() + i, l);
            return this.state.left_shift += l, this
        },
        formatStringNumbers: function () {
            var t = this.state.left_shift,
                e = this.state.right_shift,
                i = this.modifiers.stringnumber,
                s = 1;
            if (!i || 0 === i.length) return this;
            var n, r, h, a, o, f = [],
                l = null,
                g = 0,
                m = 0;
            for (n = 0; n < i.length; ++n)
                for (r = i[n], h = r.getNote(), n = 0; n < i.length; ++n) {
                    r = i[n], h = r.getNote(), a = r.getPosition();
                    var _ = h.getKeyProps()[r.getIndex()];
                    if (h != l) {
                        for (var u = 0; u < h.keys.length; ++u) o = h.getKeyProps()[u], 0 === t && (g = o.displaced ? h.getExtraLeftPx() : g), 0 === e && (m = o.displaced ? h.getExtraRightPx() : m);
                        l = h
                    }
                    f.push({
                        line: _.line,
                        pos: a,
                        shiftL: g,
                        shiftR: m,
                        note: h,
                        num: r
                    })
                }
            f.sort(function (t, e) {
                return e.line - t.line
            });
            var d = 0,
                x = 0,
                v = 0,
                c = 0,
                p = null,
                S = null;
            for (n = 0; n < f.length; ++n) {
                var y = 0;
                h = f[n].note, a = f[n].pos, r = f[n].num;
                var P = f[n].line,
                    F = f[n].shiftL,
                    M = f[n].shiftR;
                (P != p || h != S) && (d = t + F, x = e + M);
                var L = r.getWidth() + s;
                a == Vex.Flow.Modifier.Position.LEFT ? (r.setXShift(t), y = g + L, v = y > v ? y : v) : a == Vex.Flow.Modifier.Position.RIGHT && (r.setXShift(x), y += L, c = y > c ? y : c), p = P, S = h
            }
            return this.state.left_shift += v, this.state.right_shift += c, this
        },
        formatFretHandFingers: function () {
            var t = this.state.left_shift,
                e = this.state.right_shift,
                i = this.modifiers.frethandfinger,
                s = 1;
            if (!i || 0 === i.length) return this;
            var n, r, h, a, o, f = [],
                l = null,
                g = 0,
                m = 0;
            for (n = 0; n < i.length; ++n) {
                r = i[n], h = r.getNote(), a = r.getPosition();
                var _ = h.getKeyProps()[r.getIndex()];
                if (h != l) {
                    for (var u = 0; u < h.keys.length; ++u) o = h.getKeyProps()[u], 0 === t && (g = o.displaced ? h.getExtraLeftPx() : g), 0 === e && (m = o.displaced ? h.getExtraRightPx() : m);
                    l = h
                }
                f.push({
                    line: _.line,
                    pos: a,
                    shiftL: g,
                    shiftR: m,
                    note: h,
                    num: r
                })
            }
            f.sort(function (t, e) {
                return e.line - t.line
            });
            var d = 0,
                x = 0,
                v = 0,
                c = 0,
                p = null,
                S = null;
            for (n = 0; n < f.length; ++n) {
                var y = 0;
                h = f[n].note, a = f[n].pos, r = f[n].num;
                var P = f[n].line,
                    F = f[n].shiftL,
                    M = f[n].shiftR;
                (P != p || h != S) && (d = t + F, x = e + M);
                var L = r.getWidth() + s;
                a == Vex.Flow.Modifier.Position.LEFT ? (r.setXShift(t + d), y = t + L, v = y > v ? y : v) : a == Vex.Flow.Modifier.Position.RIGHT && (r.setXShift(x), y = m + L, c = y > c ? y : c), p = P, S = h
            }
            return this.state.left_shift += v, this.state.right_shift += c, this
        },
        formatBends: function () {
            var t = this.modifiers.bends;
            if (!t || 0 === t.length) return this;
            for (var e = 0, i = this.state.text_line, s = 0; s < t.length; ++s) {
                var n = t[s];
                n.setXShift(e), e = n.getWidth(), n.setTextLine(i)
            }
            return this.state.right_shift += e, this.state.text_line += 1, this
        },
        formatVibratos: function () {
            var t = this.modifiers.vibratos;
            if (!t || 0 === t.length) return this;
            var e = this.state.text_line,
                i = 0,
                s = this.state.right_shift - 7,
                n = this.modifiers.bends;
            n && n.length > 0 && e--;
            for (var r = 0; r < t.length; ++r) {
                var h = t[r];
                h.setXShift(s), h.setTextLine(e), i += h.getWidth(), s += i
            }
            return this.state.right_shift += i, this.state.text_line += 1, this
        },
        formatAnnotations: function () {
            var t = this.modifiers.annotations;
            if (!t || 0 === t.length) return this;
            for (var e, i = this.state.text_line, s = 0, n = 0; n < t.length; ++n) {
                var r = t[n];
                r.setTextLine(i), e = r.getWidth() > s ? r.getWidth() : s, i++
            }
            return this.state.left_shift += e / 2, this.state.right_shift += e / 2, this
        },
        formatArticulations: function () {
            var t = this.modifiers.articulations;
            if (!t || 0 === t.length) return this;
            for (var e, i = this.state.text_line, s = 0, n = 0; n < t.length; ++n) {
                var r = t[n];
                r.setTextLine(i), e = r.getWidth() > s ? r.getWidth() : s;
                var h = Vex.Flow.articulationCodes(r.type);
                i += h.between_lines ? 1 : 1.5
            }
            return this.state.left_shift += e / 2, this.state.right_shift += e / 2, this.state.text_line = i, this
        },
        preFormat: function () {
            this.preFormatted || (this.formatNotes().formatDots().formatFretHandFingers().formatAccidentals().formatStrokes().formatStringNumbers().formatArticulations().formatAnnotations().formatBends().formatVibratos(), this.width = this.state.left_shift + this.state.right_shift, this.preFormatted = !0)
        }
    }, t
}();
Vex.Flow.Accidental = function () {
    var t = function (t) {
        arguments.length > 0 && this.init(t)
    };
    return Vex.Inherit(t, Vex.Flow.Modifier, {
        init: function (i) {
            t.superclass.init.call(this), this.note = null, this.index = null, this.type = i, this.position = Vex.Flow.Modifier.Position.LEFT, this.render_options = {
                font_scale: 38,
                stroke_px: 3,
                stroke_spacing: 10
            }, this.accidental = Vex.Flow.accidentalCodes(this.type), this.cautionary = !1, this.paren_left = null, this.paren_right = null, this.setWidth(this.accidental.width)
        },
        getCategory: function () {
            return "accidentals"
        },
        setAsCautionary: function () {
            this.cautionary = !0, this.render_options.font_scale = 28, this.paren_left = Vex.Flow.accidentalCodes("{"), this.paren_right = Vex.Flow.accidentalCodes("}");
            var t = "##" == this.type || "bb" == this.type ? 6 : 4;
            return this.setWidth(this.paren_left.width + this.accidental.width + this.paren_right.width - t), this
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoContext", "Can't draw accidental without a context.");
            if (!this.note || null == this.index) throw new Vex.RERR("NoAttachedNote", "Can't draw accidental without a note and index.");
            var t = this.note.getModifierStartXY(this.position, this.index),
                i = t.x + this.x_shift - this.width,
                e = t.y + this.y_shift;
            this.cautionary ? (i += 3, Vex.Flow.renderGlyph(this.context, i, e, this.render_options.font_scale, this.paren_left.code), i += 2, Vex.Flow.renderGlyph(this.context, i, e, this.render_options.font_scale, this.accidental.code), i += this.accidental.width - 2, ("##" == this.type || "bb" == this.type) && (i -= 2), Vex.Flow.renderGlyph(this.context, i, e, this.render_options.font_scale, this.paren_right.code)) : Vex.Flow.renderGlyph(this.context, i, e, this.render_options.font_scale, this.accidental.code)
        }
    }), t
}();
Vex.Flow.Dot = function () {
    function t() {
        this.init()
    }
    var i = Vex.Flow.Modifier;
    return Vex.Inherit(t, i, {
        init: function () {
            t.superclass.init.call(this), this.note = null, this.index = null, this.position = i.Position.RIGHT, this.radius = 2, this.setWidth(5), this.dot_shiftY = 0
        },
        getCategory: function () {
            return "dots"
        },
        setDotShiftY: function (t) {
            return this.dot_shiftY = t, this
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoContext", "Can't draw dot without a context.");
            if (!this.note || null == this.index) throw new Vex.RERR("NoAttachedNote", "Can't draw dot without a note and index.");
            var t = this.note.stave.options.spacing_between_lines_px,
                i = this.note.getModifierStartXY(this.position, this.index);
            "tabnotes" === this.note.getCategory() && (i.y = this.note.getStemExtents().baseY);
            var n = i.x + this.x_shift + this.width - this.radius,
                s = i.y + this.y_shift + this.dot_shiftY * t,
                e = this.context;
            e.beginPath(), e.arc(n, s, this.radius, 0, 2 * Math.PI, !1), e.fill()
        }
    }), t
}();
Vex.Flow.Formatter = function () {
    function t() {
        this.minTotalWidth = 0, this.hasMinTotalWidth = !1, this.minTicks = null, this.pixelsPerTick = 0, this.totalTicks = new Vex.Flow.Fraction(0, 1), this.tContexts = null, this.mContexts = null, this.render_options = {
            perTickableWidth: 15,
            maxExtraWidthPerTickable: 40
        }
    }

    function e(t, e, i) {
        if (!t || !t.length) throw new Vex.RERR("BadArgument", "No voices to format");
        var o, n, a = t[0].getTotalTicks(),
            r = {}, s = [],
            l = 1;
        for (o = 0; o < t.length; ++o) {
            if (n = t[o], n.getTotalTicks().value() != a.value()) throw new Vex.RERR("TickMismatch", "Voices should have same time signature.");
            if (n.getMode() == Vex.Flow.Voice.Mode.STRICT && !n.isComplete()) throw new Vex.RERR("IncompleteVoice", "Voice does not have enough notes.");
            var h = Vex.Flow.Fraction.LCM(l, n.getResolutionMultiplier());
            h > l && (l = h)
        }
        for (o = 0; o < t.length; ++o) {
            n = t[o];
            for (var c = n.getTickables(), u = new Vex.Flow.Fraction(0, l), d = 0; d < c.length; ++d) {
                var x = c[d],
                    f = u.numerator;
                r[f] || (r[f] = new e), i(x, r[f]), s.push(f), u.add(x.getTicks())
            }
        }
        return {
            map: r,
            list: Vex.SortAndUnique(s, function (t, e) {
                return t - e
            }, function (t, e) {
                return t === e
            }),
            resolutionMultiplier: l
        }
    }
    return t.FormatAndDraw = function (e, i, o, n) {
        var a = new Vex.Flow.Voice(Vex.Flow.TIME4_4).setMode(Vex.Flow.Voice.Mode.SOFT);
        a.addTickables(o);
        var r = {
            auto_beam: !1,
            align_rests: !1
        };
        "object" == typeof n ? Vex.Merge(r, n) : "boolean" == typeof n && (r.auto_beam = n);
        var s = null;
        if (r.auto_beam && (s = Vex.Flow.Beam.applyAndGetBeams(a)), (new t).joinVoices([a], {
            align_rests: r.align_rests
        }).formatToStave([a], i, {
            align_rests: r.align_rests
        }), a.setStave(i), a.draw(e, i), null != s)
            for (var l = 0; l < s.length; ++l) s[l].setContext(e).draw();
        return a.getBoundingBox()
    }, t.FormatAndDrawTab = function (e, i, o, n, a, r, s) {
        var l = new Vex.Flow.Voice(Vex.Flow.TIME4_4).setMode(Vex.Flow.Voice.Mode.SOFT);
        l.addTickables(a);
        var h = new Vex.Flow.Voice(Vex.Flow.TIME4_4).setMode(Vex.Flow.Voice.Mode.SOFT);
        h.addTickables(n);
        var c = {
            auto_beam: r,
            align_rests: !1
        };
        "object" == typeof s ? Vex.Merge(c, s) : "boolean" == typeof s && (c.auto_beam = s);
        var u = null;
        if (c.auto_beam && (u = Vex.Flow.Beam.applyAndGetBeams(l)), (new t).joinVoices([l], {
            align_rests: c.align_rests
        }).joinVoices([h]).formatToStave([l, h], o, {
            align_rests: c.align_rests
        }), l.draw(e, o), h.draw(e, i), null != u)
            for (var d = 0; d < u.length; ++d) u[d].setContext(e).draw();
        new Vex.Flow.StaveConnector(o, i).setContext(e).draw()
    }, t.LookAhead = function (t, e, i, o) {
        var n = e;
        for (i++; i < t.length;) {
            if (!t[i].isRest() && !t[i].shouldIgnoreTicks()) {
                n = t[i].getLineForRest();
                break
            }
            i++
        }
        if (o && e != n) {
            var a = Vex.Max(e, n),
                r = Vex.Min(e, n);
            n = Vex.MidLine(a, r)
        }
        return n
    }, t.AlignRestsToNotes = function (e, i, o) {
        for (var n = 0; n < e.length; ++n)
            if (e[n] instanceof Vex.Flow.StaveNote && e[n].isRest()) {
                var a = e[n];
                if (a.tuplet && !o) continue;
                var r = a.glyph.position.toUpperCase();
                if ("R/4" != r && "B/4" != r) continue;
                if (i || null != a.beam) {
                    var s = a.getKeyProps()[0];
                    if (0 === n) s.line = t.LookAhead(e, s.line, n, !1);
                    else if (n > 0 && n < e.length) {
                        var l;
                        e[n - 1].isRest() ? (l = e[n - 1].getKeyProps()[0].line, s.line = l) : (l = e[n - 1].getLineForRest(), s.line = t.LookAhead(e, l, n, !0))
                    }
                }
            }
        return this
    }, t.prototype = {
        alignRests: function (e, i) {
            if (!e || !e.length) throw new Vex.RERR("BadArgument", "No voices to format rests");
            for (var o = 0; o < e.length; o++) new t.AlignRestsToNotes(e[o].tickables, i)
        },
        preCalculateMinTotalWidth: function (t) {
            if (!this.hasMinTotalWidth) {
                if (!this.tContexts) {
                    if (!t) throw new Vex.RERR("BadArgument", "'voices' required to run preCalculateMinTotalWidth");
                    this.createTickContexts(t)
                }
                var e = this.tContexts,
                    i = e.list,
                    o = e.map;
                this.minTotalWidth = 0;
                for (var n = 0; n < i.length; ++n) {
                    var a = o[i[n]];
                    a.preFormat(), this.minTotalWidth += a.getWidth()
                }
                return this.hasMinTotalWidth = !0, this.minTotalWidth
            }
        },
        getMinTotalWidth: function () {
            if (!this.hasMinTotalWidth) throw new Vex.RERR("NoMinTotalWidth", "Need to call 'preCalculateMinTotalWidth' or 'preFormat' before calling 'getMinTotalWidth'");
            return this.minTotalWidth
        },
        createModifierContexts: function (t) {
            var i = e(t, Vex.Flow.ModifierContext, function (t, e) {
                t.addToModifierContext(e)
            });
            return this.mContexts = i, i
        },
        createTickContexts: function (t) {
            var i = e(t, Vex.Flow.TickContext, function (t, e) {
                e.addTickable(t)
            });
            return this.totalTicks = t[0].getTicksUsed().clone(), this.tContexts = i, i
        },
        preFormat: function (t, e) {
            var i = this.tContexts,
                o = i.list,
                n = i.map;
            t ? this.pixelsPerTick = t / (this.totalTicks.value() * i.resolutionMultiplier) : (t = 0, this.pixelsPerTick = 0);
            var a = 0,
                r = 0,
                s = 0,
                l = 0,
                h = 0,
                c = null,
                u = t;
            this.minTotalWidth = 0;
            var d, x, f;
            for (d = 0; d < o.length; ++d) {
                x = o[d], f = n[x], e && f.setContext(e), f.preFormat();
                var g = f.getMetrics(),
                    T = f.getWidth();
                this.minTotalWidth += T;
                var v = 0,
                    m = T;
                s = Math.min((x - l) * this.pixelsPerTick, m);
                var w = a + s;
                null != c && (v = a + h - c.extraLeftPx), w = f.shouldIgnoreTicks() ? v + f.getWidth() : Math.max(w, v), f.shouldIgnoreTicks() && t && (t -= f.getWidth(), this.pixelsPerTick = t / (this.totalTicks.value() * i.resolutionMultiplier));
                var V = g.extraLeftPx;
                null != c && (r = w - a - (h - c.extraLeftPx)), d > 0 && r > 0 && (r >= V ? V = 0 : V -= r), w += V, f.setX(w), f.setPixelsUsed(m), c = g, h = T, l = x, a = w
            }
            if (this.hasMinTotalWidth = !0, t > 0) {
                var M = u - (a + h),
                    p = M / (this.totalTicks.value() * i.resolutionMultiplier),
                    F = 0;
                for (l = 0, d = 0; d < o.length; ++d) x = o[d], f = n[x], s = (x - l) * p, F += s, f.setX(f.getX() + F), l = x
            }
        },
        joinVoices: function (t) {
            return this.createModifierContexts(t), this.hasMinTotalWidth = !1, this
        },
        format: function (t, e, i) {
            var o = {
                align_rests: !1,
                context: null
            };
            return Vex.Merge(o, i), this.alignRests(t, o.align_rests), this.createTickContexts(t), this.preFormat(e, o.context), this
        },
        formatToStave: function (t, e, i) {
            var o = e.getNoteEndX() - e.getNoteStartX() - 10,
                n = {
                    context: e.getContext()
                };
            return Vex.Merge(n, i), this.format(t, o, n)
        }
    }, t
}();
Vex.Flow.StaveTie = function () {
    function t(t, i) {
        arguments.length > 0 && this.init(t, i)
    }
    return t.prototype = {
        init: function (t, i) {
            this.notes = t, this.context = null, this.text = i, this.render_options = {
                cp1: 8,
                cp2: 15,
                text_shift_x: 0,
                first_x_shift: 0,
                last_x_shift: 0,
                y_shift: 7,
                tie_spacing: 0,
                font: {
                    family: "Arial",
                    size: 10,
                    style: ""
                }
            }, this.font = this.render_options.font, this.setNotes(t)
        },
        setContext: function (t) {
            return this.context = t, this
        },
        setFont: function (t) {
            return this.font = t, this
        },
        setNotes: function (t) {
            if (!t.first_note && !t.last_note) throw new Vex.RuntimeError("BadArguments", "Tie needs to have either first_note or last_note set.");
            if (t.first_indices || (t.first_indices = [0]), t.last_indices || (t.last_indices = [0]), t.first_indices.length != t.last_indices.length) throw new Vex.RuntimeError("BadArguments", "Tied notes must have similar index sizes");
            return this.first_note = t.first_note, this.first_indices = t.first_indices, this.last_note = t.last_note, this.last_indices = t.last_indices, this
        },
        isPartial: function () {
            return !this.first_note || !this.last_note
        },
        renderTie: function (t) {
            if (0 === t.first_ys.length || 0 === t.last_ys.length) throw new Vex.RERR("BadArguments", "No Y-values to render");
            var i = this.context,
                e = this.render_options.cp1,
                s = this.render_options.cp2;
            Math.abs(t.last_x_px - t.first_x_px) < 10 && (e = 2, s = 8);
            for (var n = this.render_options.first_x_shift, r = this.render_options.last_x_shift, o = this.render_options.y_shift * t.direction, _ = 0; _ < this.first_indices.length; ++_) {
                var h = (t.last_x_px + r + (t.first_x_px + n)) / 2,
                    a = t.first_ys[this.first_indices[_]] + o,
                    f = t.last_ys[this.last_indices[_]] + o;
                if (isNaN(a) || isNaN(f)) throw new Vex.RERR("BadArguments", "Bad indices for tie rendering.");
                var c = (a + f) / 2 + e * t.direction,
                    x = (a + f) / 2 + s * t.direction;
                i.beginPath(), i.moveTo(t.first_x_px + n, a), i.quadraticCurveTo(h, c, t.last_x_px + r, f), i.quadraticCurveTo(h, x, t.first_x_px + n, a), i.closePath(), i.fill()
            }
        },
        renderText: function (t, i) {
            if (this.text) {
                var e = (t + i) / 2;
                e -= this.context.measureText(this.text).width / 2, this.context.save(), this.context.setFont(this.font.family, this.font.size, this.font.style), this.context.fillText(this.text, e + this.render_options.text_shift_x, (this.first_note || this.last_note).getStave().getYForTopText() - 1), this.context.restore()
            }
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoContext", "No context to render tie.");
            var t, i, e, s, n, r = this.first_note,
                o = this.last_note;
            return r ? (t = r.getTieRightX() + this.render_options.tie_spacing, n = r.getStemDirection(), e = r.getYs()) : (t = o.getStave().getTieStartX(), e = o.getYs(), this.first_indices = this.last_indices), o ? (i = o.getTieLeftX() + this.render_options.tie_spacing, n = o.getStemDirection(), s = o.getYs()) : (i = r.getStave().getTieEndX(), s = r.getYs(), this.last_indices = this.first_indices), this.renderTie({
                first_x_px: t,
                last_x_px: i,
                first_ys: e,
                last_ys: s,
                direction: n
            }), this.renderText(t, i), !0
        }
    }, t
}();
Vex.Flow.TabTie = function () {
    function t(t, e) {
        arguments.length > 0 && this.init(t, e)
    }
    return t.createHammeron = function (e) {
        return new t(e, "H")
    }, t.createPulloff = function (e) {
        return new t(e, "P")
    }, Vex.Inherit(t, Vex.Flow.StaveTie, {
        init: function (e, i) {
            t.superclass.init.call(this, e, i), this.render_options.cp1 = 9, this.render_options.cp2 = 11, this.render_options.y_shift = 3, this.setNotes(e)
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoContext", "No context to render tie.");
            var t, e, i, n, s = this.first_note,
                r = this.last_note;
            return s ? (t = s.getTieRightX() + this.render_options.tie_spacing, i = s.getYs()) : (t = r.getStave().getTieStartX(), i = r.getYs(), this.first_indices = this.last_indices), r ? (e = r.getTieLeftX() + this.render_options.tie_spacing, n = r.getYs()) : (e = s.getStave().getTieEndX(), n = s.getYs(), this.last_indices = this.first_indices), this.renderTie({
                first_x_px: t,
                last_x_px: e,
                first_ys: i,
                last_ys: n,
                direction: -1
            }), this.renderText(t, e), !0
        }
    }), t
}();
Vex.Flow.TabSlide = function () {
    function t(t, e) {
        arguments.length > 0 && this.init(t, e)
    }
    return t.SLIDE_UP = 1, t.SLIDE_DOWN = -1, t.createSlideUp = function (e) {
        return new t(e, t.SLIDE_UP)
    }, t.createSlideDown = function (e) {
        return new t(e, t.SLIDE_DOWN)
    }, Vex.Inherit(t, Vex.Flow.TabTie, {
        init: function (e, i) {
            if (t.superclass.init.call(this, e, "sl."), !i) {
                var n = e.first_note.getPositions()[0].fret,
                    s = e.last_note.getPositions()[0].fret;
                i = parseInt(n, 10) > parseInt(s, 10) ? t.SLIDE_DOWN : t.SLIDE_UP
            }
            this.slide_direction = i, this.render_options.cp1 = 11, this.render_options.cp2 = 14, this.render_options.y_shift = .5, this.setFont({
                font: "Times",
                size: 10,
                style: "bold italic"
            }), this.setNotes(e)
        },
        renderTie: function (e) {
            if (0 === e.first_ys.length || 0 === e.last_ys.length) throw new Vex.RERR("BadArguments", "No Y-values to render");
            var i = this.context,
                n = e.first_x_px,
                s = e.first_ys,
                r = e.last_x_px,
                o = this.slide_direction;
            if (o != t.SLIDE_UP && o != t.SLIDE_DOWN) throw new Vex.RERR("BadSlide", "Invalid slide direction");
            for (var l = 0; l < this.first_indices.length; ++l) {
                var d = s[this.first_indices[l]] + this.render_options.y_shift;
                if (isNaN(d)) throw new Vex.RERR("BadArguments", "Bad indices for slide rendering.");
                i.beginPath(), i.moveTo(n, d + 3 * o), i.lineTo(r, d - 3 * o), i.closePath(), i.stroke()
            }
        }
    }), t
}();
Vex.Flow.Bend = function () {
    function t(t, e, i) {
        arguments.length > 0 && this.init(t, e, i)
    }
    t.UP = 0, t.DOWN = 1;
    var e = Vex.Flow.Modifier;
    return Vex.Inherit(t, e, {
        init: function (e, i, n) {
            var s = Vex.Flow.Bend.superclass;
            s.init.call(this), this.text = e, this.x_shift = 0, this.release = i || !1, this.font = "10pt Arial", this.render_options = {
                line_width: 1.5,
                line_style: "#777777",
                bend_width: 8,
                release_width: 8
            }, n ? this.phrase = n : (this.phrase = [{
                type: t.UP,
                text: this.text
            }], this.release && this.phrase.push({
                type: t.DOWN,
                text: ""
            })), this.updateWidth()
        },
        setXShift: function (t) {
            this.x_shift = t, this.updateWidth()
        },
        setFont: function (t) {
            return this.font = t, this
        },
        getCategory: function () {
            return "bends"
        },
        getText: function () {
            return this.text
        },
        updateWidth: function () {
            function e(t) {
                var e;
                return e = i.context ? i.context.measureText(t).width : Vex.Flow.textWidth(t)
            }
            for (var i = this, n = 0, s = 0; s < this.phrase.length; ++s) {
                var r = this.phrase[s];
                if ("width" in r) n += r.width;
                else {
                    var h = r.type == t.UP ? this.render_options.bend_width : this.render_options.release_width;
                    r.width = Vex.Max(h, e(r.text)) + 3, r.draw_width = r.width / 2, n += r.width
                }
            }
            return this.setWidth(n + this.x_shift), this
        },
        draw: function () {
            function i(t, e, i, n) {
                var s = t + i,
                    r = e;
                a.save(), a.beginPath(), a.setLineWidth(x.render_options.line_width), a.setStrokeStyle(x.render_options.line_style), a.setFillStyle(x.render_options.line_style), a.moveTo(t, e), a.quadraticCurveTo(s, r, t + i, n), a.stroke(), a.restore()
            }

            function n(t, e, i, n) {
                a.save(), a.beginPath(), a.setLineWidth(x.render_options.line_width), a.setStrokeStyle(x.render_options.line_style), a.setFillStyle(x.render_options.line_style), a.moveTo(t, n), a.quadraticCurveTo(t + i, n, t + i, e), a.stroke(), a.restore()
            }

            function s(t, e, i) {
                var n = 4,
                    s = i || 1;
                a.beginPath(), a.moveTo(t, e), a.lineTo(t - n, e + n * s), a.lineTo(t + n, e + n * s), a.closePath(), a.fill()
            }

            function r(t, e) {
                a.save(), a.setRawFont(x.font);
                var i = t - a.measureText(e).width / 2;
                a.fillText(e, i, l), a.restore()
            }
            if (!this.context) throw new Vex.RERR("NoContext", "Can't draw bend without a context.");
            if (!this.note || null == this.index) throw new Vex.RERR("NoNoteForBend", "Can't draw bend without a note or index.");
            var h = this.note.getModifierStartXY(e.Position.RIGHT, this.index);
            h.x += 3, h.y += .5;
            for (var o = this.x_shift, a = this.context, d = this.note.getStave().getYForTopText(this.text_line) + 3, l = this.note.getStave().getYForTopText(this.text_line) - 1, x = this, w = null, u = 0, p = 0; p < this.phrase.length; ++p) {
                var _ = this.phrase[p];
                0 === p && (_.draw_width += o), u = _.draw_width + (w ? w.draw_width : 0) - (1 == p ? o : 0), _.type == t.UP && (w && w.type == t.UP && s(h.x, d), i(h.x, h.y, u, d)), _.type == t.DOWN && (w && w.type == t.UP && n(h.x, h.y, u, d), w && w.type == t.DOWN && (s(h.x, h.y, -1), n(h.x, h.y, u, d)), null == w && (u = _.draw_width, n(h.x, h.y, u, d))), r(h.x + u, _.text), w = _, w.x = h.x, h.x += u
            }
            w.type == t.UP ? s(w.x + u, d) : w.type == t.DOWN && s(w.x + u, h.y, -1)
        }
    }), t
}();
Vex.Flow.Vibrato = function () {
    function t() {
        this.init()
    }
    var i = Vex.Flow.Modifier;
    return Vex.Inherit(t, i, {
        init: function () {
            var t = Vex.Flow.Vibrato.superclass;
            t.init.call(this), this.harsh = !1, this.position = Vex.Flow.Modifier.Position.RIGHT, this.render_options = {
                vibrato_width: 20,
                wave_height: 6,
                wave_width: 4,
                wave_girth: 2
            }, this.setVibratoWidth(this.render_options.vibrato_width)
        },
        getCategory: function () {
            return "vibratos"
        },
        setHarsh: function (t) {
            return this.harsh = t, this
        },
        setVibratoWidth: function (t) {
            return this.vibrato_width = t, this.setWidth(this.vibrato_width), this
        },
        draw: function () {
            function t(t, i) {
                var n = e.render_options.wave_width,
                    h = e.render_options.wave_girth,
                    a = e.render_options.wave_height,
                    s = r / n;
                o.beginPath();
                var d;
                if (e.harsh) {
                    for (o.moveTo(t, i + h + 1), d = 0; s / 2 > d; ++d) o.lineTo(t + n, i - a / 2), t += n, o.lineTo(t + n, i + a / 2), t += n;
                    for (d = 0; s / 2 > d; ++d) o.lineTo(t - n, i - a / 2 + h + 1), t -= n, o.lineTo(t - n, i + a / 2 + h + 1), t -= n;
                    o.fill()
                } else {
                    for (o.moveTo(t, i + h), d = 0; s / 2 > d; ++d) o.quadraticCurveTo(t + n / 2, i - a / 2, t + n, i), t += n, o.quadraticCurveTo(t + n / 2, i + a / 2, t + n, i), t += n;
                    for (d = 0; s / 2 > d; ++d) o.quadraticCurveTo(t - n / 2, i + a / 2 + h, t - n, i + h), t -= n, o.quadraticCurveTo(t - n / 2, i - a / 2 + h, t - n, i + h), t -= n;
                    o.fill()
                }
            }
            if (!this.context) throw new Vex.RERR("NoContext", "Can't draw vibrato without a context.");
            if (!this.note) throw new Vex.RERR("NoNoteForVibrato", "Can't draw vibrato without an attached note.");
            var i = this.note.getModifierStartXY(Vex.Flow.Modifier.Position.RIGHT, this.index),
                o = this.context,
                e = this,
                r = this.vibrato_width,
                n = i.x + this.x_shift,
                h = this.note.getYForTopText(this.text_line) + 2;
            t(n, h)
        }
    }), t
}();
Vex.Flow.Annotation = function () {
    function t(t) {
        arguments.length > 0 && this.init(t)
    }
    t.Justify = {
        LEFT: 1,
        CENTER: 2,
        RIGHT: 3,
        CENTER_STEM: 4
    }, t.VerticalJustify = {
        TOP: 1,
        CENTER: 2,
        BOTTOM: 3,
        CENTER_STEM: 4
    };
    var i = Vex.Flow.Modifier;
    return Vex.Inherit(t, i, {
        init: function (i) {
            t.superclass.init.call(this), this.note = null, this.index = null, this.text_line = 0, this.text = i, this.justification = t.Justify.CENTER, this.vert_justification = t.VerticalJustify.TOP, this.font = {
                family: "Arial",
                size: 10,
                weight: ""
            }, this.setWidth(Vex.Flow.textWidth(i))
        },
        getCategory: function () {
            return "annotations"
        },
        setTextLine: function (t) {
            return this.text_line = t, this
        },
        setFont: function (t, i, e) {
            return this.font = {
                family: t,
                size: i,
                weight: e
            }, this
        },
        setBottom: function (i) {
            return this.vert_justification = i ? t.VerticalJustify.BOTTOM : t.VerticalJustify.TOP, this
        },
        setVerticalJustification: function (t) {
            return this.vert_justification = t, this
        },
        getJustification: function () {
            return this.justification
        },
        setJustification: function (t) {
            return this.justification = t, this
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoContext", "Can't draw text annotation without a context.");
            if (!this.note) throw new Vex.RERR("NoNoteForAnnotation", "Can't draw text annotation without an attached note.");
            var e = this.note.getModifierStartXY(i.Position.ABOVE, this.index);
            this.context.save(), this.context.setFont(this.font.family, this.font.size, this.font.weight);
            var n, s, o = this.context.measureText(this.text).width,
                h = this.context.measureText("m").width;
            n = this.justification == t.Justify.LEFT ? e.x : this.justification == t.Justify.RIGHT ? e.x - o : this.justification == t.Justify.CENTER ? e.x - o / 2 : this.note.getStemX() - o / 2;
            var a, r, f = !this.note.hasStem(),
                u = !f;
            if (u && (a = this.note.getStemExtents(), r = this.note.getStave().options.spacing_between_lines_px), this.vert_justification == t.VerticalJustify.BOTTOM) {
                if (s = this.note.stave.getYForBottomText(this.text_line), u) {
                    var x = 1 === this.note.stem_direction ? a.baseY : a.topY;
                    s = Vex.Max(s, x + r * (this.text_line + 2))
                }
            } else if (this.vert_justification == t.VerticalJustify.CENTER) {
                var c = this.note.getYForTopText(this.text_line) - 1,
                    l = this.note.stave.getYForBottomText(this.text_line);
                s = c + (l - c) / 2 + h / 2
            } else if (this.vert_justification == t.VerticalJustify.TOP) s = Vex.Min(this.note.stave.getYForTopText(this.text_line), this.note.ys[0] - 10), u && (s = Vex.Min(s, a.topY - 5 - r * this.text_line));
            else {
                var T = this.note.getStemExtents();
                s = T.topY + (T.baseY - T.topY) / 2 + h / 2
            }
            this.context.fillText(this.text, n, s), this.context.restore()
        }
    }), t
}();
Vex.Flow.Articulation = function () {
    function t(t) {
        arguments.length > 0 && this.init(t)
    }
    var i = Vex.Flow.Modifier;
    return Vex.Inherit(t, i, {
        init: function (o) {
            if (t.superclass.init.call(this), this.note = null, this.index = null, this.type = o, this.position = i.Position.BELOW, this.render_options = {
                font_scale: 38,
                stroke_px: 3,
                stroke_spacing: 10
            }, this.articulation = Vex.Flow.articulationCodes(this.type), !this.articulation) throw new Vex.RERR("InvalidArticulation", "Articulation not found: '" + this.type + "'");
            this.setWidth(this.articulation.width)
        },
        getCategory: function () {
            return "articulations"
        },
        getPosition: function () {
            return this.position
        },
        setPosition: function (t) {
            return (t == i.Position.ABOVE || t == i.Position.BELOW) && (this.position = t), this
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoContext", "Can't draw Articulation without a context.");
            if (!this.note || null === this.index) throw new Vex.RERR("NoAttachedNote", "Can't draw Articulation without a note and index.");
            var t = this.note.stem_direction,
                o = this.position === i.Position.ABOVE && t === Vex.Flow.StaveNote.STEM_DOWN || this.position === i.Position.BELOW && t === Vex.Flow.StaveNote.STEM_UP,
                e = function (t, e, n) {
                    var s = t.position === i.Position.ABOVE ? 1 : -1;
                    o || "w" === t.note.duration || "1" === t.note.duration || (e += 3.5 * s);
                    var a = e + s * n;
                    return a >= 1 && 5 >= a && 0 === a % 1 ? !0 : !1
                }, n = this.note.getStave(),
                s = this.note.getModifierStartXY(this.position, this.index),
                a = s.y,
                h = 0,
                r = 1,
                l = n.options.spacing_between_lines_px,
                x = "tabnotes" === this.note.getCategory(),
                u = this.note.getStemExtents(),
                c = u.topY,
                _ = u.baseY;
            t === Vex.Flow.StaveNote.STEM_DOWN && (c = u.baseY, _ = u.topY), x && (this.note.hasStem() ? t === Vex.Flow.StaveNote.STEM_UP ? _ = n.getYForBottomText(this.text_line - 2) : t === Vex.Flow.StaveNote.STEM_DOWN && (c = n.getYForTopText(this.text_line - 1.5)) : (c = n.getYForTopText(this.text_line - 1), _ = n.getYForBottomText(this.text_line - 2)));
            var p = this.position === i.Position.ABOVE ? !0 : !1,
                w = this.note.getLineNumber(p);
            !o && this.note.beam && (r += .5), e(this, w, r) && (r += .5);
            var d;
            this.position === i.Position.ABOVE ? (h = this.articulation.shift_up, d = c - 7 - l * (this.text_line + r), a = this.articulation.between_lines ? d : Vex.Min(n.getYForTopText(this.text_line) - 3, d)) : (h = this.articulation.shift_down - 10, d = _ + 10 + l * (this.text_line + r), a = this.articulation.between_lines ? d : Vex.Max(n.getYForBottomText(this.text_line), d));
            var f = s.x + this.articulation.shift_right;
            a += h + this.y_shift, Vex.Flow.renderGlyph(this.context, f, a, this.render_options.font_scale, this.articulation.code)
        }
    }), t
}();
Vex.Flow.Tuning = function () {
    function n(n) {
        this.init(n)
    }
    return n.names = {
        standard: "E/5,B/4,G/4,D/4,A/3,E/3",
        dagdad: "D/5,A/4,G/4,D/4,A/3,D/3",
        dropd: "E/5,B/4,G/4,D/4,A/3,D/3",
        eb: "Eb/5,Bb/4,Gb/4,Db/4,Ab/3,Db/3"
    }, n.prototype = {
        init: function (n) {
            this.setTuning(n || "E/5,B/4,G/4,D/4,A/3,E/3")
        },
        noteToInteger: function (n) {
            return Vex.Flow.keyProperties(n).int_value
        },
        setTuning: function (n) {
            Vex.Flow.Tuning.names[n] && (n = Vex.Flow.Tuning.names[n]), this.tuningString = n, this.tuningValues = [], this.numStrings = 0;
            var t = n.split(/\s*,\s*/);
            if (0 === t.length) throw new Vex.RERR("BadArguments", "Invalid tuning string: " + n);
            this.numStrings = t.length;
            for (var e = 0; e < this.numStrings; ++e) this.tuningValues[e] = this.noteToInteger(t[e])
        },
        getValueForString: function (n) {
            var t = parseInt(n, 10);
            if (1 > t || t > this.numStrings) throw new Vex.RERR("BadArguments", "String number must be between 1 and " + this.numStrings + ": " + n);
            return this.tuningValues[t - 1]
        },
        getValueForFret: function (n, t) {
            var e = this.getValueForString(t),
                r = parseInt(n, 10);
            if (0 > r) throw new Vex.RERR("BadArguments", "Fret number must be 0 or higher: " + n);
            return e + r
        },
        getNoteForFret: function (n, t) {
            var e = this.getValueForFret(n, t),
                r = Math.floor(e / 12),
                i = e % 12;
            return Vex.Flow.integerToNote(i) + "/" + r
        }
    }, n
}();
Vex.Flow.StaveModifier = function () {
    function t() {
        this.init()
    }
    return t.prototype = {
        init: function () {
            this.padding = 10
        },
        getCategory: function () {
            return ""
        },
        makeSpacer: function (t) {
            return {
                getContext: function () {
                    return !0
                },
                setStave: function () {},
                renderToStave: function () {},
                getMetrics: function () {
                    return {
                        width: t
                    }
                }
            }
        },
        placeGlyphOnLine: function (t, e, i) {
            t.setYShift(e.getYForLine(i) - e.getYForGlyphs())
        },
        setPadding: function (t) {
            this.padding = t
        },
        addToStave: function (t, e) {
            return e || t.addGlyph(this.makeSpacer(this.padding)), this.addModifier(t), this
        },
        addToStaveEnd: function (t, e) {
            return e ? t.addEndGlyph(this.makeSpacer(2)) : t.addEndGlyph(this.makeSpacer(this.padding)), this.addEndModifier(t), this
        },
        addModifier: function () {
            throw new Vex.RERR("MethodNotImplemented", "addModifier() not implemented for this stave modifier.")
        },
        addEndModifier: function () {
            throw new Vex.RERR("MethodNotImplemented", "addEndModifier() not implemented for this stave modifier.")
        }
    }, t
}();
Vex.Flow.KeySignature = function () {
    function t(t) {
        arguments.length > 0 && this.init(t)
    }
    return Vex.Inherit(t, Vex.Flow.StaveModifier, {
        init: function (i) {
            t.superclass.init(), this.glyphFontScale = 38, this.accList = Vex.Flow.keySignature(i)
        },
        addAccToStave: function (t, i) {
            var e = new Vex.Flow.Glyph(i.glyphCode, this.glyphFontScale);
            this.placeGlyphOnLine(e, t, i.line), t.addGlyph(e)
        },
        addModifier: function (t) {
            this.convertAccLines(t.clef, this.accList[0].glyphCode);
            for (var i = 0; i < this.accList.length; ++i) this.addAccToStave(t, this.accList[i])
        },
        addToStave: function (t, i) {
            return 0 === this.accList.length ? this : (i || t.addGlyph(this.makeSpacer(this.padding)), this.addModifier(t), this)
        },
        convertAccLines: function (t, i) {
            var e, c = 0,
                n = "tenor" === t && "v18" === i ? !0 : !1;
            switch (t) {
            case "bass":
                c = 1;
                break;
            case "alto":
                c = .5;
                break;
            case "tenor":
                n || (c = -.5)
            }
            var s;
            if (n)
                for (e = [3, 1, 2.5, .5, 2, 0, 1.5], s = 0; s < this.accList.length; ++s) this.accList[s].line = e[s];
            else if ("treble" != t)
                for (s = 0; s < this.accList.length; ++s) this.accList[s].line += c
        }
    }), t
}();
Vex.Flow.TimeSignature = function () {
    function i(i, t) {
        arguments.length > 0 && this.init(i, t)
    }
    return i.glyphs = {
        C: {
            code: "v41",
            point: 40,
            line: 2
        },
        "C|": {
            code: "vb6",
            point: 40,
            line: 2
        }
    }, Vex.Inherit(i, Vex.Flow.StaveModifier, {
        init: function (t, e) {
            i.superclass.init();
            var n = e || 15;
            this.setPadding(n), this.point = 40, this.topLine = 2, this.bottomLine = 4, this.timeSig = this.parseTimeSpec(t)
        },
        parseTimeSpec: function (t) {
            if ("C" == t || "C|" == t) {
                var e = i.glyphs[t];
                return {
                    num: !1,
                    line: e.line,
                    glyph: new Vex.Flow.Glyph(e.code, e.point)
                }
            }
            var n, h, s = [];
            for (n = 0; n < t.length && (h = t.charAt(n), "/" != h); ++n) {
                if (!/[0-9]/.test(h)) throw new Vex.RERR("BadTimeSignature", "Invalid time spec: " + t);
                s.push(h)
            }
            if (0 === n) throw new Vex.RERR("BadTimeSignature", "Invalid time spec: " + t);
            if (++n, n == t.length) throw new Vex.RERR("BadTimeSignature", "Invalid time spec: " + t);
            for (var r = []; n < t.length; ++n) {
                if (h = t.charAt(n), !/[0-9]/.test(h)) throw new Vex.RERR("BadTimeSignature", "Invalid time spec: " + t);
                r.push(h)
            }
            return {
                num: !0,
                glyph: this.makeTimeSignatureGlyph(s, r)
            }
        },
        makeTimeSignatureGlyph: function (i, t) {
            var e = new Vex.Flow.Glyph("v0", this.point);
            e.topGlyphs = [], e.botGlyphs = [];
            var n, h, s = 0;
            for (n = 0; n < i.length; ++n) {
                h = i[n];
                var r = new Vex.Flow.Glyph("v" + h, this.point);
                e.topGlyphs.push(r), s += r.getMetrics().width
            }
            var l = 0;
            for (n = 0; n < t.length; ++n) {
                h = t[n];
                var o = new Vex.Flow.Glyph("v" + h, this.point);
                e.botGlyphs.push(o), l += o.getMetrics().width
            }
            var p = s > l ? s : l,
                a = e.getMetrics().x_min;
            e.getMetrics = function () {
                return {
                    x_min: a,
                    x_max: a + p,
                    width: p
                }
            };
            var g = (p - s) / 2,
                m = (p - l) / 2,
                c = this;
            return e.renderToStave = function (i) {
                var t, e, n = i + g;
                for (t = 0; t < this.topGlyphs.length; ++t) e = this.topGlyphs[t], Vex.Flow.Glyph.renderOutline(this.context, e.metrics.outline, e.scale, n + e.x_shift, this.stave.getYForLine(c.topLine)), n += e.getMetrics().width;
                for (n = i + m, t = 0; t < this.botGlyphs.length; ++t) e = this.botGlyphs[t], c.placeGlyphOnLine(e, this.stave, e.line), Vex.Flow.Glyph.renderOutline(this.context, e.metrics.outline, e.scale, n + e.x_shift, this.stave.getYForLine(c.bottomLine)), n += e.getMetrics().width
            }, e
        },
        getTimeSig: function () {
            return this.timeSig
        },
        addModifier: function (i) {
            this.timeSig.num || this.placeGlyphOnLine(this.timeSig.glyph, i, this.timeSig.line), i.addGlyph(this.timeSig.glyph)
        },
        addEndModifier: function (i) {
            this.timeSig.num || this.placeGlyphOnLine(this.timeSig.glyph, i, this.timeSig.line), i.addEndGlyph(this.timeSig.glyph)
        }
    }), i
}();
Vex.Flow.Clef = function () {
    function e(e) {
        arguments.length > 0 && this.init(e)
    }
    return e.types = {
        treble: {
            code: "v83",
            point: 40,
            line: 3
        },
        bass: {
            code: "v79",
            point: 40,
            line: 1
        },
        alto: {
            code: "vad",
            point: 40,
            line: 2
        },
        tenor: {
            code: "vad",
            point: 40,
            line: 1
        },
        percussion: {
            code: "v59",
            point: 40,
            line: 2
        },
        treble_small: {
            code: "v83",
            point: 32,
            line: 3
        },
        bass_small: {
            code: "v79",
            point: 32,
            line: 1
        },
        alto_small: {
            code: "vad",
            point: 32,
            line: 2
        },
        tenor_small: {
            code: "vad",
            point: 32,
            line: 1
        },
        percussion_small: {
            code: "v59",
            point: 32,
            line: 2
        }
    }, Vex.Inherit(e, Vex.Flow.StaveModifier, {
        init: function (e) {
            var i = Vex.Flow.Clef.superclass;
            i.init.call(this), this.clef = Vex.Flow.Clef.types[e]
        },
        addModifier: function (e) {
            var i = new Vex.Flow.Glyph(this.clef.code, this.clef.point);
            this.placeGlyphOnLine(i, e, this.clef.line), e.addGlyph(i)
        },
        addEndModifier: function (e) {
            var i = new Vex.Flow.Glyph(this.clef.code, this.clef.point);
            this.placeGlyphOnLine(i, e, this.clef.line), e.addEndGlyph(i)
        }
    }), e
}();
Vex.Flow.Music = function () {
    function n() {
        this.init()
    }
    return n.NUM_TONES = 12, n.roots = ["c", "d", "e", "f", "g", "a", "b"], n.root_values = [0, 2, 4, 5, 7, 9, 11], n.root_indices = {
        c: 0,
        d: 1,
        e: 2,
        f: 3,
        g: 4,
        a: 5,
        b: 6
    }, n.canonical_notes = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"], n.diatonic_intervals = ["unison", "m2", "M2", "m3", "M3", "p4", "dim5", "p5", "m6", "M6", "b7", "M7", "octave"], n.diatonic_accidentals = {
        unison: {
            note: 0,
            accidental: 0
        },
        m2: {
            note: 1,
            accidental: -1
        },
        M2: {
            note: 1,
            accidental: 0
        },
        m3: {
            note: 2,
            accidental: -1
        },
        M3: {
            note: 2,
            accidental: 0
        },
        p4: {
            note: 3,
            accidental: 0
        },
        dim5: {
            note: 4,
            accidental: -1
        },
        p5: {
            note: 4,
            accidental: 0
        },
        m6: {
            note: 5,
            accidental: -1
        },
        M6: {
            note: 5,
            accidental: 0
        },
        b7: {
            note: 6,
            accidental: -1
        },
        M7: {
            note: 6,
            accidental: 0
        },
        octave: {
            note: 7,
            accidental: 0
        }
    }, n.intervals = {
        u: 0,
        unison: 0,
        m2: 1,
        b2: 1,
        min2: 1,
        S: 1,
        H: 1,
        2: 2,
        M2: 2,
        maj2: 2,
        T: 2,
        W: 2,
        m3: 3,
        b3: 3,
        min3: 3,
        M3: 4,
        3: 4,
        maj3: 4,
        4: 5,
        p4: 5,
        "#4": 6,
        b5: 6,
        aug4: 6,
        dim5: 6,
        5: 7,
        p5: 7,
        "#5": 8,
        b6: 8,
        aug5: 8,
        6: 9,
        M6: 9,
        maj6: 9,
        b7: 10,
        m7: 10,
        min7: 10,
        dom7: 10,
        M7: 11,
        maj7: 11,
        8: 12,
        octave: 12
    }, n.scales = {
        major: [2, 2, 1, 2, 2, 2, 1],
        dorian: [2, 1, 2, 2, 2, 1, 2],
        mixolydian: [2, 2, 1, 2, 2, 1, 2],
        minor: [2, 1, 2, 2, 1, 2, 2]
    }, n.accidentals = ["bb", "b", "n", "#", "##"], n.noteValues = {
        c: {
            root_index: 0,
            int_val: 0
        },
        cn: {
            root_index: 0,
            int_val: 0
        },
        "c#": {
            root_index: 0,
            int_val: 1
        },
        "c##": {
            root_index: 0,
            int_val: 2
        },
        cb: {
            root_index: 0,
            int_val: 11
        },
        cbb: {
            root_index: 0,
            int_val: 10
        },
        d: {
            root_index: 1,
            int_val: 2
        },
        dn: {
            root_index: 1,
            int_val: 2
        },
        "d#": {
            root_index: 1,
            int_val: 3
        },
        "d##": {
            root_index: 1,
            int_val: 4
        },
        db: {
            root_index: 1,
            int_val: 1
        },
        dbb: {
            root_index: 1,
            int_val: 0
        },
        e: {
            root_index: 2,
            int_val: 4
        },
        en: {
            root_index: 2,
            int_val: 4
        },
        "e#": {
            root_index: 2,
            int_val: 5
        },
        "e##": {
            root_index: 2,
            int_val: 6
        },
        eb: {
            root_index: 2,
            int_val: 3
        },
        ebb: {
            root_index: 2,
            int_val: 2
        },
        f: {
            root_index: 3,
            int_val: 5
        },
        fn: {
            root_index: 3,
            int_val: 5
        },
        "f#": {
            root_index: 3,
            int_val: 6
        },
        "f##": {
            root_index: 3,
            int_val: 7
        },
        fb: {
            root_index: 3,
            int_val: 4
        },
        fbb: {
            root_index: 3,
            int_val: 3
        },
        g: {
            root_index: 4,
            int_val: 7
        },
        gn: {
            root_index: 4,
            int_val: 7
        },
        "g#": {
            root_index: 4,
            int_val: 8
        },
        "g##": {
            root_index: 4,
            int_val: 9
        },
        gb: {
            root_index: 4,
            int_val: 6
        },
        gbb: {
            root_index: 4,
            int_val: 5
        },
        a: {
            root_index: 5,
            int_val: 9
        },
        an: {
            root_index: 5,
            int_val: 9
        },
        "a#": {
            root_index: 5,
            int_val: 10
        },
        "a##": {
            root_index: 5,
            int_val: 11
        },
        ab: {
            root_index: 5,
            int_val: 8
        },
        abb: {
            root_index: 5,
            int_val: 7
        },
        b: {
            root_index: 6,
            int_val: 11
        },
        bn: {
            root_index: 6,
            int_val: 11
        },
        "b#": {
            root_index: 6,
            int_val: 0
        },
        "b##": {
            root_index: 6,
            int_val: 1
        },
        bb: {
            root_index: 6,
            int_val: 10
        },
        bbb: {
            root_index: 6,
            int_val: 9
        }
    }, n.prototype = {
        init: function () {},
        isValidNoteValue: function (n) {
            return null == n || 0 > n || n >= Vex.Flow.Music.NUM_TONES ? !1 : !0
        },
        isValidIntervalValue: function (n) {
            return this.isValidNoteValue(n)
        },
        getNoteParts: function (n) {
            if (!n || n.length < 1) throw new Vex.RERR("BadArguments", "Invalid note name: " + n);
            if (n.length > 3) throw new Vex.RERR("BadArguments", "Invalid note name: " + n);
            var t = n.toLowerCase(),
                e = /^([cdefgab])(b|bb|n|#|##)?$/,
                a = e.exec(t);
            if (null != a) {
                var i = a[1],
                    o = a[2];
                return {
                    root: i,
                    accidental: o
                }
            }
            throw new Vex.RERR("BadArguments", "Invalid note name: " + n)
        },
        getKeyParts: function (n) {
            if (!n || n.length < 1) throw new Vex.RERR("BadArguments", "Invalid key: " + n);
            var t = n.toLowerCase(),
                e = /^([cdefgab])(b|#)?(mel|harm|m|M)?$/,
                a = e.exec(t);
            if (null != a) {
                var i = a[1],
                    o = a[2],
                    r = a[3];
                return r || (r = "M"), {
                    root: i,
                    accidental: o,
                    type: r
                }
            }
            throw new Vex.RERR("BadArguments", "Invalid key: " + n)
        },
        getNoteValue: function (t) {
            var e = n.noteValues[t];
            if (null == e) throw new Vex.RERR("BadArguments", "Invalid note name: " + t);
            return e.int_val
        },
        getIntervalValue: function (t) {
            var e = n.intervals[t];
            if (null == e) throw new Vex.RERR("BadArguments", "Invalid interval name: " + t);
            return e
        },
        getCanonicalNoteName: function (t) {
            if (!this.isValidNoteValue(t)) throw new Vex.RERR("BadArguments", "Invalid note value: " + t);
            return n.canonical_notes[t]
        },
        getCanonicalIntervalName: function (t) {
            if (!this.isValidIntervalValue(t)) throw new Vex.RERR("BadArguments", "Invalid interval value: " + t);
            return n.diatonic_intervals[t]
        },
        getRelativeNoteValue: function (t, e, a) {
            if (null == a && (a = 1), 1 != a && -1 != a) throw new Vex.RERR("BadArguments", "Invalid direction: " + a);
            var i = (t + a * e) % n.NUM_TONES;
            return 0 > i && (i += n.NUM_TONES), i
        },
        getRelativeNoteName: function (t, e) {
            var a = this.getNoteParts(t),
                i = this.getNoteValue(a.root),
                o = e - i;
            if (Math.abs(o) > n.NUM_TONES - 3) {
                var r = 1;
                o > 0 && (r = -1);
                var l = (e + 1 + (i + 1)) % n.NUM_TONES * r;
                if (Math.abs(l) > 2) throw new Vex.RERR("BadArguments", "Notes not related: " + t + ", " + e);
                o = l
            }
            if (Math.abs(o) > 2) throw new Vex.RERR("BadArguments", "Notes not related: " + t + ", " + e);
            var d, _ = a.root;
            if (o > 0)
                for (d = 1; o >= d; ++d) _ += "#";
            else if (0 > o)
                for (d = -1; d >= o; --d) _ += "b";
            return _
        },
        getScaleTones: function (n, t) {
            var e = [];
            e.push(n);
            for (var a = n, i = 0; i < t.length; ++i) a = this.getRelativeNoteValue(a, t[i]), a != n && e.push(a);
            return e
        },
        getIntervalBetween: function (t, e, a) {
            if (null == a && (a = 1), 1 != a && -1 != a) throw new Vex.RERR("BadArguments", "Invalid direction: " + a);
            if (!this.isValidNoteValue(t) || !this.isValidNoteValue(e)) throw new Vex.RERR("BadArguments", "Invalid notes: " + t + ", " + e);
            var i;
            return i = 1 == a ? e - t : t - e, 0 > i && (i += n.NUM_TONES), i
        }
    }, n
}();
Vex.Flow.KeyManager = function () {
    function t(t) {
        this.init(t)
    }
    return t.scales = {
        M: Vex.Flow.Music.scales.major,
        m: Vex.Flow.Music.scales.minor
    }, t.prototype = {
        init: function (t) {
            this.music = new Vex.Flow.Music, this.setKey(t)
        },
        setKey: function (t) {
            return this.key = t, this.reset(), this
        },
        getKey: function () {
            return this.key
        },
        reset: function () {
            this.keyParts = this.music.getKeyParts(this.key), this.keyString = this.keyParts.root, this.keyParts.accidental && (this.keyString += this.keyParts.accidental);
            var e = t.scales[this.keyParts.type];
            if (!e) throw new Vex.RERR("BadArguments", "Unsupported key type: " + this.key);
            this.scale = this.music.getScaleTones(this.music.getNoteValue(this.keyString), Vex.Flow.KeyManager.scales[this.keyParts.type]), this.scaleMap = {}, this.scaleMapByValue = {}, this.originalScaleMapByValue = {};
            for (var s = Vex.Flow.Music.root_indices[this.keyParts.root], a = 0; a < Vex.Flow.Music.roots.length; ++a) {
                var i = (s + a) % Vex.Flow.Music.roots.length,
                    c = Vex.Flow.Music.roots[i],
                    l = this.music.getRelativeNoteName(c, this.scale[a]);
                this.scaleMap[c] = l, this.scaleMapByValue[this.scale[a]] = l, this.originalScaleMapByValue[this.scale[a]] = l
            }
            return this
        },
        getAccidental: function (t) {
            var e = this.music.getKeyParts(t).root,
                s = this.music.getNoteParts(this.scaleMap[e]);
            return {
                note: this.scaleMap[e],
                accidental: s.accidental
            }
        },
        selectNote: function (t) {
            t = t.toLowerCase();
            var e = this.music.getNoteParts(t),
                s = this.scaleMap[e.root],
                a = this.music.getNoteParts(s);
            if (s == t) return {
                note: s,
                accidental: e.accidental,
                change: !1
            };
            var i = this.scaleMapByValue[this.music.getNoteValue(t)];
            if (null != i) return {
                note: i,
                accidental: this.music.getNoteParts(i).accidental,
                change: !1
            };
            var c = this.originalScaleMapByValue[this.music.getNoteValue(t)];
            return null != c ? (this.scaleMap[a.root] = c, delete this.scaleMapByValue[this.music.getNoteValue(s)], this.scaleMapByValue[this.music.getNoteValue(t)] = c, {
                note: c,
                accidental: this.music.getNoteParts(c).accidental,
                change: !0
            }) : a.root == t ? (delete this.scaleMapByValue[this.music.getNoteValue(this.scaleMap[e.root])], this.scaleMapByValue[this.music.getNoteValue(a.root)] = a.root, this.scaleMap[a.root] = a.root, {
                note: a.root,
                accidental: null,
                change: !0
            }) : (delete this.scaleMapByValue[this.music.getNoteValue(this.scaleMap[e.root])], this.scaleMapByValue[this.music.getNoteValue(t)] = t, delete this.scaleMap[a.root], this.scaleMap[a.root] = t, {
                note: t,
                accidental: e.accidental,
                change: !0
            })
        }
    }, t
}();
Vex.Flow.Renderer = function () {
    function e(e, t) {
        arguments.length > 0 && this.init(e, t)
    }
    return e.Backends = {
        CANVAS: 1,
        RAPHAEL: 2,
        SVG: 3,
        VML: 4
    }, e.LineEndType = {
        NONE: 1,
        UP: 2,
        DOWN: 3
    }, e.USE_CANVAS_PROXY = !1, e.buildContext = function (t, n, a, o, i) {
        var s = new e(t, n);
        a && o && s.resize(a, o), i || (i = "#eed");
        var r = s.getContext();
        return r.setBackgroundFillStyle(i), r
    }, e.getCanvasContext = function (t, n, a, o) {
        return e.buildContext(t, e.Backends.CANVAS, n, a, o)
    }, e.getRaphaelContext = function (t, n, a, o) {
        return e.buildContext(t, e.Backends.RAPHAEL, n, a, o)
    }, e.bolsterCanvasContext = function (t) {
        if (e.USE_CANVAS_PROXY) return new Vex.Flow.CanvasContext(t);
        var n = ["clear", "setFont", "setRawFont", "setFillStyle", "setBackgroundFillStyle", "setStrokeStyle", "setShadowColor", "setShadowBlur", "setLineWidth"];
        t.vexFlowCanvasContext = t;
        for (var a in n) {
            var o = n[a];
            t[o] = Vex.Flow.CanvasContext.prototype[o]
        }
        return t
    }, e.drawDashedLine = function (e, t, n, a, o, i) {
        e.beginPath();
        var s = a - t,
            r = o - n,
            l = Math.atan2(r, s),
            h = t,
            c = n;
        e.moveTo(t, n);
        for (var d = 0, x = !0; !(0 > s ? a >= h : h >= a) || !(0 > r ? o >= c : c >= o);) {
            var C = i[d++ % i.length],
                u = h + Math.cos(l) * C;
            h = 0 > s ? Math.max(a, u) : Math.min(a, u);
            var m = c + Math.sin(l) * C;
            c = 0 > r ? Math.max(o, m) : Math.min(o, m), x ? e.lineTo(h, c) : e.moveTo(h, c), x = !x
        }
        e.closePath(), e.stroke()
    }, e.prototype = {
        init: function (t, n) {
            if (this.sel = t, !this.sel) throw new Vex.RERR("BadArgument", "Invalid selector for renderer.");
            if (this.element = document.getElementById(t), this.element || (this.element = t), this.ctx = null, this.paper = null, this.backend = n, this.backend == e.Backends.CANVAS) {
                if (!this.element.getContext) throw new Vex.RERR("BadElement", "Can't get canvas context from element: " + t);
                this.ctx = e.bolsterCanvasContext(this.element.getContext("2d"))
            } else {
                if (this.backend != e.Backends.RAPHAEL) throw new Vex.RERR("InvalidBackend", "No support for backend: " + this.backend);
                this.ctx = new Vex.Flow.RaphaelContext(this.element)
            }
        },
        resize: function (t, n) {
            if (this.backend == e.Backends.CANVAS) {
                if (!this.element.getContext) throw new Vex.RERR("BadElement", "Can't get canvas context from element: " + this.sel);
                this.element.width = t, this.element.height = n, this.ctx = e.bolsterCanvasContext(this.element.getContext("2d"))
            } else this.ctx.resize(t, n);
            return this
        },
        getContext: function () {
            return this.ctx
        }
    }, e
}();
Vex.Flow.RaphaelContext = function () {
    function t(t) {
        arguments.length > 0 && this.init(t)
    }
    return t.prototype = {
        init: function (t) {
            this.element = t, this.paper = Raphael(t), this.path = "", this.pen = {
                x: 0,
                y: 0
            }, this.lineWidth = 1, this.state = {
                scale: {
                    x: 1,
                    y: 1
                },
                font_family: "Arial",
                font_size: 8,
                font_weight: 800
            }, this.attributes = {
                "stroke-width": .3,
                fill: "black",
                stroke: "black",
                font: "10pt Arial"
            }, this.background_attributes = {
                "stroke-width": 0,
                fill: "white",
                stroke: "white",
                font: "10pt Arial"
            }, this.shadow_attributes = {
                width: 0,
                color: "black"
            }, this.state_stack = []
        },
        setFont: function (t, i, s) {
            return this.state.font_family = t, this.state.font_size = i, this.state.font_weight = s, this.attributes.font = (this.state.font_weight || "") + " " + this.state.font_size * this.state.scale.x + "pt " + this.state.font_family, this
        },
        setRawFont: function (t) {
            return this.attributes.font = t, this
        },
        setFillStyle: function (t) {
            return this.attributes.fill = t, this
        },
        setBackgroundFillStyle: function (t) {
            return this.background_attributes.fill = t, this.background_attributes.stroke = t, this
        },
        setStrokeStyle: function (t) {
            return this.attributes.stroke = t, this
        },
        setShadowColor: function (t) {
            return this.shadow_attributes.color = t, this
        },
        setShadowBlur: function (t) {
            return this.shadow_attributes.width = t, this
        },
        setLineWidth: function (t) {
            this.attributes["stroke-width"] = t, this.lineWidth = t
        },
        scale: function (t, i) {
            return this.state.scale = {
                x: t,
                y: i
            }, this.attributes.scale = t + "," + i + ",0,0", this.attributes.font = this.state.font_size * this.state.scale.x + "pt " + this.state.font_family, this.background_attributes.scale = t + "," + i + ",0,0", this.background_attributes.font = this.state.font_size * this.state.scale.x + "pt " + this.state.font_family, this
        },
        clear: function () {
            this.paper.clear()
        },
        resize: function (t, i) {
            return this.element.style.width = t, this.paper.setSize(t, i), this
        },
        rect: function (t, i, s, e) {
            return 0 > e && (i += e, e = -e), this.paper.rect(t, i, s - .5, e - .5).attr(this.attributes).attr("fill", "none").attr("stroke-width", this.lineWidth), this
        },
        fillRect: function (t, i, s, e) {
            return 0 > e && (i += e, e = -e), this.paper.rect(t, i, s - .5, e - .5).attr(this.attributes), this
        },
        clearRect: function (t, i, s, e) {
            return 0 > e && (i += e, e = -e), this.paper.rect(t, i, s - .5, e - .5).attr(this.background_attributes), this
        },
        beginPath: function () {
            return this.path = "", this.pen.x = 0, this.pen.y = 0, this
        },
        moveTo: function (t, i) {
            return this.path += "M" + t + "," + i, this.pen.x = t, this.pen.y = i, this
        },
        lineTo: function (t, i) {
            return this.path += "L" + t + "," + i, this.pen.x = t, this.pen.y = i, this
        },
        bezierCurveTo: function (t, i, s, e, h, r) {
            return this.path += "C" + t + "," + i + "," + s + "," + e + "," + h + "," + r, this.pen.x = h, this.pen.y = r, this
        },
        quadraticCurveTo: function (t, i, s, e) {
            return this.path += "Q" + t + "," + i + "," + s + "," + e, this.pen.x = s, this.pen.y = e, this
        },
        arc: function (t, i, s, e, h, r) {
            function a(t) {
                for (; 0 > t;) t += 2 * Math.PI;
                for (; t > 2 * Math.PI;) t -= 2 * Math.PI;
                return t
            }
            if (e = a(e), h = a(h), e > h) {
                var n = e;
                e = h, h = n, r = !r
            }
            var o = h - e;
            return o > Math.PI ? (this.arcHelper(t, i, s, e, e + o / 2, r), this.arcHelper(t, i, s, e + o / 2, h, r)) : this.arcHelper(t, i, s, e, h, r), this
        },
        arcHelper: function (t, i, s, e, h, r) {
            Vex.Assert(h > e, "end angle " + h + " less than or equal to start angle " + e), Vex.Assert(e >= 0 && e <= 2 * Math.PI), Vex.Assert(h >= 0 && h <= 2 * Math.PI);
            var a = t + s * Math.cos(e),
                n = i + s * Math.sin(e),
                o = t + s * Math.cos(h),
                u = i + s * Math.sin(h),
                l = 0,
                f = 0;
            r ? (f = 1, h - e < Math.PI && (l = 1)) : h - e > Math.PI && (l = 1), this.path += "M" + a + "," + n + "," + "A" + s + "," + s + "," + "0," + l + "," + f + "," + o + "," + u + "M" + this.pen.x + "," + this.pen.y
        },
        glow: function () {
            var t = this.paper.set();
            if (this.shadow_attributes.width > 0)
                for (var i = this.shadow_attributes, s = i.width / 2, e = 1; s >= e; e++) t.push(this.paper.path(this.path).attr({
                    stroke: i.color,
                    "stroke-linejoin": "round",
                    "stroke-linecap": "round",
                    "stroke-width": +(i.width / s * e).toFixed(3),
                    opacity: +((i.opacity || .3) / s).toFixed(3)
                }));
            return t
        },
        fill: function () {
            var t = this.paper.path(this.path).attr(this.attributes).attr("stroke-width", 0);
            return this.glow(t), this
        },
        stroke: function () {
            var t = this.paper.path(this.path).attr(this.attributes).attr("fill", "none").attr("stroke-width", this.lineWidth);
            return this.glow(t), this
        },
        closePath: function () {
            return this.path += "Z", this
        },
        measureText: function (t) {
            var i = this.paper.text(0, 0, t).attr(this.attributes).attr("fill", "none").attr("stroke", "none");
            return {
                width: i.getBBox().width,
                height: i.getBBox().height
            }
        },
        fillText: function (t, i, s) {
            return this.paper.text(i + this.measureText(t).width / 2, s - this.state.font_size / (2.25 * this.state.scale.y), t).attr(this.attributes), this
        },
        save: function () {
            return this.state_stack.push({
                state: {
                    font_family: this.state.font_family
                },
                attributes: {
                    font: this.attributes.font,
                    fill: this.attributes.fill,
                    stroke: this.attributes.stroke,
                    "stroke-width": this.attributes["stroke-width"]
                },
                shadow_attributes: {
                    width: this.shadow_attributes.width,
                    color: this.shadow_attributes.color
                }
            }), this
        },
        restore: function () {
            var t = this.state_stack.pop();
            return this.state.font_family = t.state.font_family, this.attributes.font = t.attributes.font, this.attributes.fill = t.attributes.fill, this.attributes.stroke = t.attributes.stroke, this.attributes["stroke-width"] = t.attributes["stroke-width"], this.shadow_attributes.width = t.shadow_attributes.width, this.shadow_attributes.color = t.shadow_attributes.color, this
        }
    }, t
}();
Vex.Flow.CanvasContext = function () {
    function t(t) {
        arguments.length > 0 && this.init(t)
    }
    return t.WIDTH = 600, t.HEIGHT = 400, t.prototype = {
        init: function (n) {
            this.vexFlowCanvasContext = n, this.canvas = n.canvas ? this.context.canvas : {
                width: t.WIDTH,
                height: t.HEIGHT
            }
        },
        clear: function () {
            this.vexFlowCanvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
        },
        setFont: function (t, n, e) {
            return this.vexFlowCanvasContext.font = (e || "") + " " + n + "pt " + t, this
        },
        setRawFont: function (t) {
            return this.vexFlowCanvasContext.font = t, this
        },
        setFillStyle: function (t) {
            return this.vexFlowCanvasContext.fillStyle = t, this
        },
        setBackgroundFillStyle: function (t) {
            return this.background_fillStyle = t, this
        },
        setStrokeStyle: function (t) {
            return this.vexFlowCanvasContext.strokeStyle = t, this
        },
        setShadowColor: function (t) {
            return this.vexFlowCanvasContext.shadowColor = t, this
        },
        setShadowBlur: function (t) {
            return this.vexFlowCanvasContext.shadowBlur = t, this
        },
        setLineWidth: function (t) {
            return this.vexFlowCanvasContext.lineWidth = t, this
        },
        scale: function (t, n) {
            return this.vexFlowCanvasContext.scale(parseFloat(t), parseFloat(n))
        },
        resize: function (t, n) {
            return this.vexFlowCanvasContext.resize(parseInt(t, 10), parseInt(n, 10))
        },
        rect: function (t, n, e, o) {
            return this.vexFlowCanvasContext.rect(t, n, e, o)
        },
        fillRect: function (t, n, e, o) {
            return this.vexFlowCanvasContext.fillRect(t, n, e, o)
        },
        clearRect: function (t, n, e, o) {
            return this.vexFlowCanvasContext.clearRect(t, n, e, o)
        },
        beginPath: function () {
            return this.vexFlowCanvasContext.beginPath()
        },
        moveTo: function (t, n) {
            return this.vexFlowCanvasContext.moveTo(t, n)
        },
        lineTo: function (t, n) {
            return this.vexFlowCanvasContext.lineTo(t, n)
        },
        bezierCurveTo: function (t, n, e, o, s, i) {
            return this.vexFlowCanvasContext.bezierCurveTo(t, n, e, o, s, i)
        },
        quadraticCurveTo: function (t, n, e, o) {
            return this.vexFlowCanvasContext.quadraticCurveTo(t, n, e, o)
        },
        arc: function (t, n, e, o, s, i) {
            return this.vexFlowCanvasContext.arc(t, n, e, o, s, i)
        },
        glow: function () {
            return this.vexFlowCanvasContext.glow()
        },
        fill: function () {
            return this.vexFlowCanvasContext.fill()
        },
        stroke: function () {
            return this.vexFlowCanvasContext.stroke()
        },
        closePath: function () {
            return this.vexFlowCanvasContext.closePath()
        },
        measureText: function (t) {
            return this.vexFlowCanvasContext.measureText(t)
        },
        fillText: function (t, n, e) {
            return this.vexFlowCanvasContext.fillText(t, n, e)
        },
        save: function () {
            return this.vexFlowCanvasContext.save()
        },
        restore: function () {
            return this.vexFlowCanvasContext.restore()
        }
    }, t
}();
Vex.Flow.Barline = function () {
    function t(t, e) {
        arguments.length > 0 && this.init(t, e)
    }
    t.type = {
        SINGLE: 1,
        DOUBLE: 2,
        END: 3,
        REPEAT_BEGIN: 4,
        REPEAT_END: 5,
        REPEAT_BOTH: 6,
        NONE: 7
    };
    var e = Vex.Flow.STAVE_LINE_THICKNESS;
    return Vex.Inherit(t, Vex.Flow.StaveModifier, {
        init: function (e, n) {
            t.superclass.init.call(this), this.barline = e, this.x = n
        },
        getCategory: function () {
            return "barlines"
        },
        setX: function (t) {
            return this.x = t, this
        },
        draw: function (e, n) {
            switch (n = "number" != typeof n ? 0 : n, this.barline) {
            case t.type.SINGLE:
                this.drawVerticalBar(e, this.x, !1);
                break;
            case t.type.DOUBLE:
                this.drawVerticalBar(e, this.x, !0);
                break;
            case t.type.END:
                this.drawVerticalEndBar(e, this.x);
                break;
            case t.type.REPEAT_BEGIN:
                n > 0 && this.drawVerticalBar(e, this.x), this.drawRepeatBar(e, this.x + n, !0);
                break;
            case t.type.REPEAT_END:
                this.drawRepeatBar(e, this.x, !1);
                break;
            case t.type.REPEAT_BOTH:
                this.drawRepeatBar(e, this.x, !1), this.drawRepeatBar(e, this.x, !0)
            }
        },
        drawVerticalBar: function (t, n, a) {
            if (!t.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
            var i = t.getYForLine(0),
                r = t.getYForLine(t.options.num_lines - 1) + e / 2;
            a && t.context.fillRect(n - 3, i, 1, r - i + 1), t.context.fillRect(n, i, 1, r - i + 1)
        },
        drawVerticalEndBar: function (t, n) {
            if (!t.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
            var a = t.getYForLine(0),
                i = t.getYForLine(t.options.num_lines - 1) + e / 2;
            t.context.fillRect(n - 5, a, 1, i - a + 1), t.context.fillRect(n - 2, a, 3, i - a + 1)
        },
        drawRepeatBar: function (t, n, a) {
            if (!t.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
            var i = t.getYForLine(0),
                r = t.getYForLine(t.options.num_lines - 1) + e / 2,
                o = 3;
            a || (o = -5), t.context.fillRect(n + o, i, 1, r - i + 1), t.context.fillRect(n - 2, i, 3, r - i + 1);
            var s = 2;
            a ? o += 4 : o -= 4;
            var c = n + o + s / 2,
                x = (t.options.num_lines - 1) * t.options.spacing_between_lines_px;
            x = x / 2 - t.options.spacing_between_lines_px / 2;
            var l = i + x + s / 2;
            t.context.beginPath(), t.context.arc(c, l, s, 0, 2 * Math.PI, !1), t.context.fill(), l += t.options.spacing_between_lines_px, t.context.beginPath(), t.context.arc(c, l, s, 0, 2 * Math.PI, !1), t.context.fill()
        }
    }), t
}();
Vex.Flow.StaveHairpin = function () {
    function t(t, i) {
        arguments.length > 0 && this.init(t, i)
    }
    return t.type = {
        CRESC: 1,
        DECRESC: 2
    }, t.FormatByTicksAndDraw = function (i, e, s, n, o, r) {
        var h = e.pixelsPerTick;
        if (null == h) throw new Vex.RuntimeError("BadArguments", "A valid Formatter must be provide to draw offsets by ticks.");
        var _ = h * r.left_shift_ticks,
            f = h * r.right_shift_ticks,
            a = {
                height: r.height,
                y_shift: r.y_shift,
                left_shift_px: _,
                right_shift_px: f
            };
        new t({
            first_note: s.first_note,
            last_note: s.last_note
        }, n).setContext(i).setRenderOptions(a).setPosition(o).draw()
    }, t.prototype = {
        init: function (t, i) {
            this.notes = t, this.hairpin = i, this.position = Vex.Flow.Modifier.Position.BELOW, this.context = null, this.render_options = {
                height: 10,
                y_shift: 0,
                left_shift_px: 0,
                right_shift_px: 0
            }, this.setNotes(t)
        },
        setContext: function (t) {
            return this.context = t, this
        },
        setPosition: function (t) {
            return (t == Vex.Flow.Modifier.Position.ABOVE || t == Vex.Flow.Modifier.Position.BELOW) && (this.position = t), this
        },
        setRenderOptions: function (t) {
            return null != t.height && null != t.y_shift && null != t.left_shift_px && null != t.right_shift_px && (this.render_options = t), this
        },
        setNotes: function (t) {
            if (!t.first_note && !t.last_note) throw new Vex.RuntimeError("BadArguments", "Hairpin needs to have either first_note or last_note set.");
            return this.first_note = t.first_note, this.last_note = t.last_note, this
        },
        renderHairpin: function (i) {
            var e = this.context,
                s = this.render_options.y_shift + 20,
                n = i.first_y;
            this.position == Vex.Flow.Modifier.Position.ABOVE && (s = -s + 30, n = i.first_y - i.staff_height);
            var o = this.render_options.left_shift_px,
                r = this.render_options.right_shift_px;
            switch (this.hairpin) {
            case t.type.CRESC:
                e.moveTo(i.last_x + r, n + s), e.lineTo(i.first_x + o, n + this.render_options.height / 2 + s), e.lineTo(i.last_x + r, n + this.render_options.height + s);
                break;
            case t.type.DECRESC:
                e.moveTo(i.first_x + o, n + s), e.lineTo(i.last_x + r, n + this.render_options.height / 2 + s), e.lineTo(i.first_x + o, n + this.render_options.height + s)
            }
            e.stroke()
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoContext", "Can't draw Hairpin without a context.");
            var t = this.first_note,
                i = this.last_note,
                e = t.getModifierStartXY(this.position, 0),
                s = i.getModifierStartXY(this.position, 0);
            return this.renderHairpin({
                first_x: e.x,
                last_x: s.x,
                first_y: t.getStave().y + t.getStave().height,
                last_y: i.getStave().y + i.getStave().height,
                staff_height: t.getStave().height
            }), !0
        }
    }, t
}();
Vex.Flow.Volta = function () {
    function t(t, i, e, s) {
        arguments.length > 0 && this.init(t, i, e, s)
    }
    return t.type = {
        NONE: 1,
        BEGIN: 2,
        MID: 3,
        END: 4,
        BEGIN_END: 5
    }, Vex.Inherit(t, Vex.Flow.StaveModifier, {
        init: function (i, e, s, n) {
            t.superclass.init.call(this), this.volta = i, this.x = s, this.y_shift = n, this.number = e, this.font = {
                family: "sans-serif",
                size: 9,
                weight: "bold"
            }
        },
        getCategory: function () {
            return "voltas"
        },
        setShiftY: function (t) {
            return this.y_shift = t, this
        },
        draw: function (i, e) {
            if (!i.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
            var s = i.context,
                n = i.width,
                o = i.getYForTopText(i.options.num_lines) + this.y_shift,
                h = 1.5 * i.options.spacing_between_lines_px;
            switch (this.volta) {
            case Vex.Flow.Volta.type.BEGIN:
                s.fillRect(this.x + e, o, 1, h);
                break;
            case Vex.Flow.Volta.type.END:
                n -= 5, s.fillRect(this.x + e + n, o, 1, h);
                break;
            case Vex.Flow.Volta.type.BEGIN_END:
                n -= 3, s.fillRect(this.x + e, o, 1, h), s.fillRect(this.x + e + n, o, 1, h)
            }
            return (this.volta == t.type.BEGIN || this.volta == t.type.BEGIN_END) && (s.save(), s.setFont(this.font.family, this.font.size, this.font.weight), s.fillText(this.number, this.x + e + 5, o + 15), s.restore()), s.fillRect(this.x + e, o, n, 1), this
        }
    }), t
}();
Vex.Flow.Repetition = function () {
    function t(t, e, i) {
        arguments.length > 0 && this.init(t, e, i)
    }
    return t.type = {
        NONE: 1,
        CODA_LEFT: 2,
        CODA_RIGHT: 3,
        SEGNO_LEFT: 4,
        SEGNO_RIGHT: 5,
        DC: 6,
        DC_AL_CODA: 7,
        DC_AL_FINE: 8,
        DS: 9,
        DS_AL_CODA: 10,
        DS_AL_FINE: 11,
        FINE: 12
    }, Vex.Inherit(t, Vex.Flow.StaveModifier, {
        init: function (e, i, s) {
            t.superclass.init.call(this), this.symbol_type = e, this.x = i, this.x_shift = 0, this.y_shift = s, this.font = {
                family: "times",
                size: 12,
                weight: "bold italic"
            }
        },
        getCategory: function () {
            return "repetitions"
        },
        setShiftX: function (t) {
            return this.x_shift = t, this
        },
        setShiftY: function (t) {
            return this.y_shift = t, this
        },
        draw: function (e, i) {
            switch (this.symbol_type) {
            case t.type.CODA_RIGHT:
                this.drawCodaFixed(e, i + e.width);
                break;
            case t.type.CODA_LEFT:
                this.drawSymbolText(e, i, "Coda", !0);
                break;
            case t.type.SEGNO_LEFT:
                this.drawSignoFixed(e, i);
                break;
            case t.type.SEGNO_RIGHT:
                this.drawSignoFixed(e, i + e.width);
                break;
            case t.type.DC:
                this.drawSymbolText(e, i, "D.C.", !1);
                break;
            case t.type.DC_AL_CODA:
                this.drawSymbolText(e, i, "D.C. al", !0);
                break;
            case t.type.DC_AL_FINE:
                this.drawSymbolText(e, i, "D.C. al Fine", !1);
                break;
            case t.type.DS:
                this.drawSymbolText(e, i, "D.S.", !1);
                break;
            case t.type.DS_AL_CODA:
                this.drawSymbolText(e, i, "D.S. al", !0);
                break;
            case t.type.DS_AL_FINE:
                this.drawSymbolText(e, i, "D.S. al Fine", !1);
                break;
            case t.type.FINE:
                this.drawSymbolText(e, i, "Fine", !1)
            }
            return this
        },
        drawCodaFixed: function (t, e) {
            if (!t.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
            var i = t.getYForTopText(t.options.num_lines) + this.y_shift;
            return Vex.Flow.renderGlyph(t.context, this.x + e + this.x_shift, i + 25, 40, "v4d", !0), this
        },
        drawSignoFixed: function (t, e) {
            if (!t.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
            var i = t.getYForTopText(t.options.num_lines) + this.y_shift;
            return Vex.Flow.renderGlyph(t.context, this.x + e + this.x_shift, i + 25, 30, "v8c", !0), this
        },
        drawSymbolText: function (t, e, i, s) {
            if (!t.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
            var n = t.context;
            n.save(), n.setFont(this.font.family, this.font.size, this.font.weight);
            var a = 0 + this.x_shift,
                o = e + this.x_shift;
            this.symbol_type == Vex.Flow.Repetition.type.CODA_LEFT ? (a = this.x + t.options.vertical_bar_width, o = a + n.measureText(i).width + 12) : (o = this.x + e + t.width - 5 + this.x_shift, a = o - +n.measureText(i).width - 12);
            var h = t.getYForTopText(t.options.num_lines) + this.y_shift;
            return s && Vex.Flow.renderGlyph(n, o, h, 40, "v4d", !0), n.fillText(i, a, h + 5), n.restore(), this
        }
    }), t
}();
Vex.Flow.StaveSection = function () {
    function t(t, i, e) {
        arguments.length > 0 && this.init(t, i, e)
    }
    var i = Vex.Flow.Modifier;
    return Vex.Inherit(t, i, {
        init: function (e, s, n) {
            t.superclass.init.call(this), this.setWidth(16), this.section = e, this.position = i.Position.ABOVE, this.x = s, this.shift_x = 0, this.shift_y = n, this.font = {
                family: "sans-serif",
                size: 12,
                weight: "bold"
            }
        },
        getCategory: function () {
            return "stavesection"
        },
        setStaveSection: function (t) {
            return this.section = t, this
        },
        setShiftX: function (t) {
            return this.shift_x = t, this
        },
        setShiftY: function (t) {
            return this.shift_y = t, this
        },
        draw: function (t, i) {
            if (!t.context) throw new Vex.RERR("NoContext", "Can't draw stave section without a context.");
            var e = t.context;
            e.save(), e.lineWidth = 2, e.setFont(this.font.family, this.font.size, this.font.weight);
            var s = e.measureText("" + this.section).width,
                n = s + 6;
            18 > n && (n = 18);
            var h = 20,
                o = t.getYForTopText(3) + this.shift_y,
                r = this.x + i;
            return e.beginPath(), e.lineWidth = 2, e.rect(r, o, n, h), e.stroke(), r += (n - s) / 2, e.fillText("" + this.section, r, o + 16), e.restore(), this
        }
    }), t
}();
Vex.Flow.StaveTempo = function () {
    function t(t, e, i) {
        arguments.length > 0 && this.init(t, e, i)
    }
    return Vex.Inherit(t, Vex.Flow.StaveModifier, {
        init: function (e, i, o) {
            t.superclass.init.call(this), this.tempo = e, this.position = Vex.Flow.Modifier.Position.ABOVE, this.x = i, this.shift_x = 10, this.shift_y = o, this.font = {
                family: "times",
                size: 14,
                weight: "bold"
            }, this.render_options = {
                glyph_font_scale: 30
            }
        },
        getCategory: function () {
            return "stavetempo"
        },
        setTempo: function (t) {
            return this.tempo = t, this
        },
        setShiftX: function (t) {
            return this.shift_x = t, this
        },
        setShiftY: function (t) {
            return this.shift_y = t, this
        },
        draw: function (t, e) {
            if (!t.context) throw new Vex.RERR("NoContext", "Can't draw stave tempo without a context.");
            var i = this.render_options,
                o = i.glyph_font_scale / 38,
                s = this.tempo.name,
                n = this.tempo.duration,
                h = this.tempo.dots,
                r = this.tempo.bpm,
                a = this.font,
                f = t.context,
                l = this.x + this.shift_x + e,
                m = t.getYForTopText(1) + this.shift_y;
            if (f.save(), s && (f.setFont(a.family, a.size, a.weight), f.fillText(s, l, m), l += f.measureText(s).width), n && r) {
                f.setFont(a.family, a.size, "normal"), s && (l += f.measureText(" ").width, f.fillText("(", l, m), l += f.measureText("(").width);
                var u = Vex.Flow.durationToGlyph(n);
                if (l += 3 * o, Vex.Flow.renderGlyph(f, l, m, i.glyph_font_scale, u.code_head), l += u.head_width * o, u.stem) {
                    var p = 30;
                    u.beam_count && (p += 3 * (u.beam_count - 1)), p *= o;
                    var x = m - p;
                    f.fillRect(l, x, o, p), u.flag && (Vex.Flow.renderGlyph(f, l + o, x, i.glyph_font_scale, u.code_flag_upstem), h || (l += 6 * o))
                }
                for (var c = 0; h > c; c++) l += 6 * o, f.beginPath(), f.arc(l, m + 2 * o, 2 * o, 0, 2 * Math.PI, !1), f.fill();
                f.fillText(" = " + r + (s ? ")" : ""), l + 3 * o, m)
            }
            return f.restore(), this
        }
    }), t
}();
Vex.Flow.BarNote = function () {
    function t() {
        this.init()
    }
    return Vex.Inherit(t, Vex.Flow.Note, {
        init: function () {
            t.superclass.init.call(this, {
                duration: "b"
            });
            var i = Vex.Flow.Barline.type;
            this.metrics = {
                widths: {}
            }, this.metrics.widths[i.SINGLE] = 8, this.metrics.widths[i.DOUBLE] = 12, this.metrics.widths[i.END] = 15, this.metrics.widths[i.REPEAT_BEGIN] = 14, this.metrics.widths[i.REPEAT_END] = 14, this.metrics.widths[i.REPEAT_BOTH] = 18, this.metrics.widths[i.NONE] = 0, this.ignore_ticks = !0, this.type = i.SINGLE, this.setWidth(this.metrics.widths[this.type])
        },
        setType: function (t) {
            return this.type = t, this.setWidth(this.metrics.widths[this.type]), this
        },
        getType: function () {
            return this.type
        },
        setStave: function (t) {
            var i = Vex.Flow.BarNote.superclass;
            i.setStave.call(this, t)
        },
        getBoundingBox: function () {
            return new Vex.Flow.BoundingBox(0, 0, 0, 0)
        },
        addToModifierContext: function () {
            return this
        },
        preFormat: function () {
            return this.setPreFormatted(!0), this
        },
        draw: function () {
            if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");
            var t = new Vex.Flow.Barline(this.type, this.getAbsoluteX());
            t.draw(this.stave)
        }
    }), t
}();
Vex.Flow.Tremolo = function () {
    function t(t) {
        arguments.length > 0 && this.init(t)
    }
    var i = Vex.Flow.Modifier;
    return Vex.Inherit(t, i, {
        init: function (n) {
            t.superclass.init.call(this), this.num = n, this.note = null, this.index = null, this.position = i.Position.CENTER, this.code = "v74", this.shift_right = -2, this.y_spacing = 4, this.render_options = {
                font_scale: 35,
                stroke_px: 3,
                stroke_spacing: 10
            }, this.font = {
                family: "Arial",
                size: 16,
                weight: ""
            }
        },
        getCategory: function () {
            return "tremolo"
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoContext", "Can't draw Tremolo without a context.");
            if (!this.note || null == this.index) throw new Vex.RERR("NoAttachedNote", "Can't draw Tremolo without a note and index.");
            var t = this.note.getModifierStartXY(this.position, this.index),
                i = t.x,
                n = t.y;
            i += this.shift_right;
            for (var o = 0; o < this.num; ++o) Vex.Flow.renderGlyph(this.context, i, n, this.render_options.font_scale, this.code), n += this.y_spacing
        }
    }), t
}();
Vex.Flow.Tuplet = function () {
    function t(t, s) {
        arguments.length > 0 && this.init(t, s)
    }
    return t.LOCATION_TOP = 1, t.LOCATION_BOTTOM = -1, t.prototype = {
        init: function (s, i) {
            if (!s || s == []) throw new Vex.RuntimeError("BadArguments", "No notes provided for tuplet.");
            if (1 == s.length) throw new Vex.RuntimeError("BadArguments", "Too few notes for tuplet.");
            this.options = Vex.Merge({}, i), this.notes = s, this.num_notes = "num_notes" in this.options ? this.options.num_notes : s.length, this.beats_occupied = "beats_occupied" in this.options ? this.options.beats_occupied : 2, this.bracketed = null == s[0].beam, this.ratioed = !1, this.point = 28, this.y_pos = 16, this.x_pos = 100, this.width = 200, this.location = t.LOCATION_TOP, Vex.Flow.Formatter.AlignRestsToNotes(s, !0, !0), this.resolveGlyphs(), this.attach()
        },
        attach: function () {
            for (var t = 0; t < this.notes.length; t++) {
                var s = this.notes[t];
                s.setTuplet(this)
            }
        },
        detach: function () {
            for (var t = 0; t < this.notes.length; t++) {
                var s = this.notes[t];
                s.setTuplet(null)
            }
        },
        setContext: function (t) {
            return this.context = t, this
        },
        setBracketed: function (t) {
            return this.bracketed = t ? !0 : !1, this
        },
        setRatioed: function (t) {
            return this.ratioed = t ? !0 : !1, this
        },
        setTupletLocation: function (s) {
            if (s) {
                if (s != t.LOCATION_TOP && s != t.LOCATION_BOTTOM) throw new Vex.RERR("BadArgument", "Invalid tuplet location: " + s)
            } else s = t.LOCATION_TOP;
            return this.location = s, this
        },
        getNotes: function () {
            return this.notes
        },
        getNoteCount: function () {
            return this.num_notes
        },
        getBeatsOccupied: function () {
            return this.beats_occupied
        },
        setBeatsOccupied: function (t) {
            this.detach(), this.beats_occupied = t, this.resolveGlyphs(), this.attach()
        },
        resolveGlyphs: function () {
            this.num_glyphs = [];
            for (var t = this.num_notes; t >= 1;) this.num_glyphs.push(new Vex.Flow.Glyph("v" + t % 10, this.point)), t = parseInt(t / 10, 10);
            for (this.denom_glyphs = [], t = this.beats_occupied; t >= 1;) this.denom_glyphs.push(new Vex.Flow.Glyph("v" + t % 10, this.point)), t = parseInt(t / 10, 10)
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
            var s = this.notes[0],
                i = this.notes[this.notes.length - 1];
            this.bracketed ? (this.x_pos = s.getTieLeftX() - 5, this.width = i.getTieRightX() - this.x_pos + 5) : (this.x_pos = s.getStemX(), this.width = i.getStemX() - this.x_pos);
            var e;
            if (this.location == t.LOCATION_TOP)
                for (this.y_pos = s.getStave().getYForLine(0) - 15, e = 0; e < this.notes.length; ++e) {
                    var h = this.notes[e].getStemExtents().topY - 10;
                    h < this.y_pos && (this.y_pos = h)
                } else
                    for (this.y_pos = s.getStave().getYForLine(4) + 20, e = 0; e < this.notes.length; ++e) {
                        var o = this.notes[e].getStemExtents().topY + 10;
                        o > this.y_pos && (this.y_pos = o)
                    }
            var n, r = 0;
            for (n in this.num_glyphs) r += this.num_glyphs[n].getMetrics().width;
            if (this.ratioed) {
                for (n in this.denom_glyphs) r += this.denom_glyphs[n].getMetrics().width;
                r += .32 * this.point
            }
            var p = this.x_pos + this.width / 2,
                c = p - r / 2;
            if (this.bracketed) {
                var a = this.width / 2 - r / 2 - 5;
                a > 0 && (this.context.fillRect(this.x_pos, this.y_pos, a, 1), this.context.fillRect(this.x_pos + this.width / 2 + r / 2 + 5, this.y_pos, a, 1), this.context.fillRect(this.x_pos, this.y_pos + (this.location == t.LOCATION_BOTTOM), 1, 10 * this.location), this.context.fillRect(this.x_pos + this.width, this.y_pos + (this.location == t.LOCATION_BOTTOM), 1, 10 * this.location))
            }
            var l = 0,
                u = this.num_glyphs.length;
            for (n in this.num_glyphs) this.num_glyphs[u - n - 1].render(this.context, c + l, this.y_pos + this.point / 3 - 2), l += this.num_glyphs[u - n - 1].getMetrics().width;
            if (this.ratioed) {
                var _ = c + l + .16 * this.point,
                    g = .06 * this.point;
                this.context.beginPath(), this.context.arc(_, this.y_pos - .08 * this.point, g, 0, 2 * Math.PI, !0), this.context.closePath(), this.context.fill(), this.context.beginPath(), this.context.arc(_, this.y_pos + .12 * this.point, g, 0, 2 * Math.PI, !0), this.context.closePath(), this.context.fill(), l += .32 * this.point, u = this.denom_glyphs.length;
                for (n in this.denom_glyphs) this.denom_glyphs[u - n - 1].render(this.context, c + l, this.y_pos + this.point / 3 - 2), l += this.denom_glyphs[u - n - 1].getMetrics().width
            }
        }
    }, t
}();
Vex.Flow.BoundingBox = function () {
    function t(t, i, h, s) {
        this.init(t, i, h, s)
    }
    return t.prototype = {
        init: function (t, i, h, s) {
            this.x = t, this.y = i, this.w = h, this.h = s
        },
        getX: function () {
            return this.x
        },
        getY: function () {
            return this.y
        },
        getW: function () {
            return this.w
        },
        getH: function () {
            return this.h
        },
        setX: function (t) {
            return this.x = t, this
        },
        setY: function (t) {
            return this.y = t, this
        },
        setW: function (t) {
            return this.w = t, this
        },
        setH: function (t) {
            return this.h = t, this
        },
        mergeWith: function (t, i) {
            var h = t,
                s = this.x < h.x ? this.x : h.x,
                n = this.y < h.y ? this.y : h.y,
                r = this.x + this.w < h.x + h.w ? h.x + h.w - this.x : this.x + this.w - Vex.Min(this.x, h.x),
                e = this.y + this.h < h.y + h.h ? h.y + h.h - this.y : this.y + this.h - Vex.Min(this.y, h.y);
            return this.x = s, this.y = n, this.w = r, this.h = e, i && this.draw(i), this
        },
        draw: function (t) {
            t.rect(this.x, this.y, this.w, this.h), t.stroke()
        }
    }, t
}();
Vex.Flow.TextNote = function () {
    function t(t) {
        arguments.length > 0 && this.init(t)
    }
    return t.Justification = {
        LEFT: 1,
        CENTER: 2,
        RIGHT: 3
    }, t.GLYPHS = {
        segno: {
            code: "v8c",
            point: 40,
            x_shift: 0,
            y_shift: -10
        },
        tr: {
            code: "v1f",
            point: 40,
            x_shift: 0,
            y_shift: 0
        },
        mordent: {
            code: "v1e",
            point: 40,
            x_shift: 0,
            y_shift: 0
        },
        f: {
            code: "vba",
            point: 40,
            x_shift: 0,
            y_shift: 0
        },
        p: {
            code: "vbf",
            point: 40,
            x_shift: 0,
            y_shift: 0
        },
        m: {
            code: "v62",
            point: 40,
            x_shift: 0,
            y_shift: 0
        },
        s: {
            code: "v4a",
            point: 40,
            x_shift: 0,
            y_shift: 0
        },
        coda: {
            code: "v4d",
            point: 40,
            x_shift: 0,
            y_shift: -8
        }
    }, Vex.Inherit(t, Vex.Flow.Note, {
        init: function (i) {
            if (t.superclass.init.call(this, i), this.text = i.text, this.glyph_type = i.glyph, this.glyph = null, this.font = {
                family: "Arial",
                size: 12,
                weight: ""
            }, i.font && (this.font = i.font), this.glyph_type) {
                var s = t.GLYPHS[this.glyph_type];
                if (!s) throw new Vex.RERR("Invalid glyph type: " + this.glyph_type);
                this.glyph = new Vex.Flow.Glyph(s.code, s.point, {
                    cache: !1
                }), s.width ? this.setWidth(s.width) : this.setWidth(this.glyph.getMetrics().width), this.glyph_struct = s
            } else this.setWidth(Vex.Flow.textWidth(this.text));
            this.line = i.line || 0, this.smooth = i.smooth || !1, this.ignore_ticks = i.ignore_ticks || !1, this.justification = t.Justification.LEFT
        },
        setJustification: function (t) {
            return this.justification = t, this
        },
        setLine: function (t) {
            return this.line = t, this
        },
        preFormat: function () {
            if (!this.context) throw new Vex.RERR("NoRenderContext", "Can't measure text without rendering context.");
            this.preFormatted || (this.smooth ? this.setWidth(0) : this.glyph || this.setWidth(this.context.measureText(this.text).width), this.justification == t.Justification.CENTER ? this.extraLeftPx = this.width / 2 : this.justification == t.Justification.RIGHT && (this.extraLeftPx = this.width), this.setPreFormatted(!0))
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
            if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");
            var i = this.context,
                s = this.getAbsoluteX();
            this.justification == t.Justification.CENTER ? s -= this.getWidth() / 2 : this.justification == t.Justification.RIGHT && (s -= this.getWidth());
            var h;
            this.glyph ? (h = this.stave.getYForLine(this.line + -3), this.glyph.render(this.context, s + this.glyph_struct.x_shift, h + this.glyph_struct.y_shift)) : (h = this.stave.getYForLine(this.line + -3), i.save(), i.setFont(this.font.family, this.font.size, this.font.weight), i.fillText(this.text, s, h), i.restore())
        }
    }), t
}();
Vex.Flow.FretHandFinger = function () {
    function t(t) {
        arguments.length > 0 && this.init(t)
    }
    var i = Vex.Flow.Modifier;
    return Vex.Inherit(t, i, {
        init: function (t) {
            var n = Vex.Flow.FretHandFinger.superclass;
            n.init.call(this), this.note = null, this.index = null, this.finger = t, this.width = 7, this.position = i.Position.LEFT, this.x_shift = 0, this.y_shift = 0, this.x_offset = 0, this.y_offset = 0, this.font = {
                family: "sans-serif",
                size: 9,
                weight: "bold"
            }
        },
        getCategory: function () {
            return "frethandfinger"
        },
        getNote: function () {
            return this.note
        },
        setNote: function (t) {
            return this.note = t, this
        },
        getIndex: function () {
            return this.index
        },
        setIndex: function (t) {
            return this.index = t, this
        },
        getPosition: function () {
            return this.position
        },
        setPosition: function (t) {
            return t >= i.Position.LEFT && t <= i.Position.BELOW && (this.position = t), this
        },
        setFretHandFinger: function (t) {
            return this.finger = t, this
        },
        setOffsetX: function (t) {
            return this.x_offset = t, this
        },
        setOffsetY: function (t) {
            return this.y_offset = t, this
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoContext", "Can't draw string number without a context.");
            if (!this.note || null == this.index) throw new Vex.RERR("NoAttachedNote", "Can't draw string number without a note and index.");
            var t = this.context,
                n = this.note.getModifierStartXY(this.position, this.index),
                e = n.x + this.x_shift + this.x_offset,
                s = n.y + this.y_shift + this.y_offset + 5;
            switch (this.position) {
            case i.Position.ABOVE:
                e -= 4, s -= 12;
                break;
            case i.Position.BELOW:
                e -= 2, s += 10;
                break;
            case i.Position.LEFT:
                e -= this.width;
                break;
            case i.Position.RIGHT:
                e += 1
            }
            t.save(), t.setFont(this.font.family, this.font.size, this.font.weight), t.fillText("" + this.finger, e, s), t.restore()
        }
    }), t
}();
Vex.Flow.StringNumber = function () {
    function t(t) {
        arguments.length > 0 && this.init(t)
    }
    var e = Vex.Flow.Modifier;
    return Vex.Inherit(t, e, {
        init: function (i) {
            t.superclass.init.call(this), this.note = null, this.last_note = null, this.index = null, this.string_number = i, this.setWidth(20), this.position = e.Position.ABOVE, this.x_shift = 0, this.y_shift = 0, this.x_offset = 0, this.y_offset = 0, this.dashed = !0, this.leg = Vex.Flow.Renderer.LineEndType.NONE, this.radius = 8, this.font = {
                family: "sans-serif",
                size: 10,
                weight: "bold"
            }
        },
        getCategory: function () {
            return "stringnumber"
        },
        getNote: function () {
            return this.note
        },
        setNote: function (t) {
            return this.note = t, this
        },
        getIndex: function () {
            return this.index
        },
        setIndex: function (t) {
            return this.index = t, this
        },
        setLineEndType: function (t) {
            return t >= Vex.Flow.Renderer.LineEndType.NONE && t <= Vex.Flow.Renderer.LineEndType.DOWN && (this.leg = t), this
        },
        getPosition: function () {
            return this.position
        },
        setPosition: function (t) {
            return t >= e.Position.LEFT && t <= e.Position.BELOW && (this.position = t), this
        },
        setStringNumber: function (t) {
            return this.string_number = t, this
        },
        setOffsetX: function (t) {
            return this.x_offset = t, this
        },
        setOffsetY: function (t) {
            return this.y_offset = t, this
        },
        setLastNote: function (t) {
            return this.last_note = t, this
        },
        setDashed: function (t) {
            return this.dashed = t, this
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoContext", "Can't draw string number without a context.");
            if (!this.note || null == this.index) throw new Vex.RERR("NoAttachedNote", "Can't draw string number without a note and index.");
            var t = this.context,
                i = this.note.stave.options.spacing_between_lines_px,
                s = this.note.getModifierStartXY(this.position, this.index),
                n = s.x + this.x_shift + this.x_offset,
                o = s.y + this.y_shift + this.y_offset;
            switch (this.position) {
            case e.Position.ABOVE:
            case e.Position.BELOW:
                var h = this.note.getStemExtents(),
                    r = h.topY,
                    a = h.baseY + 2;
                this.note.stem_direction == Vex.Flow.StaveNote.STEM_DOWN && (r = h.baseY, a = h.topY - 2), o = this.position == e.Position.ABOVE ? this.note.hasStem() ? r - 1.75 * i : s.y - 1.75 * i : this.note.hasStem() ? a + 1.5 * i : s.y + 1.75 * i, o += this.y_shift + this.y_offset;
                break;
            case e.Position.LEFT:
                n -= this.radius / 2 + 5;
                break;
            case e.Position.RIGHT:
                n += this.radius / 2 + 6
            }
            t.save(), t.beginPath(), t.arc(n, o, this.radius, 0, 2 * Math.PI, !1), t.lineWidth = 1.5, t.stroke(), t.setFont(this.font.family, this.font.size, this.font.weight);
            var d = n - t.measureText(this.string_number).width / 2;
            if (t.fillText("" + this.string_number, d, o + 4.5), null != this.last_note) {
                var u = this.last_note.getStemX() - this.note.getX() + 5;
                t.strokeStyle = "#000000", t.lineCap = "round", t.lineWidth = .6, this.dashed ? Vex.Flow.Renderer.drawDashedLine(t, n + 10, o, n + u, o, [3, 3]) : Vex.Flow.Renderer.drawDashedLine(t, n + 10, o, n + u, o, [3, 0]);
                var f, l;
                switch (this.leg) {
                case Vex.Flow.Renderer.LineEndType.UP:
                    f = -10, l = this.dashed ? [3, 3] : [3, 0], Vex.Flow.Renderer.drawDashedLine(t, n + u, o, n + u, o + f, l);
                    break;
                case Vex.Flow.Renderer.LineEndType.DOWN:
                    f = 10, l = this.dashed ? [3, 3] : [3, 0], Vex.Flow.Renderer.drawDashedLine(t, n + u, o, n + u, o + f, l)
                }
            }
            t.restore()
        }
    }), t
}();
Vex.Flow.Stroke = function () {
    function t(t, e) {
        arguments.length > 0 && this.init(t, e)
    }
    t.Type = {
        BRUSH_DOWN: 1,
        BRUSH_UP: 2,
        ROLL_DOWN: 3,
        ROLL_UP: 4,
        RASQUEDO_DOWN: 5,
        RASQUEDO_UP: 6
    };
    var e = Vex.Flow.Modifier;
    return Vex.Inherit(t, e, {
        init: function (i, s) {
            t.superclass.init.call(this), this.note = null, this.options = Vex.Merge({}, s), this.all_voices = "all_voices" in this.options ? this.options.all_voices : !0, this.note_end = null, this.index = null, this.type = i, this.position = e.Position.LEFT, this.render_options = {
                font_scale: 38,
                stroke_px: 3,
                stroke_spacing: 10
            }, this.font = {
                family: "serif",
                size: 10,
                weight: "bold italic"
            }, this.setXShift(0), this.setWidth(10)
        },
        getCategory: function () {
            return "strokes"
        },
        getPosition: function () {
            return this.position
        },
        addEndNote: function (t) {
            return this.note_end = t, this
        },
        draw: function () {
            if (!this.context) throw new Vex.RERR("NoContext", "Can't draw stroke without a context.");
            if (!this.note || null == this.index) throw new Vex.RERR("NoAttachedNote", "Can't draw stroke without a note and index.");
            var e, i = this.note.getModifierStartXY(this.position, this.index),
                s = this.note.getYs(),
                o = i.y,
                n = i.y,
                h = i.x - 5,
                r = this.note.stave.options.spacing_between_lines_px,
                a = this.getModifierContext().getModifiers(this.note.getCategory());
            for (e = 0; e < a.length; e++) {
                s = a[e].getYs();
                for (var l = 0; l < s.length; l++)(this.note == a[e] || this.all_voices) && (o = Vex.Min(o, s[l]), n = Vex.Max(n, s[l]))
            }
            var c, f, x, _, p;
            switch (this.type) {
            case t.Type.BRUSH_DOWN:
                c = "vc3", f = -3, x = o - r / 2 + 10, n += r / 2;
                break;
            case t.Type.BRUSH_UP:
                c = "v11", f = .5, x = n + r / 2, o -= r / 2;
                break;
            case t.Type.ROLL_DOWN:
            case t.Type.RASQUEDO_DOWN:
                c = "vc3", f = -3, _ = this.x_shift + f - 2, this.note instanceof Vex.Flow.StaveNote ? (o += 1.5 * r, n += 0 !== (n - o) % 2 ? .5 * r : r, x = o - r, p = n + r + 2) : (o += 1.5 * r, n += r, x = o - .75 * r, p = n + .25 * r);
                break;
            case t.Type.ROLL_UP:
            case t.Type.RASQUEDO_UP:
                c = "v52", f = -4, _ = this.x_shift + f - 1, this.note instanceof Vex.Flow.StaveNote ? (x = r / 2, o += .5 * r, 0 === (n - o) % 2 && (n += r / 2), x = n + .5 * r, p = o - 1.25 * r) : (o += .25 * r, n += .5 * r, x = n + .25 * r, p = o - r)
            }
            if (this.type == t.Type.BRUSH_DOWN || this.type == t.Type.BRUSH_UP) this.context.fillRect(h + this.x_shift, o, 1, n - o);
            else if (this.note instanceof Vex.Flow.StaveNote)
                for (e = o; n >= e; e += r) Vex.Flow.renderGlyph(this.context, h + this.x_shift - 4, e, this.render_options.font_scale, "va3");
            else {
                for (e = o; n >= e; e += 10) Vex.Flow.renderGlyph(this.context, h + this.x_shift - 4, e, this.render_options.font_scale, "va3");
                this.type == Vex.Flow.Stroke.Type.RASQUEDO_DOWN && (p = e + .25 * r)
            }
            Vex.Flow.renderGlyph(this.context, h + this.x_shift + f, x, this.render_options.font_scale, c), (this.type == t.Type.RASQUEDO_DOWN || this.type == t.Type.RASQUEDO_UP) && (this.context.save(), this.context.setFont(this.font.family, this.font.size, this.font.weight), this.context.fillText("R", h + _, p), this.context.restore())
        }
    }), t
}();