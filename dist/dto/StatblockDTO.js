"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatblockDTO = void 0;
const SteelCompendiumDTO_1 = require("./SteelCompendiumDTO");
const Statblock_1 = require("../model/Statblock");
class StatblockDTO extends SteelCompendiumDTO_1.SteelCompendiumDTO {
    constructor(source) {
        var _a, _b;
        super(source);
        this.traits = (_a = source.traits) !== null && _a !== void 0 ? _a : [];
        this.abilities = (_b = source.abilities) !== null && _b !== void 0 ? _b : [];
    }
    static partialFromModel(model) {
        const data = {};
        if (model.name !== undefined)
            data.name = model.name;
        if (model.level !== undefined)
            data.level = model.level;
        if (model.roles !== undefined)
            data.roles = model.roles;
        if (model.ancestry !== undefined)
            data.ancestry = model.ancestry;
        if (model.ev !== undefined)
            data.ev = model.ev;
        if (model.stamina !== undefined)
            data.stamina = model.stamina;
        if (model.immunities !== undefined && model.immunities.length > 0)
            data.immunities = model.immunities;
        if (model.weaknesses !== undefined && model.weaknesses.length > 0)
            data.weaknesses = model.weaknesses;
        if (model.speed !== undefined)
            data.speed = model.speed;
        if (model.size !== undefined)
            data.size = model.size;
        if (model.stability !== undefined)
            data.stability = model.stability;
        if (model.freeStrike !== undefined)
            data.free_strike = model.freeStrike;
        if (model.withCaptain !== undefined)
            data.with_captain = model.withCaptain;
        if (model.characteristics !== undefined) {
            if (model.characteristics.might !== undefined)
                data.might = model.characteristics.might;
            if (model.characteristics.agility !== undefined)
                data.agility = model.characteristics.agility;
            if (model.characteristics.reason !== undefined)
                data.reason = model.characteristics.reason;
            if (model.characteristics.intuition !== undefined)
                data.intuition = model.characteristics.intuition;
            if (model.characteristics.presence !== undefined)
                data.presence = model.characteristics.presence;
        }
        if (model.traits !== undefined)
            data.traits = model.traits.map(t => t.toDTO());
        if (model.abilities !== undefined)
            data.abilities = model.abilities.map(a => a.toDTO());
        return data;
    }
    static fromModel(model) {
        return new StatblockDTO(model.toDTO());
    }
    toModel() {
        return Statblock_1.Statblock.fromDTO(this);
    }
}
exports.StatblockDTO = StatblockDTO;
//# sourceMappingURL=StatblockDTO.js.map