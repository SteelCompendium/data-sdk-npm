"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerRollEffect = void 0;
const Effect_1 = require("./Effect");
class PowerRollEffect extends Effect_1.Effect {
    constructor(source) {
        super();
        Object.assign(this, source);
    }
    static fromDTO(dto) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const data = dto;
        return new PowerRollEffect({
            roll: data.roll,
            t1: (_b = (_a = data.t1) !== null && _a !== void 0 ? _a : data["tier 1"]) !== null && _b !== void 0 ? _b : data["11 or lower"],
            t2: (_d = (_c = data.t2) !== null && _c !== void 0 ? _c : data["tier 2"]) !== null && _d !== void 0 ? _d : data["12-16"],
            t3: (_f = (_e = data.t3) !== null && _e !== void 0 ? _e : data["tier 3"]) !== null && _f !== void 0 ? _f : data["17+"],
            crit: (_h = (_g = data.critical) !== null && _g !== void 0 ? _g : data.crit) !== null && _h !== void 0 ? _h : data["nat 19-20"]
        });
    }
    toDTO() {
        const dto = {};
        if (this.roll !== undefined)
            dto.roll = this.roll;
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
    effectType() {
        return "PowerRollEffect";
    }
}
exports.PowerRollEffect = PowerRollEffect;
//# sourceMappingURL=PowerRollEffect.js.map