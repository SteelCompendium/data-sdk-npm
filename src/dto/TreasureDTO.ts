import { Treasure } from '../model/Treasure';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class TreasureDTO extends SteelCompendiumDTO<Treasure> {
    type = Treasure.TREASURE_TYPE;

    name!: string;
    treasure_type?: string;
    level?: string;
    rarity?: string;
    flavor?: string;
    keywords?: string[];
    item_prerequisite?: string;
    project_source?: string;
    project_roll_characteristic?: string;
    project_goal?: number;
    effect?: string;
    level_effects?: Record<string, string>;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<TreasureDTO>) {
        super(source, Treasure.TREASURE_TYPE);
    }

    static partialFromModel(model: Treasure): Partial<TreasureDTO> {
        const data: Partial<TreasureDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.treasure_type !== undefined) data.treasure_type = model.treasure_type;
        if (model.level !== undefined) data.level = model.level;
        if (model.rarity !== undefined) data.rarity = model.rarity;
        if (model.flavor !== undefined) data.flavor = model.flavor;
        if (model.keywords !== undefined) data.keywords = model.keywords;
        if (model.item_prerequisite !== undefined) data.item_prerequisite = model.item_prerequisite;
        if (model.project_source !== undefined) data.project_source = model.project_source;
        if (model.project_roll_characteristic !== undefined) data.project_roll_characteristic = model.project_roll_characteristic;
        if (model.project_goal !== undefined) data.project_goal = model.project_goal;
        if (model.effect !== undefined) data.effect = model.effect;
        if (model.level_effects !== undefined) data.level_effects = model.level_effects;
        if (model.content !== undefined) data.content = model.content;
        if (model.metadata !== undefined) data.metadata = model.metadata;
        return data;
    }

    public static fromModel(model: Treasure): TreasureDTO {
        return new TreasureDTO(model.toDTO());
    }

    public toModel(): Treasure {
        return Treasure.fromDTO(this);
    }
}
