import { Ancestry } from '../model/Ancestry';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class AncestryDTO extends SteelCompendiumDTO<Ancestry> {
    type = Ancestry.ANCESTRY_TYPE;

    name!: string;
    signature_trait?: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<AncestryDTO>) {
        super(source, Ancestry.ANCESTRY_TYPE);
    }

    static partialFromModel(model: Ancestry): Partial<AncestryDTO> {
        const data: Partial<AncestryDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.signature_trait !== undefined) data.signature_trait = model.signature_trait;
        if (model.content !== undefined) data.content = model.content;
        if (model.metadata !== undefined) data.metadata = model.metadata;
        return data;
    }

    public static fromModel(model: Ancestry): AncestryDTO {
        return new AncestryDTO(model.toDTO());
    }

    public toModel(): Ancestry {
        return Ancestry.fromDTO(this);
    }
}
