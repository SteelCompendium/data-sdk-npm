"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trait = void 0;
const dto_1 = require("../dto");
const SteelCompendiumModel_1 = require("./SteelCompendiumModel");
const Effects_1 = require("./Effects");
class Trait extends SteelCompendiumModel_1.SteelCompendiumModel {
    constructor(source) {
        var _a;
        super();
        Object.assign(this, source);
        this.effects = (_a = source.effects) !== null && _a !== void 0 ? _a : new Effects_1.Effects([]);
    }
    featureType() {
        return "Trait";
    }
    static fromDTO(dto) {
        const newDto = Object.assign({}, dto);
        if (newDto.name) {
            newDto.name = newDto.name.trim();
        }
        return new Trait(Object.assign(Object.assign({}, newDto), { effects: Effects_1.Effects.fromDTO(dto.effects) }));
    }
    toDTO() {
        return dto_1.TraitDTO.partialFromModel(this);
    }
}
exports.Trait = Trait;
Trait.modelDTOAdapter = (source) => new dto_1.TraitDTO(source).toModel();
//# sourceMappingURL=Trait.js.map