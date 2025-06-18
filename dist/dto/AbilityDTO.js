"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbilityDTO = void 0;
const Ability_1 = require("../model/Ability");
const SteelCompendiumDTO_1 = require("./SteelCompendiumDTO");
class AbilityDTO extends SteelCompendiumDTO_1.SteelCompendiumDTO {
    constructor(source) {
        var _a;
        super(source);
        this.effects = (_a = source.effects) !== null && _a !== void 0 ? _a : [];
    }
    static partialFromModel(model) {
        const dto = {};
        if (model.name !== undefined)
            dto.name = model.name;
        if (model.cost !== undefined)
            dto.cost = model.cost;
        if (model.flavor !== undefined)
            dto.flavor = model.flavor;
        if (model.keywords !== undefined)
            dto.keywords = model.keywords;
        if (model.type !== undefined)
            dto.type = model.type;
        if (model.distance !== undefined)
            dto.distance = model.distance;
        if (model.target !== undefined)
            dto.target = model.target;
        if (model.trigger !== undefined)
            dto.trigger = model.trigger;
        dto.effects = model.effects.toDTO();
        return dto;
    }
    static fromModel(model) {
        return new AbilityDTO(model.toDTO());
    }
    toModel() {
        return Ability_1.Ability.fromDTO(this);
    }
}
exports.AbilityDTO = AbilityDTO;
//# sourceMappingURL=AbilityDTO.js.map