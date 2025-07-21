import { SteelCompendiumDTO } from "./SteelCompendiumDTO";
import { Ability } from "../model";

export class AbilityXmlDTO extends SteelCompendiumDTO<Ability> {
    name!: string;
    type!: string;
    cost?: string;
    keywords?: { keyword: string[] };
    distance?: string;
    target?: string;
    trigger?: string;
    effects?: {
        mundane_effect?: any | any[],
        roll_effect?: any | any[],
    };
    flavor?: string;

    public constructor(source: Partial<AbilityXmlDTO>) {
        super(source);
    }

    public toModel(): Ability {
        const effects: any[] = [];
        if (this.effects) {
            const mundane = this.effects.mundane_effect ?? [];
            const roll = this.effects.roll_effect ?? [];
            effects.push(...[mundane, roll].flat());
        }

        const keywords = this.keywords ? [this.keywords.keyword].flat().filter(Boolean) : undefined;

        return new Ability({
            name: this.name,
            type: this.type,
            cost: this.cost,
            keywords: keywords,
            distance: this.distance,
            target: this.target,
            trigger: this.trigger,
            effects: effects as any,
            flavor: this.flavor,
        });
    }
} 