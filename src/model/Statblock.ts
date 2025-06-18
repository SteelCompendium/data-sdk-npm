import { Ability } from "./Ability";
import { Trait } from "./Trait";
import { Characteristics } from "./Characteristics";
import { IDataReader, IDataWriter } from "../io";
import { StatblockDTO } from "../dto";
import { SteelCompendiumModel } from "./SteelCompendiumModel";

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

    public static read(reader: IDataReader<Statblock>, source: string): Statblock {
        return reader.read(source);
    }

    public static fromSource = (data: any): Statblock => Statblock.fromDTO(new StatblockDTO(data));

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

    public toDTO(): StatblockDTO {
        return new StatblockDTO({
            ...this,
            free_strike: this.freeStrike,
            with_captain: this.withCaptain,
            might: this.characteristics.might,
            agility: this.characteristics.agility,
            reason: this.characteristics.reason,
            intuition: this.characteristics.intuition,
            presence: this.characteristics.presence,
            traits: this.traits.map(t => t.toDTO()),
            abilities: this.abilities.map(a => a.toDTO()),
        });
    }
}
