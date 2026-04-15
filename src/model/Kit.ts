import { KitDTO } from '../dto/KitDTO';
import { ModelDTOAdapter, SteelCompendiumModel } from './SteelCompendiumModel';

export class Kit extends SteelCompendiumModel<KitDTO> {
    public static readonly KIT_TYPE = 'kit';

    name!: string;
    kit_type?: string;
    stat_bonuses?: Record<string, string>;
    equipment?: string[];
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<Kit>) {
        super();
        Object.assign(this, source);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Kit, KitDTO> = (source: Partial<KitDTO>) => new KitDTO(source).toModel();

    public static fromDTO(dto: KitDTO): Kit {
        return new Kit({ ...dto });
    }

    public toDTO(): Partial<KitDTO> {
        return KitDTO.partialFromModel(this);
    }

    public modelType(): string {
        return Kit.KIT_TYPE;
    }
}
