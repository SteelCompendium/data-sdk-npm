"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Featureblock = void 0;
const Ability_1 = require("./Ability");
const dto_1 = require("../dto");
const SteelCompendiumModel_1 = require("./SteelCompendiumModel");
class Featureblock extends SteelCompendiumModel_1.SteelCompendiumModel {
    constructor(source) {
        var _a, _b;
        super();
        Object.assign(this, source);
        this.stats = (_a = source.stats) !== null && _a !== void 0 ? _a : [];
        this.features = (_b = source.features) !== null && _b !== void 0 ? _b : [];
    }
    static fromDTO(dto) {
        var _a, _b;
        return new Featureblock(Object.assign(Object.assign({}, dto), { features: (_b = (_a = dto.features) === null || _a === void 0 ? void 0 : _a.map(f => Ability_1.Ability.fromDTO(f))) !== null && _b !== void 0 ? _b : [] }));
    }
    toDTO() {
        return dto_1.FeatureblockDTO.partialFromModel(this);
    }
}
exports.Featureblock = Featureblock;
Featureblock.modelDTOAdapter = (source) => new dto_1.FeatureblockDTO(source).toModel();
//# sourceMappingURL=Featureblock.js.map