import { Ability } from "./Ability";
import { Trait } from "./Trait";
import { Characteristics } from "./Characteristics";
import { StatblockDTO } from "../dto";
import { ModelFactory, SteelCompendiumModel } from "./SteelCompendiumModel";

export class Statblock extends SteelCompendiumModel<StatblockDTO> {
    name!: string;
    level?: number;
    roles!: string[];
    ancestry!: string[];
    ev!: string;
    stamina!: number;
    immunities?: string[];
    weaknesses?: string[];
    speed!: string;
    size!: string;
    stability!: number;
    freeStrike!: number;
    withCaptain?: string;
    characteristics!: Characteristics;
    traits!: Trait[];
    abilities!: Ability[];

    public constructor(source: Partial<Statblock>) {
        super();
        Object.assign(this, source);
        this.characteristics = source.characteristics ?? new Characteristics(0, 0, 0, 0, 0);
        this.traits = source.traits ?? [];
        this.abilities = source.abilities ?? [];
    }

    public static ModelDTOAdapter: ModelFactory<Statblock, StatblockDTO> = (source: Partial<StatblockDTO>) => new StatblockDTO(source).toModel();

    public static fromDTO(dto: StatblockDTO): Statblock {
        return new Statblock({
            ...dto,
            freeStrike: dto.free_strike,
            withCaptain: dto.with_captain,
            characteristics: new Characteristics(dto.might, dto.agility, dto.reason, dto.intuition, dto.presence),
            traits: dto.traits?.map(t => Trait.fromDTO(t)) ?? [],
            abilities: dto.abilities?.map(a => Ability.fromDTO(a)) ?? [],
        });
    }

    public toDTO(): Partial<StatblockDTO> {
        const data: Partial<StatblockDTO> = {}

        if (this.name !== undefined) data.name = this.name;
        if (this.level !== undefined) data.level = this.level;
        if (this.roles !== undefined) data.roles = this.roles;
        if (this.ancestry !== undefined) data.ancestry = this.ancestry;
        if (this.ev !== undefined) data.ev = this.ev;
        if (this.stamina !== undefined) data.stamina = this.stamina;
        if (this.immunities !== undefined && this.immunities.length > 0) data.immunities = this.immunities;
        if (this.weaknesses !== undefined && this.weaknesses.length > 0) data.weaknesses = this.weaknesses;
        if (this.speed !== undefined) data.speed = this.speed;
        if (this.size !== undefined) data.size = this.size;
        if (this.stability !== undefined) data.stability = this.stability;
        if (this.freeStrike !== undefined) data.free_strike = this.freeStrike;
        if (this.withCaptain !== undefined) data.with_captain = this.withCaptain;
        if (this.traits !== undefined) data.traits = this.traits.map(t => t.toDTO());
        if (this.abilities !== undefined) data.abilities = this.abilities.map(a => a.toDTO());
        if (this.characteristics !== undefined) {
            if (this.characteristics.might !== undefined) data.might = this.characteristics.might;
            if (this.characteristics.agility !== undefined) data.agility = this.characteristics.agility;
            if (this.characteristics.reason !== undefined) data.reason = this.characteristics.reason;
            if (this.characteristics.intuition !== undefined) data.intuition = this.characteristics.intuition;
            if (this.characteristics.presence !== undefined) data.presence = this.characteristics.presence;
        }
        return data;
    }
}
