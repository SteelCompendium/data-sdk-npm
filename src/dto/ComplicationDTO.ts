import { Complication } from '../model/Complication';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class ComplicationDTO extends SteelCompendiumDTO<Complication> {
    type = Complication.COMPLICATION_TYPE;

    name!: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<ComplicationDTO>) {
        super(source, Complication.COMPLICATION_TYPE);
    }

    static partialFromModel(model: Complication): Partial<ComplicationDTO> {
        const data: Partial<ComplicationDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.content !== undefined) data.content = model.content;
        if (model.metadata !== undefined) data.metadata = model.metadata;
        return data;
    }

    public static fromModel(model: Complication): ComplicationDTO {
        return new ComplicationDTO(model.toDTO());
    }

    public toModel(): Complication {
        return Complication.fromDTO(this);
    }
}
