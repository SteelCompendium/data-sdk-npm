import { Culture } from '../model/Culture';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class CultureDTO extends SteelCompendiumDTO<Culture> {
    type = Culture.CULTURE_TYPE;

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

    public constructor(source: Partial<CultureDTO>) {
        super(source, Culture.CULTURE_TYPE);
    }

    static partialFromModel(model: Culture): Partial<CultureDTO> {
        const data: Partial<CultureDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.flavor !== undefined) data.flavor = model.flavor;
        if (model.culture_benefit_type !== undefined) data.culture_benefit_type = model.culture_benefit_type;
        if (model.environment !== undefined) data.environment = model.environment;
        if (model.organization !== undefined) data.organization = model.organization;
        if (model.upbringing !== undefined) data.upbringing = model.upbringing;
        if (model.skill_options !== undefined) data.skill_options = model.skill_options;
        if (model.quick_build_skill !== undefined) data.quick_build_skill = model.quick_build_skill;
        if (model.language !== undefined) data.language = model.language;
        if (model.content !== undefined) data.content = model.content;
        if (model.metadata !== undefined) data.metadata = model.metadata;
        return data;
    }

    public static fromModel(model: Culture): CultureDTO {
        return new CultureDTO(model.toDTO());
    }

    public toModel(): Culture {
        return Culture.fromDTO(this);
    }
}
