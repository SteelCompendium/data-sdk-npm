"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ability = void 0;
const dto_1 = require("../dto");
const Effects_1 = require("./Effects");
const SteelCompendiumModel_1 = require("./SteelCompendiumModel");
const AbilityXmlDTO_1 = require("../dto/AbilityXmlDTO");
class Ability extends SteelCompendiumModel_1.SteelCompendiumModel {
    constructor(source) {
        var _a;
        super();
        Object.assign(this, source);
        this.effects = (_a = source.effects) !== null && _a !== void 0 ? _a : new Effects_1.Effects([]);
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
}
exports.Ability = Ability;
Ability.modelDTOAdapter = (source) => new dto_1.AbilityDTO(source).toModel();
//# sourceMappingURL=Ability.js.map