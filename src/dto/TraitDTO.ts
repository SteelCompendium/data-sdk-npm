import { SteelCompendiumDTO } from './SteelCompendiumDTO';
import { Trait } from '../model/Trait';

export class TraitDTO extends SteelCompendiumDTO<Trait> {
    name!: string;
    effects!: any[];
    type?: string;

    public constructor(source: Partial<TraitDTO>) {
        super();
        Object.assign(this, source);
        this.effects = source.effects ?? [];
    }

    public static fromModel(model: Trait): TraitDTO {
        return model.toDTO();
    }

    public toModel(): Trait {
        return Trait.fromDTO(this);
    }
} 