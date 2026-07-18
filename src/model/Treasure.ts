import { TreasureDTO } from '../dto/TreasureDTO';
import { ModelDTOAdapter, SteelCompendiumModel } from './SteelCompendiumModel';

export class Treasure extends SteelCompendiumModel<TreasureDTO> {
    public static readonly TREASURE_TYPE = 'treasure';

    name!: string;
    scc?: string;
    treasure_type?: string;
    level?: string;
    echelon?: string;
    rarity?: string;
    flavor?: string;
    keywords?: string[];
    item_prerequisite?: string;
    project_source?: string;
    project_roll_characteristic?: string;
    project_goal?: string | number;
    effect?: string;
    level_effects?: Record<string, string>;
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
