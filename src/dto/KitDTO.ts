import { Kit } from '../model/Kit';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class KitDTO extends SteelCompendiumDTO<Kit> {
    type = Kit.KIT_TYPE;

    name!: string;
    kit_type?: string;
    stat_bonuses?: Record<string, string>;
    equipment?: string[];
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<KitDTO>) {
        super(source, Kit.KIT_TYPE);
    }

    static partialFromModel(model: Kit): Partial<KitDTO> {
        const data: Partial<KitDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.kit_type !== undefined) data.kit_type = model.kit_type;
        if (model.stat_bonuses !== undefined) data.stat_bonuses = model.stat_bonuses;
        if (model.equipment !== undefined) data.equipment = model.equipment;
        if (model.content !== undefined) data.content = model.content;
        if (model.metadata !== undefined) data.metadata = model.metadata;
        return data;
    }

    public static fromModel(model: Kit): KitDTO {
        return new KitDTO(model.toDTO());
    }

    public toModel(): Kit {
        return Kit.fromDTO(this);
    }
}
