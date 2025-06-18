import { AbilityDTO } from './AbilityDTO';
import { TraitDTO } from './TraitDTO';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';
import { Statblock } from '../model/Statblock';

export class StatblockDTO extends SteelCompendiumDTO<Statblock> {
    name!: string;
    roles!: string[];
    ancestry!: string[];
    ev!: string;
    stamina!: number;
    speed!: string;
    size!: string;
    stability!: number;
    free_strike!: number;
    might!: number;
    agility!: number;
    reason!: number;
    intuition!: number;
    presence!: number;
    level?: number;
    immunities?: string[];
    weaknesses?: string[];
    with_captain?: string;
    traits?: TraitDTO[];
    abilities?: AbilityDTO[];

    public constructor(source: Partial<StatblockDTO>) {
        super();
        Object.assign(this, source);
    }

    public static fromModel(model: Statblock): StatblockDTO {
        return model.toDTO();
    }

    public toModel(): Statblock {
        return Statblock.fromDTO(this);
    }
} 