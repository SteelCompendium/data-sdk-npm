"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureblockDTO = void 0;
const Featureblock_1 = require("../model/Featureblock");
const SteelCompendiumDTO_1 = require("./SteelCompendiumDTO");
class FeatureblockDTO extends SteelCompendiumDTO_1.SteelCompendiumDTO {
    constructor(source) {
        var _a, _b;
        super(source);
        this.stats = (_a = source.stats) !== null && _a !== void 0 ? _a : [];
        this.features = (_b = source.features) !== null && _b !== void 0 ? _b : [];
    }
    static partialFromModel(model) {
        const data = {};
        if (model.name !== undefined)
            data.name = model.name;
        if (model.type !== undefined)
            data.type = model.type;
        if (model.level !== undefined)
            data.level = model.level;
        if (model.ev !== undefined)
            data.ev = model.ev;
        if (model.flavor !== undefined)
            data.flavor = model.flavor;
        if (model.stamina !== undefined)
            data.stamina = model.stamina;
        if (model.size !== undefined)
            data.size = model.size;
        if (model.stats !== undefined)
            data.stats = model.stats;
        if (model.features !== undefined)
            data.features = model.features.map(f => f.toDTO());
        return data;
    }
    static fromModel(model) {
        return new FeatureblockDTO(model.toDTO());
    }
    toModel() {
        return Featureblock_1.Featureblock.fromDTO(this);
    }
}
exports.FeatureblockDTO = FeatureblockDTO;
//# sourceMappingURL=FeatureblockDTO.js.map