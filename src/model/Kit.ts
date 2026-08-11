import { KitDTO } from '../dto/KitDTO';
import { Feature } from './Feature';
import { ModelDTOAdapter, SteelCompendiumModel } from './SteelCompendiumModel';

// BETA — subject to change without notice. See README.md § Schema stability.
export class Kit extends SteelCompendiumModel<KitDTO> {
    public static readonly KIT_TYPE = 'kit';

    name!: string;
    scc?: string;
    kit_type?: string;
    flavor?: string;
    armor?: string[];
    weapon?: string[];
    equipment_text?: string;
    stamina_bonus?: string;
    speed_bonus?: string;
    stability_bonus?: string;
    melee_damage_bonus?: string;
    ranged_damage_bonus?: string;
    melee_distance_bonus?: string;
    ranged_distance_bonus?: string;
    disengage_bonus?: string;
    signature_ability?: Feature;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<Kit>) {
        super();
        Object.assign(this, source);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Kit, KitDTO> = (source: Partial<KitDTO>) => new KitDTO(source).toModel();

    public static fromDTO(dto: KitDTO): Kit {
        return new Kit({
            ...dto,
            signature_ability: dto.signature_ability ? Feature.fromDTO(dto.signature_ability as any) : undefined,
        });
    }

    public toDTO(): Partial<KitDTO> {
        return KitDTO.partialFromModel(this);
    }

    public modelType(): string {
        return Kit.KIT_TYPE;
    }
}
