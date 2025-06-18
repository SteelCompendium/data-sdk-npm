import { Effect } from "../model/Effect";
import { SteelCompendiumDTO } from "./SteelCompendiumDTO";

export interface PowerRollEffectDTO extends SteelCompendiumDTO<Effect> {
    roll: string;
    [key: string]: string;
}

export interface NamedEffectWithCostDTO extends SteelCompendiumDTO<Effect> {
    name: string;
    cost: string;
    effect: string;
}

export interface CostedEffectDTO extends SteelCompendiumDTO<Effect> {
    cost: string;
    effect: string;
}

export interface NamedEffectDTO extends SteelCompendiumDTO<Effect> {
    name: string;
    effect: string;
}

export type EffectDTO =
    | PowerRollEffectDTO
    | NamedEffectWithCostDTO
    | CostedEffectDTO
    | NamedEffectDTO
    | string; 