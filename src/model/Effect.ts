import {Feature} from "./Feature";
import {FeatureDTO} from "../dto";

export class Effect {
    name?: string;
    cost?: string;
    effect!: string;
    roll?: string;
    tier1?: string;
    tier2?: string;
    tier3?: string;
    crit?: string;
    features?: Feature[];

    public constructor(source: Partial<Effect>) {
        Object.assign(this, source);
    }

    public static fromDTO(dto: any): Effect {
        const data: any = dto;
        let partial: Partial<Effect> = {
            name: data.name,
            cost: data.cost,
            effect: data.effect,
            roll: data.roll,
            tier1: data.t1 ?? data["tier1"] ?? data["tier 1"] ?? data["11 or lower"] ?? data["≤11"],
            tier2: data.t2 ?? data["tier2"] ?? data["tier 2"] ?? data["12-16"] ?? data["12–16"],
            tier3: data.t3 ?? data["tier3"] ?? data["tier 3"] ?? data["17+"],
            crit: data.critical ?? data.crit ?? data["nat 19-20"],
        };
        if (dto.features) {
            partial.features = dto.features.map((f: FeatureDTO) => Feature.fromDTO(f));
        }
        return new Effect(partial);
    }

    public toDTO(): any {
        const dto: any = {};
        if (this.name !== undefined) dto.name = this.name;
        if (this.cost !== undefined) dto.cost = this.cost;
        if (this.effect !== undefined) dto.effect = this.effect;
        if (this.roll !== undefined) dto.roll = this.roll;
        if (this.tier1 !== undefined) dto.tier1 = this.tier1;
        if (this.tier2 !== undefined) dto.tier2 = this.tier2;
        if (this.tier3 !== undefined) dto.tier3 = this.tier3;
        if (this.crit !== undefined) dto.crit = this.crit;
        if (this.features !== undefined) dto.features = this.features.map((f: Feature) => f.toDTO());
        return dto;
    }
}