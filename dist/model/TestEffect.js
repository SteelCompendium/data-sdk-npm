"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEffect = void 0;
const Effect_1 = require("./Effect");
class TestEffect extends Effect_1.Effect {
    constructor(source) {
        super();
        Object.assign(this, source);
    }
    static fromDTO(dto) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const data = dto;
        return new TestEffect({
            name: data.name,
            cost: data.cost,
            effect: data.effect,
            t1: (_c = (_b = (_a = data.t1) !== null && _a !== void 0 ? _a : data["tier 1"]) !== null && _b !== void 0 ? _b : data["11 or lower"]) !== null && _c !== void 0 ? _c : data["≤11"],
            t2: (_f = (_e = (_d = data.t2) !== null && _d !== void 0 ? _d : data["tier 2"]) !== null && _e !== void 0 ? _e : data["12-16"]) !== null && _f !== void 0 ? _f : data["12–16"],
            t3: (_h = (_g = data.t3) !== null && _g !== void 0 ? _g : data["tier 3"]) !== null && _h !== void 0 ? _h : data["17+"],
            crit: (_k = (_j = data.critical) !== null && _j !== void 0 ? _j : data.crit) !== null && _k !== void 0 ? _k : data["nat 19-20"]
        });
    }
    toDTO() {
        const dto = {};
        if (this.name !== undefined)
            dto.name = this.name;
        if (this.cost !== undefined)
            dto.cost = this.cost;
        if (this.effect !== undefined)
            dto.effect = this.effect;
        if (this.t1 !== undefined)
            dto.t1 = this.t1;
        if (this.t2 !== undefined)
            dto.t2 = this.t2;
        if (this.t3 !== undefined)
            dto.t3 = this.t3;
        if (this.crit !== undefined)
            dto.crit = this.crit;
        return dto;
    }
    toXmlDTO() {
        return {
            '@_type': 'test',
            name: this.name,
            cost: this.cost,
            effect: this.effect,
            t1: this.t1,
            t2: this.t2,
            t3: this.t3,
            crit: this.crit,
        };
    }
    effectType() {
        return "TestEffect";
    }
}
exports.TestEffect = TestEffect;
//# sourceMappingURL=TestEffect.js.map