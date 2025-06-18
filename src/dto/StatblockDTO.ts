import { AbilityDTO } from './AbilityDTO';
import { TraitDTO } from './TraitDTO';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';
import { Statblock } from '../model/Statblock';

export interface StatblockDTO extends SteelCompendiumDTO<Statblock> {
    name: string;
    roles: string[];
    ancestry: string[];
    ev: string;
    stamina: number;
    speed: string;
    size: string;
    stability: number;
    free_strike: number;
    might: number;
    agility: number;
    reason: number;
    intuition: number;
    presence: number;
    level?: number;
    immunities?: string[];
    weaknesses?: string[];
    with_captain?: string;
    traits?: TraitDTO[];
    abilities?: AbilityDTO[];
} 