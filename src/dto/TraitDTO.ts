import { EffectDTO } from './EffectDTO';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';
import { Trait } from '../model/Trait';
import { Effect } from '../model/Effect';

export class TraitDTO extends SteelCompendiumDTO<Trait> {
    name!: string;
    effects!: EffectDTO[];
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