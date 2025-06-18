import { Ability } from '../model/Ability';
import { EffectDTO } from './EffectDTO';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export interface AbilityDTO extends SteelCompendiumDTO<Ability> {
    name: string;
    type: string;
    cost?: string;
    keywords?: string[];
    distance?: string;
    target?: string;
    trigger?: string;
    effects: EffectDTO[];
    flavor?: string;
    indent?: number;
} 