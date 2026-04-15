import { Treasure } from '../model/Treasure';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class TreasureDTO extends SteelCompendiumDTO<Treasure> {
    type = Treasure.TREASURE_TYPE;

    name!: string;
    treasure_type?: string;
    level?: string;
    rarity?: string;
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
