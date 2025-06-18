"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MundaneEffect = exports.PowerRollEffect = exports.Effect = void 0;
const yaml_1 = require("yaml");
class Effect {
    static allFrom(data) {
        if (!data) {
            return [];
        }
        if (!Array.isArray(data)) {
            throw new Error("Expected effects to be an array");
        }
        const effects = [];
        for (const entry of data) {
            effects.push(Effect.from(entry));
        }
        return effects;
    }
    static from(data) {
        if (data.roll) {
            return PowerRollEffect.from(data);
        }
        else if (data.name && data.effect) {
            return MundaneEffect.from(data);
        }
        else if (data.cost && data.effect) {
            return MundaneEffect.from(data);
        }
        else if (typeof data === "string") {
            return MundaneEffect.nameless(data);
        }
        else {
            return MundaneEffect.parseKeyValue(data);
        }
    }
    static fromYaml(yaml) {
        return Effect.from((0, yaml_1.parse)(yaml));
    }
    static fromJson(json) {
        return Effect.from(JSON.parse(json));
    }
}
exports.Effect = Effect;
class PowerRollEffect extends Effect {
    constructor(roll, t1, t2, t3, crit) {
        super();
        this.roll = roll;
        this.t1 = t1;
        this.t2 = t2;
        this.t3 = t3;
        this.crit = crit;
    }
    static from(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return new PowerRollEffect(data.roll, (_b = (_a = data.t1) !== null && _a !== void 0 ? _a : data["tier 1"]) !== null && _b !== void 0 ? _b : data["11 or lower"], (_d = (_c = data.t2) !== null && _c !== void 0 ? _c : data["tier 2"]) !== null && _d !== void 0 ? _d : data["12-16"], (_f = (_e = data.t3) !== null && _e !== void 0 ? _e : data["tier 3"]) !== null && _f !== void 0 ? _f : data["17+"], (_h = (_g = data.critical) !== null && _g !== void 0 ? _g : data.crit) !== null && _h !== void 0 ? _h : data["nat 19-20"]);
    }
    static fromYaml(yaml) {
        return PowerRollEffect.from((0, yaml_1.parse)(yaml));
    }
    static fromJson(json) {
        return PowerRollEffect.from(JSON.parse(json));
    }
    toYaml() {
        return (0, yaml_1.stringify)(this);
    }
    toJson() {
        return JSON.stringify(this);
    }
    effectType() {
        return "PowerRollEffect";
    }
}
exports.PowerRollEffect = PowerRollEffect;
class MundaneEffect extends Effect {
    static parseKeyValue(data) {
        const key = Object.keys(data)[0];
        const effect = data[key];
        return new MundaneEffect(key, undefined, effect);
    }
    static from(data) {
        return new MundaneEffect(data.name, data.cost, data.effect);
    }
    static nameless(effect) {
        return new MundaneEffect(effect, undefined, undefined);
    }
    constructor(effect, name, cost) {
        super();
        this.name = name;
        this.cost = cost;
        this.effect = effect;
    }
    static fromYaml(yaml) {
        return MundaneEffect.from((0, yaml_1.parse)(yaml));
    }
    static fromJson(json) {
        return MundaneEffect.from(JSON.parse(json));
    }
    toYaml() {
        return (0, yaml_1.stringify)(this);
    }
    toJson() {
        return JSON.stringify(this);
    }
    effectType() {
        return "MundaneEffect";
    }
}
exports.MundaneEffect = MundaneEffect;
//# sourceMappingURL=Effect.js.map