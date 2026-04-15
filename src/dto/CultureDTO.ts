import { Culture } from '../model/Culture';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class CultureDTO extends SteelCompendiumDTO<Culture> {
    type = Culture.CULTURE_TYPE;

    name!: string;
    environment?: string;
    organization?: string;
    upbringing?: string;
    skill?: string;
    language?: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<CultureDTO>) {
        super(source, Culture.CULTURE_TYPE);
    }

    static partialFromModel(model: Culture): Partial<CultureDTO> {
        const data: Partial<CultureDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.environment !== undefined) data.environment = model.environment;
        if (model.organization !== undefined) data.organization = model.organization;
        if (model.upbringing !== undefined) data.upbringing = model.upbringing;
        if (model.skill !== undefined) data.skill = model.skill;
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
