import { Ability } from '../model/Ability';
import { EffectDTO } from './EffectDTO';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class AbilityDTO extends SteelCompendiumDTO<Ability> {
    name!: string;
    type!: string;
    cost?: string;
    keywords?: string[];
    distance?: string;
    target?: string;
    trigger?: string;
    effects!: EffectDTO[];
    flavor?: string;

    public constructor(source: Partial<AbilityDTO>) {
        super();
        Object.assign(this, source);
        this.effects = source.effects ?? [];
    }

    public static fromModel(model: Ability): AbilityDTO {
        return model.toDTO();
    }

    public toModel(): Ability {
        return Ability.fromDTO(this);
    }
} 