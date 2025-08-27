"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraitDTO = void 0;
const SteelCompendiumDTO_1 = require("./SteelCompendiumDTO");
const Trait_1 = require("../model/Trait");
class TraitDTO extends SteelCompendiumDTO_1.SteelCompendiumDTO {
    constructor(source) {
        var _a;
        super(source);
        this.effects = (_a = source.effects) !== null && _a !== void 0 ? _a : [];
    }
    static partialFromModel(model) {
        const dto = {};
        if (model.name !== undefined)
            dto.name = model.name;
        if (model.icon !== undefined)
            dto.icon = model.icon;
        dto.effects = model.effects.toDTO();
        return dto;
    }
    static fromModel(model) {
        return new TraitDTO(model.toDTO());
    }
    toModel() {
        return Trait_1.Trait.fromDTO(this);
    }
}
exports.TraitDTO = TraitDTO;
//# sourceMappingURL=TraitDTO.js.map