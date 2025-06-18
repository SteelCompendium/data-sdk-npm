import { EffectDTO } from './EffectDTO';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';
import { Trait } from '../model/Trait';

export interface TraitDTO extends SteelCompendiumDTO<Trait> {
    name: string;
    effects: EffectDTO[];
    type?: string;
} 