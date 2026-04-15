import { Career } from '../model/Career';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class CareerDTO extends SteelCompendiumDTO<Career> {
    type = Career.CAREER_TYPE;

    name!: string;
    skill?: string;
    language?: string;
    renown?: string;
    wealth?: string;
    project_points?: string;
    perk?: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<CareerDTO>) {
        super(source, Career.CAREER_TYPE);
    }

    static partialFromModel(model: Career): Partial<CareerDTO> {
        const data: Partial<CareerDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.skill !== undefined) data.skill = model.skill;
        if (model.language !== undefined) data.language = model.language;
        if (model.renown !== undefined) data.renown = model.renown;
        if (model.wealth !== undefined) data.wealth = model.wealth;
        if (model.project_points !== undefined) data.project_points = model.project_points;
        if (model.perk !== undefined) data.perk = model.perk;
        if (model.content !== undefined) data.content = model.content;
        if (model.metadata !== undefined) data.metadata = model.metadata;
        return data;
    }

    public static fromModel(model: Career): CareerDTO {
        return new CareerDTO(model.toDTO());
    }

    public toModel(): Career {
        return Career.fromDTO(this);
    }
}
