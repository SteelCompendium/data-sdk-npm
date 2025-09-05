import { SteelCompendiumDTO } from "./SteelCompendiumDTO";
import { Feature, Effects } from "../model";

// Deprecated: XML support will be dropped in 1.0.0
export class AbilityXmlDTO extends SteelCompendiumDTO<Feature> {
    name!: string;
    type!: string;
    cost?: string;
    keywords?: { keyword: string[] };
    distance?: string;
    target?: string;
    trigger?: string;
    flavor?: string;
    effects?: any;
    metadata?: any;

    constructor(source: Partial<AbilityXmlDTO>) {
        super(source);
    }

    public static partialFromModel(model: Feature): Partial<AbilityXmlDTO> {
        const dto: Partial<AbilityXmlDTO> = {};
        if (model.name !== undefined) dto.name = model.name;
        if (model.cost !== undefined) dto.cost = model.cost;
        if (model.flavor !== undefined) dto.flavor = model.flavor;
        if (model.keywords !== undefined) dto.keywords = { keyword: model.keywords };
        if (model.type !== undefined) dto.type = model.type;
        if (model.distance !== undefined) dto.distance = model.distance;
        if (model.target !== undefined) dto.target = model.target;
        if (model.trigger !== undefined) dto.trigger = model.trigger;
        if (model.metadata !== undefined) dto.metadata = model.metadata;
        const effects = model.effects.toXmlDTO();
        if (effects.length > 0) {
            dto.effects = { effect: effects.map((e: any) => e) };
        }
        return dto;
    }

    public toModel(): Feature {
        // flatten your keyword list as before
        const keywords = this.keywords
            ? [this.keywords.keyword].flat().filter(Boolean)
            : undefined;

        // pull out the ordered array of raw effects (or [] if absent)
        const es = this.effects ? [this.effects.effect].flat() : [];

        return new Feature({
            name: this.name,
            type: this.type,
            cost: this.cost,
            keywords: keywords,
            distance: this.distance,
            target: this.target,
            trigger: this.trigger,
            flavor: this.flavor,
            effects: Effects.fromDTO(es),
            metadata: this.metadata,
        });
    }
}
