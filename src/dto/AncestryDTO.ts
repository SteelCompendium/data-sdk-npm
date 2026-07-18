import { Ancestry, AncestryTrait } from '../model/Ancestry';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class AncestryDTO extends SteelCompendiumDTO<Ancestry> {
    type = Ancestry.ANCESTRY_TYPE;

    name!: string;
    scc?: string;
    flavor?: string;
    signature_trait_name?: string;
    signature_trait_description?: string;
    ancestry_points?: number;
    purchased_traits?: AncestryTrait[];
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<AncestryDTO>) {
        super(source, Ancestry.ANCESTRY_TYPE);
    }

    static partialFromModel(model: Ancestry): Partial<AncestryDTO> {
        const data: Partial<AncestryDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.scc !== undefined) data.scc = model.scc;
        if (model.flavor !== undefined) data.flavor = model.flavor;
        if (model.signature_trait_name !== undefined) data.signature_trait_name = model.signature_trait_name;
        if (model.signature_trait_description !== undefined) data.signature_trait_description = model.signature_trait_description;
        if (model.ancestry_points !== undefined) data.ancestry_points = model.ancestry_points;
        if (model.purchased_traits !== undefined) data.purchased_traits = model.purchased_traits;
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
