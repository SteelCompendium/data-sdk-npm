"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trait = void 0;
const Effect_1 = require("./Effect");
const yaml_1 = require("yaml");
class Trait {
    constructor(name, type, effects) {
        this.name = name;
        this.type = type;
        this.effects = effects;
    }
    static from(data) {
        var _a, _b, _c;
        return new Trait((_b = (_a = data.name) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '', (_c = data.type) === null || _c === void 0 ? void 0 : _c.trim(), data.effects ? Effect_1.Effect.allFrom(data.effects) : []);
    }
    static fromYaml(yaml) {
        return Trait.from((0, yaml_1.parse)(yaml));
    }
    static fromJson(json) {
        return Trait.from(JSON.parse(json));
    }
    toYaml() {
        return (0, yaml_1.stringify)(this);
    }
    toJson() {
        return JSON.stringify(this);
    }
}
exports.Trait = Trait;
//# sourceMappingURL=Trait.js.map