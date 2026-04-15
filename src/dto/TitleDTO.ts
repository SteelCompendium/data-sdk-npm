import { Title } from '../model/Title';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class TitleDTO extends SteelCompendiumDTO<Title> {
    type = Title.TITLE_TYPE;

    name!: string;
    echelon?: string;
    benefits?: string[];
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<TitleDTO>) {
        super(source, Title.TITLE_TYPE);
    }

    static partialFromModel(model: Title): Partial<TitleDTO> {
        const data: Partial<TitleDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.echelon !== undefined) data.echelon = model.echelon;
        if (model.benefits !== undefined) data.benefits = model.benefits;
        if (model.content !== undefined) data.content = model.content;
        if (model.metadata !== undefined) data.metadata = model.metadata;
        return data;
    }

    public static fromModel(model: Title): TitleDTO {
        return new TitleDTO(model.toDTO());
    }

    public toModel(): Title {
        return Title.fromDTO(this);
    }
}
