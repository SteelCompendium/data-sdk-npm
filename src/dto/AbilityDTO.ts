import { Ability } from '../model/Ability';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class AbilityDTO extends SteelCompendiumDTO<Ability> {
    name!: string;
    type!: string;
    cost?: string;
    keywords?: string[];
    distance?: string;
    target?: string;
    trigger?: string;
    effects!: any[];
    flavor?: string;

    public constructor(source: Partial<AbilityDTO>) {
        super(source);
        this.effects = source.effects ?? [];
    }

    public static fromModel(model: Ability): AbilityDTO {
        return model.toDTO();
    }

    public toModel(): Ability {
        return Ability.fromDTO(this);
    }
} 