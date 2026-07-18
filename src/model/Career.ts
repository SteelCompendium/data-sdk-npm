import { CareerDTO } from '../dto/CareerDTO';
import { ModelDTOAdapter, SteelCompendiumModel } from './SteelCompendiumModel';

export interface IncitingIncident {
    roll: number;
    name?: string;
    description: string;
}

export class Career extends SteelCompendiumModel<CareerDTO> {
    public static readonly CAREER_TYPE = 'career';

    name!: string;
    scc?: string;
    flavor?: string;
    skills?: string[];
    skill_group?: string;
    language?: string;
    renown?: number;
    wealth?: string;
    project_points?: number;
    perk?: string;
    perk_group?: string;
    inciting_incidents?: IncitingIncident[];
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
