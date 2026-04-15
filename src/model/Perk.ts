import { PerkDTO } from '../dto/PerkDTO';
import { ModelDTOAdapter, SteelCompendiumModel } from './SteelCompendiumModel';

export class Perk extends SteelCompendiumModel<PerkDTO> {
    public static readonly PERK_TYPE = 'perk';

    name!: string;
    prerequisites?: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<Perk>) {
        super();
        Object.assign(this, source);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Perk, PerkDTO> = (source: Partial<PerkDTO>) => new PerkDTO(source).toModel();

    public static fromDTO(dto: PerkDTO): Perk {
        return new Perk({ ...dto });
    }

    public toDTO(): Partial<PerkDTO> {
        return PerkDTO.partialFromModel(this);
    }

    public modelType(): string {
        return Perk.PERK_TYPE;
    }
}
