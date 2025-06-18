"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ability = void 0;
const Effect_1 = require("./Effect");
const yaml_1 = require("yaml");
class Ability {
    constructor(indent, name, cost, flavor, keywords, type, distance, target, trigger, effects) {
        this.indent = indent;
        this.name = name;
        this.cost = cost;
        this.flavor = flavor;
        this.keywords = keywords;
        this.type = type;
        this.distance = distance;
        this.target = target;
        this.trigger = trigger;
        this.effects = effects;
    }
    static from(data) {
        return new Ability(typeof data.indent === 'string' ? parseInt(data.indent) : data.indent, data.name, data.cost, data.flavor, data.keywords, data.type, data.distance, data.target, data.trigger, data.effects ? Effect_1.Effect.allFrom(data.effects) : []);
    }
    static fromYaml(yaml) {
        return Ability.from((0, yaml_1.parse)(yaml));
    }
    static fromJson(json) {
        return Ability.from(JSON.parse(json));
    }
    toYaml() {
        return (0, yaml_1.stringify)(this);
    }
    toJson() {
        return JSON.stringify(this);
    }
}
exports.Ability = Ability;
//# sourceMappingURL=Ability.js.map