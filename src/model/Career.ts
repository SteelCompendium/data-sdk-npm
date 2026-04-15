import { CareerDTO } from '../dto/CareerDTO';
import { ModelDTOAdapter, SteelCompendiumModel } from './SteelCompendiumModel';

export class Career extends SteelCompendiumModel<CareerDTO> {
    public static readonly CAREER_TYPE = 'career';

    name!: string;
    skill?: string;
    language?: string;
    renown?: string;
    wealth?: string;
    project_points?: string;
    perk?: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<Career>) {
        super();
        Object.assign(this, source);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Career, CareerDTO> = (source: Partial<CareerDTO>) => new CareerDTO(source).toModel();

    public static fromDTO(dto: CareerDTO): Career {
        return new Career({ ...dto });
    }

    public toDTO(): Partial<CareerDTO> {
        return CareerDTO.partialFromModel(this);
    }

    public modelType(): string {
        return Career.CAREER_TYPE;
    }
}
