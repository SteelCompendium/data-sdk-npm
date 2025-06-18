import { Ability } from "./Ability";
import { Trait } from "./Trait";
import { Characteristics } from "./Characteristics";
import { IDataReader, IDataWriter } from "../io";
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

    public static from(data: any): Statblock {
        return new Statblock(
            data.name,
            data.level,
            data.roles ?? [],
            data.ancestry ?? [],
            data.ev,
            data.stamina,
            data.immunities ?? [],
            data.weaknesses ?? [],
            data.speed,
            data.size,
            data.stability,
            data.free_strike ?? data.freeStrike,
            data.with_captain ?? data.withCaptain,
            Characteristics.from(data.characteristics),
            data.traits?.map((t: any) => Trait.from(t)) ?? [],
            data.abilities?.map((a: any) => Ability.from(a)) ?? []
        );
    }

    public static read(reader: IDataReader<Statblock>, source: string): Statblock {
        return reader.read(source);
    }
}
