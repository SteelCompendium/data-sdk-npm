"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MundaneEffect = void 0;
const Effect_1 = require("./Effect");
class MundaneEffect extends Effect_1.Effect {
    constructor(source) {
        var _a;
        super();
        Object.assign(this, source);
        this.effect = (_a = source.effect) !== null && _a !== void 0 ? _a : '';
    }
    effectType() {
        return 'MundaneEffect';
    }
    toDTO() {
        const dto = {
            effect: this.effect,
        };
        if (this.name !== undefined)
            dto.name = this.name;
        if (this.cost !== undefined)
            dto.cost = this.cost;
        return dto;
    }
    toXmlDTO() {
        const dto = {
            '@_type': 'mundane',
            '#text': this.effect,
        };
        if (this.name !== undefined)
            dto['@_name'] = this.name;
        if (this.cost !== undefined)
            dto['@_cost'] = this.cost;
        return dto;
    }
}
exports.MundaneEffect = MundaneEffect;
//# sourceMappingURL=MundaneEffect.js.map