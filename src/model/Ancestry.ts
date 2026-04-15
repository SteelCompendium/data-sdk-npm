import { AncestryDTO } from '../dto/AncestryDTO';
import { ModelDTOAdapter, SteelCompendiumModel } from './SteelCompendiumModel';

export class Ancestry extends SteelCompendiumModel<AncestryDTO> {
    public static readonly ANCESTRY_TYPE = 'ancestry';

    name!: string;
    signature_trait?: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<Ancestry>) {
        super();
        Object.assign(this, source);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Ancestry, AncestryDTO> = (source: Partial<AncestryDTO>) => new AncestryDTO(source).toModel();

    public static fromDTO(dto: AncestryDTO): Ancestry {
        return new Ancestry({ ...dto });
    }

    public toDTO(): Partial<AncestryDTO> {
        return AncestryDTO.partialFromModel(this);
    }

    public modelType(): string {
        return Ancestry.ANCESTRY_TYPE;
    }
}
