import {SteelCompendiumDTO} from "./SteelCompendiumDTO";
import {Ability, Effects} from "../model";

export class AbilityXmlDTO extends SteelCompendiumDTO<Ability> {
    name!: string;
    type!: string;
    cost?: string;
    keywords?: { keyword: string[] };
    distance?: string;
    target?: string;
    trigger?: string;
    flavor?: string;
    effects?: any[];

    constructor(source: Partial<AbilityXmlDTO>) {
        super(source);
    }

    public static partialFromModel(model: Ability): Partial<AbilityXmlDTO> {
        const dto: Partial<AbilityXmlDTO> = {};
        if (model.name !== undefined) dto.name = model.name;
        if (model.cost !== undefined) dto.cost = model.cost;
        if (model.flavor !== undefined) dto.flavor = model.flavor;
        if (model.keywords !== undefined) dto.keywords = {keyword: model.keywords};
        if (model.type !== undefined) dto.type = model.type;
        if (model.distance !== undefined) dto.distance = model.distance;
        if (model.target !== undefined) dto.target = model.target;
        if (model.trigger !== undefined) dto.trigger = model.trigger;
        console.log(JSON.stringify(model.effects));
        dto.effects = model.effects.toXmlDTO();
        return dto;
    }

    public toModel(): Ability {
        // flatten your keyword list as before
        const keywords = this.keywords
            ? [this.keywords.keyword].flat().filter(Boolean)
            : undefined;

        // pull out the ordered array of raw effects (or [] if absent)
        const rawEffects: any[] = this.effects ?? [];
        let es = rawEffects.map(e => e.effect);
        // xml parsing is wierd, man
        if (Array.isArray(es[0])) {
            es = es[0];
        }

        return new Ability({
            name: this.name,
            type: this.type,
            cost: this.cost,
            keywords: keywords,
            distance: this.distance,
            target: this.target,
            trigger: this.trigger,
            flavor: this.flavor,
            effects: Effects.fromDTO(es),
        });
    }
}
