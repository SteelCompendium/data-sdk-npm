import { Career, IncitingIncident } from '../model/Career';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class CareerDTO extends SteelCompendiumDTO<Career> {
    type = Career.CAREER_TYPE;

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

    public constructor(source: Partial<CareerDTO>) {
        super(source, Career.CAREER_TYPE);
    }

    static partialFromModel(model: Career): Partial<CareerDTO> {
        const data: Partial<CareerDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.scc !== undefined) data.scc = model.scc;
        if (model.flavor !== undefined) data.flavor = model.flavor;
        if (model.skills !== undefined) data.skills = model.skills;
        if (model.skill_group !== undefined) data.skill_group = model.skill_group;
        if (model.language !== undefined) data.language = model.language;
        if (model.renown !== undefined) data.renown = model.renown;
        if (model.wealth !== undefined) data.wealth = model.wealth;
        if (model.project_points !== undefined) data.project_points = model.project_points;
        if (model.perk !== undefined) data.perk = model.perk;
        if (model.perk_group !== undefined) data.perk_group = model.perk_group;
        if (model.inciting_incidents !== undefined) data.inciting_incidents = model.inciting_incidents;
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
