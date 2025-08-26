"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ability = void 0;
const dto_1 = require("../dto");
const Effects_1 = require("./Effects");
const SteelCompendiumModel_1 = require("./SteelCompendiumModel");
const AbilityXmlDTO_1 = require("../dto/AbilityXmlDTO");
// Abilities as currently implemented blend the line of Ability and Trait...
class Ability extends SteelCompendiumModel_1.SteelCompendiumModel {
    constructor(source) {
        var _a, _b;
        super();
        Object.assign(this, source);
        this.metadata = (_a = source.metadata) !== null && _a !== void 0 ? _a : [];
        this.effects = (_b = source.effects) !== null && _b !== void 0 ? _b : new Effects_1.Effects([]);
    }
    static fromDTO(dto) {
        return new Ability(Object.assign(Object.assign({}, dto), { effects: Effects_1.Effects.fromDTO(dto.effects) }));
    }
    toDTO() {
        return dto_1.AbilityDTO.partialFromModel(this);
    }
    toXmlDTO() {
        return AbilityXmlDTO_1.AbilityXmlDTO.partialFromModel(this);
    }
    // This is not comprehensive
    isTrait() {
        var _a;
        return (!this.keywords || ((_a = this.keywords) === null || _a === void 0 ? void 0 : _a.length) == 0) && !this.type && !this.distance && !this.target;
    }
}
exports.Ability = Ability;
Ability.modelDTOAdapter = (source) => new dto_1.AbilityDTO(source).toModel();
//# sourceMappingURL=Ability.js.map