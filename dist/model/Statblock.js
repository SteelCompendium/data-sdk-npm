"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statblock = void 0;
const Ability_1 = require("./Ability");
const Trait_1 = require("./Trait");
const Characteristics_1 = require("./Characteristics");
const yaml_1 = require("yaml");
class Statblock {
    constructor(name, level, roles, ancestry, ev, stamina, immunities, weaknesses, speed, size, stability, freeStrike, withCaptain, characteristics, traits, abilities) {
        this.name = name;
        this.level = level;
        this.roles = roles;
        this.ancestry = ancestry;
        this.ev = ev;
        this.stamina = stamina;
        this.immunities = immunities;
        this.weaknesses = weaknesses;
        this.speed = speed;
        this.size = size;
        this.stability = stability;
        this.freeStrike = freeStrike;
        this.withCaptain = withCaptain;
        this.characteristics = characteristics;
        this.traits = traits;
        this.abilities = abilities;
    }
    static from(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return new Statblock(data.name, data.level, (_a = data.roles) !== null && _a !== void 0 ? _a : [], (_b = data.ancestry) !== null && _b !== void 0 ? _b : [], data.ev, data.stamina, (_c = data.immunities) !== null && _c !== void 0 ? _c : [], (_d = data.weaknesses) !== null && _d !== void 0 ? _d : [], data.speed, data.size, data.stability, data.free_strike, data.with_captain, Characteristics_1.Characteristics.from(data.characteristics), (_f = (_e = data.traits) === null || _e === void 0 ? void 0 : _e.map((t) => Trait_1.Trait.from(t))) !== null && _f !== void 0 ? _f : [], (_h = (_g = data.abilities) === null || _g === void 0 ? void 0 : _g.map((a) => Ability_1.Ability.from(a))) !== null && _h !== void 0 ? _h : []);
    }
    static fromYaml(yaml) {
        return Statblock.from((0, yaml_1.parse)(yaml));
    }
    static fromJson(json) {
        return Statblock.from(JSON.parse(json));
    }
    toYaml() {
        return (0, yaml_1.stringify)(this);
    }
    toJson() {
        return JSON.stringify(this);
    }
}
exports.Statblock = Statblock;
//# sourceMappingURL=Statblock.js.map