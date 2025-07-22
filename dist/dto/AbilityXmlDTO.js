"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbilityXmlDTO = void 0;
const SteelCompendiumDTO_1 = require("./SteelCompendiumDTO");
const model_1 = require("../model");
class AbilityXmlDTO extends SteelCompendiumDTO_1.SteelCompendiumDTO {
    constructor(source) {
        super(source);
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
            dto.keywords = { keyword: model.keywords };
        if (model.type !== undefined)
            dto.type = model.type;
        if (model.distance !== undefined)
            dto.distance = model.distance;
        if (model.target !== undefined)
            dto.target = model.target;
        if (model.trigger !== undefined)
            dto.trigger = model.trigger;
        if (model.metadata !== undefined)
            dto.metadata = model.metadata;
        const effects = model.effects.toXmlDTO();
        if (effects.length > 0) {
            dto.effects = { effect: effects.map((e) => e) };
        }
        return dto;
    }
    toModel() {
        // flatten your keyword list as before
        const keywords = this.keywords
            ? [this.keywords.keyword].flat().filter(Boolean)
            : undefined;
        // pull out the ordered array of raw effects (or [] if absent)
        const es = this.effects ? [this.effects.effect].flat() : [];
        return new model_1.Ability({
            name: this.name,
            type: this.type,
            cost: this.cost,
            keywords: keywords,
            distance: this.distance,
            target: this.target,
            trigger: this.trigger,
            flavor: this.flavor,
            effects: model_1.Effects.fromDTO(es),
            metadata: this.metadata,
        });
    }
}
exports.AbilityXmlDTO = AbilityXmlDTO;
//# sourceMappingURL=AbilityXmlDTO.js.map