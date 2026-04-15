import { TreasureDTO } from '../dto/TreasureDTO';
import { ModelDTOAdapter, SteelCompendiumModel } from './SteelCompendiumModel';

export class Treasure extends SteelCompendiumModel<TreasureDTO> {
    public static readonly TREASURE_TYPE = 'treasure';

    name!: string;
    treasure_type?: string;
    level?: string;
    rarity?: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<Treasure>) {
        super();
        Object.assign(this, source);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Treasure, TreasureDTO> = (source: Partial<TreasureDTO>) => new TreasureDTO(source).toModel();

    public static fromDTO(dto: TreasureDTO): Treasure {
        return new Treasure({ ...dto });
    }

    public toDTO(): Partial<TreasureDTO> {
        return TreasureDTO.partialFromModel(this);
    }

    public modelType(): string {
        return Treasure.TREASURE_TYPE;
    }
}
