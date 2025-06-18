import { Ability } from "./Ability";
import { Trait } from "./Trait";
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
    free_strike?: number;
    with_captain?: string;
    might: number;
    agility: number;
    reason: number;
    intuition: number;
    presence: number;
    traits: Trait[];
    abilities: Ability[];

    constructor(name: string, level: number, roles: string[], ancestry: string[], ev: string, stamina: number, immunities: string[], weaknesses: string[], speed: string, size: string, stability: number, freeStrike: number, withCaptain: string, might: number, agility: number, reason: number, intuition: number, presence: number, traits: Trait[], abilities: Ability[]) {
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
        this.free_strike = freeStrike;
        this.with_captain = withCaptain;
        this.might = might;
        this.agility = agility;
        this.reason = reason;
        this.intuition = intuition;
        this.presence = presence;
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
            data.might ?? 0,
            data.agility ?? 0,
            data.reason ?? 0,
            data.intuition ?? 0,
            data.presence ?? 0,
            data.traits?.map((t: any) => Trait.from(t)) ?? [],
            data.abilities?.map((a: any) => Ability.from(a)) ?? []
        );
    }

    public static read(reader: IDataReader<Statblock>, source: string): Statblock {
        return reader.read(source);
    }
}
