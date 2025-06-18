"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statblock = void 0;
const Ability_1 = require("./Ability");
const Trait_1 = require("./Trait");
const Characteristics_1 = require("./Characteristics");
const dto_1 = require("../dto");
const SteelCompendiumModel_1 = require("./SteelCompendiumModel");
class Statblock extends SteelCompendiumModel_1.SteelCompendiumModel {
    constructor(source) {
        var _a, _b, _c;
        super();
        Object.assign(this, source);
        this.characteristics = (_a = source.characteristics) !== null && _a !== void 0 ? _a : new Characteristics_1.Characteristics(0, 0, 0, 0, 0);
        this.traits = (_b = source.traits) !== null && _b !== void 0 ? _b : [];
        this.abilities = (_c = source.abilities) !== null && _c !== void 0 ? _c : [];
    }
    static fromDTO(dto) {
        var _a, _b, _c, _d;
        return new Statblock(Object.assign(Object.assign({}, dto), { freeStrike: dto.free_strike, withCaptain: dto.with_captain, characteristics: new Characteristics_1.Characteristics(dto.might, dto.agility, dto.reason, dto.intuition, dto.presence), traits: (_b = (_a = dto.traits) === null || _a === void 0 ? void 0 : _a.map(t => Trait_1.Trait.fromDTO(t))) !== null && _b !== void 0 ? _b : [], abilities: (_d = (_c = dto.abilities) === null || _c === void 0 ? void 0 : _c.map(a => Ability_1.Ability.fromDTO(a))) !== null && _d !== void 0 ? _d : [] }));
    }
    toDTO() {
        return dto_1.StatblockDTO.partialFromModel(this);
    }
}
exports.Statblock = Statblock;
Statblock.modelDTOAdapter = (source) => new dto_1.StatblockDTO(source).toModel();
//# sourceMappingURL=Statblock.js.map