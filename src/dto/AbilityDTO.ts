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
    metadata?: Record<string, any>[];

    public constructor(source: Partial<AbilityDTO>) {
        super(source);
        this.effects = source.effects ?? [];
    }

    public static partialFromModel(model: Ability): Partial<AbilityDTO> {
        const dto: Partial<AbilityDTO> = {};
        if (model.name !== undefined) dto.name = model.name;
        if (model.cost !== undefined) dto.cost = model.cost;
        if (model.flavor !== undefined) dto.flavor = model.flavor;
        if (model.keywords !== undefined) dto.keywords = model.keywords;
        if (model.type !== undefined) dto.type = model.type;
        if (model.distance !== undefined) dto.distance = model.distance;
        if (model.target !== undefined) dto.target = model.target;
        if (model.trigger !== undefined) dto.trigger = model.trigger;
        if (model.metadata !== undefined) dto.metadata = model.metadata;
        dto.effects = model.effects.toDTO();
        return dto;
    }

    public static fromModel(model: Ability): AbilityDTO {
        return new AbilityDTO(model.toDTO());
    }

    public toModel(): Ability {
        return Ability.fromDTO(this);
    }
} 