import { CultureDTO } from '../dto/CultureDTO';
import { ModelDTOAdapter, SteelCompendiumModel } from './SteelCompendiumModel';

export class Culture extends SteelCompendiumModel<CultureDTO> {
    public static readonly CULTURE_TYPE = 'culture';

    name!: string;
    flavor?: string;
    culture_benefit_type?: string;
    environment?: string;
    organization?: string;
    upbringing?: string;
    skill_options?: string[];
    quick_build_skill?: string;
    language?: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<Culture>) {
        super();
        Object.assign(this, source);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Culture, CultureDTO> = (source: Partial<CultureDTO>) => new CultureDTO(source).toModel();

    public static fromDTO(dto: CultureDTO): Culture {
        return new Culture({ ...dto });
    }

    public toDTO(): Partial<CultureDTO> {
        return CultureDTO.partialFromModel(this);
    }

    public modelType(): string {
        return Culture.CULTURE_TYPE;
    }
}
