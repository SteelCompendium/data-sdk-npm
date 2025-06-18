import { Ability } from "./Ability";
import { Trait } from "./Trait";
import { Characteristics } from "./Characteristics";
import { IDataReader, IDataWriter } from "../io";
import { StatblockDTO } from "../dto";
import { SteelCompendiumModel } from "./SteelCompendiumModel";

export class Statblock extends SteelCompendiumModel {
    name?: string;
    level?: number;
    roles?: string[];
    ancestry?: string[];
    ev?: string;
    stamina?: number;
    immunities?: string[];
    weaknesses?: string[];
    speed?: string;
    size?: string;
    stability?: number;
    freeStrike?: number;
    withCaptain?: string;
    characteristics: Characteristics;
    traits: Trait[];
    abilities: Ability[];

    constructor(name: string, level: number, roles: string[], ancestry: string[], ev: string, stamina: number, immunities: string[], weaknesses: string[], speed: string, size: string, stability: number, freeStrike: number, withCaptain: string, characteristics: Characteristics, traits: Trait[], abilities: Ability[]) {
        super();
        this.name = name;
        this.level = level;
        this.roles = roles;
        this.ancestry = ancestry;
        this.ev = ev;
        this.stamina = stamina;
        this.immunities = immunities;
        this.weaknesses = weaknesses;
        this.speed = speed;
        this.size = size;
        this.stability = stability;
        this.freeStrike = freeStrike;
        this.withCaptain = withCaptain;
        this.characteristics = characteristics;
        this.traits = traits;
        this.abilities = abilities;
    }

    public static read(reader: IDataReader<StatblockDTO>, source: string): Statblock {
        return this.fromDTO(reader.read(source));
    }

    public static fromDTO(dto: StatblockDTO): Statblock {
        return new Statblock(
            dto.name ?? '',
            dto.level ?? 0,
            dto.roles ?? [],
            dto.ancestry ?? [],
            dto.ev ?? '',
            dto.stamina ?? 0,
            dto.immunities ?? [],
            dto.weaknesses ?? [],
            dto.speed ?? '',
            dto.size ?? '',
            dto.stability ?? 0,
            dto.free_strike ?? 0,
            dto.with_captain ?? '',
            Characteristics.fromDTO(dto),
            dto.traits?.map((t: any) => Trait.fromDTO(t)) ?? [],
            dto.abilities?.map((a: any) => Ability.fromDTO(a)) ?? []
        );
    }

    public toDTO(): StatblockDTO {
        return {
            name: this.name!,
            level: this.level,
            roles: this.roles!,
            ancestry: this.ancestry!,
            ev: this.ev!,
            stamina: this.stamina!,
            immunities: this.immunities,
            weaknesses: this.weaknesses,
            speed: this.speed!,
            size: this.size!,
            stability: this.stability!,
            free_strike: this.freeStrike!,
            with_captain: this.withCaptain,
            might: this.characteristics.might,
            agility: this.characteristics.agility,
            reason: this.characteristics.reason,
            intuition: this.characteristics.intuition,
            presence: this.characteristics.presence,
            traits: this.traits.map(t => t.toDTO()),
            abilities: this.abilities.map(a => a.toDTO()),
        };
    }
}
