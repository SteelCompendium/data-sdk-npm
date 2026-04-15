import { Perk } from '../model/Perk';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class PerkDTO extends SteelCompendiumDTO<Perk> {
    type = Perk.PERK_TYPE;

    name!: string;
    prerequisites?: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<PerkDTO>) {
        super(source, Perk.PERK_TYPE);
    }

    static partialFromModel(model: Perk): Partial<PerkDTO> {
        const data: Partial<PerkDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.prerequisites !== undefined) data.prerequisites = model.prerequisites;
        if (model.content !== undefined) data.content = model.content;
        if (model.metadata !== undefined) data.metadata = model.metadata;
        return data;
    }

    public static fromModel(model: Perk): PerkDTO {
        return new PerkDTO(model.toDTO());
    }

    public toModel(): Perk {
        return Perk.fromDTO(this);
    }
}
