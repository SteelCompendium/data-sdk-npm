import { Ability } from "./Ability";
import { Trait } from "./Trait";
import { Characteristics } from "./Characteristics";
export declare class Statblock {
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
    constructor(name: string, level: number, roles: string[], ancestry: string[], ev: string, stamina: number, immunities: string[], weaknesses: string[], speed: string, size: string, stability: number, freeStrike: number, withCaptain: string, characteristics: Characteristics, traits: Trait[], abilities: Ability[]);
    static from(data: any): Statblock;
    static fromYaml(yaml: string): Statblock;
    static fromJson(json: string): Statblock;
    toYaml(): string;
    toJson(): string;
}
