"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Effects = void 0;
exports.effectFromDTO = effectFromDTO;
const MundaneEffect_1 = require("./MundaneEffect");
const PowerRollEffect_1 = require("./PowerRollEffect");
class Effects {
    constructor(effects) {
        this.effects = effects;
    }
    static fromDTO(data) {
        if (!data) {
            return new Effects([]);
        }
        if (!Array.isArray(data)) {
            throw new Error("Expected effects to be an array");
        }
        return new Effects(data.map(effectFromDTO));
    }
    toDTO() {
        return this.effects.map(e => e.toDTO());
    }
}
exports.Effects = Effects;
function effectFromDTO(data) {
    if (data.roll) {
        return PowerRollEffect_1.PowerRollEffect.fromDTO(data);
    }
    else if (typeof data === "string") {
        return new MundaneEffect_1.MundaneEffect({ effect: data });
    }
    else if (data.effect) {
        return new MundaneEffect_1.MundaneEffect({ effect: data.effect, name: data.name, cost: data.cost });
    }
    else {
        const key = Object.keys(data)[0];
        const effect = data[key];
        return new MundaneEffect_1.MundaneEffect({ effect: effect, name: key });
    }
}
//# sourceMappingURL=Effects.js.map