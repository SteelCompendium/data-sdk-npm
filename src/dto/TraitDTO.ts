import { SteelCompendiumDTO } from './SteelCompendiumDTO';
import { Trait } from '../model/Trait';

export class TraitDTO extends SteelCompendiumDTO<Trait> {
    name!: string;
    effects!: any[];

    public constructor(source: Partial<TraitDTO>) {
        super(source);
        this.effects = source.effects ?? [];
    }

    static partialFromModel(model: Trait): Partial<TraitDTO> {
        const dto: Partial<TraitDTO> = {};
        if (model.name !== undefined) dto.name = model.name;
        dto.effects = model.effects.toDTO();
        return dto;
    }

    public static fromModel(model: Trait): TraitDTO {
        return new TraitDTO(model.toDTO());
    }

    public toModel(): Trait {
        return Trait.fromDTO(this);
    }
} 