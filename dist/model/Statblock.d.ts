import { Ability } from "./Ability";
import { Trait } from "./Trait";
import { Characteristics } from "./Characteristics";
import { StatblockDTO } from "../dto";
import { ModelDTOAdapter, SteelCompendiumModel } from "./SteelCompendiumModel";
export declare class Statblock extends SteelCompendiumModel<StatblockDTO> {
    name: string;
    level?: number;
    roles: string[];
    ancestry: string[];
    ev: string;
    stamina: number;
    immunities?: string[];
    weaknesses?: string[];
    speed: string;
    size: string;
    stability: number;
    freeStrike: number;
    withCaptain?: string;
    characteristics: Characteristics;
    traits: Trait[];
    abilities: Ability[];
    constructor(source: Partial<Statblock>);
    static modelDTOAdapter: ModelDTOAdapter<Statblock, StatblockDTO>;
    static fromDTO(dto: StatblockDTO): Statblock;
    toDTO(): Partial<StatblockDTO>;
}
