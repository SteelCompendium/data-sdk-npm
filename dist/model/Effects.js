"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Effects = void 0;
exports.effectFromDTO = effectFromDTO;
const MundaneEffect_1 = require("./MundaneEffect");
const PowerRollEffect_1 = require("./PowerRollEffect");
const TestEffect_1 = require("./TestEffect");
class Effects {
    constructor(effects) {
        this.effects = effects;
    }
    static fromDTO(data) {
        if (!data) {
            return new Effects([]);
        }
        if (!Array.isArray(data)) {
            console.log("NOT AN ARRAY\n" + JSON.stringify(data));
            throw new Error("Expected effects to be an array");
        }
        return new Effects(data.map(effectFromDTO));
    }
    toDTO() {
        return this.effects.map(e => e.toDTO());
    }
    toXmlDTO() {
        return this.effects.map(e => e.toXmlDTO());
    }
}
exports.Effects = Effects;
function effectFromDTO(effect_data) {
    if (effect_data['@_type'] === "mundane") {
        return new MundaneEffect_1.MundaneEffect({ effect: effect_data['#text'], name: effect_data['@_name'], cost: effect_data['@_cost'] });
    }
    else if (effect_data['@_type'] === "roll") {
        return PowerRollEffect_1.PowerRollEffect.fromDTO(effect_data);
    }
    else if (effect_data['@_type'] === "test") {
        return TestEffect_1.TestEffect.fromDTO(effect_data);
    }
    else if (effect_data.type === "mundane") {
        return new MundaneEffect_1.MundaneEffect({ effect: effect_data.text, name: effect_data.name, cost: effect_data.cost });
    }
    else if (effect_data.roll) {
        return PowerRollEffect_1.PowerRollEffect.fromDTO(effect_data);
    }
    else if (effect_data.effect && effect_data.t1) {
        return TestEffect_1.TestEffect.fromDTO(effect_data);
    }
    else if (typeof effect_data === "string") {
        return new MundaneEffect_1.MundaneEffect({ effect: effect_data });
    }
    else if (effect_data.effect) {
        return new MundaneEffect_1.MundaneEffect({ effect: effect_data.effect, name: effect_data.name, cost: effect_data.cost });
    }
    else {
        const key = Object.keys(effect_data)[0];
        const effect = effect_data[key];
        return new MundaneEffect_1.MundaneEffect({ effect: effect, name: key });
    }
}
//# sourceMappingURL=Effects.js.map