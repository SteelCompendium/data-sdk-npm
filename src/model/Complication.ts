import { ComplicationDTO } from '../dto/ComplicationDTO';
import { ModelDTOAdapter, SteelCompendiumModel } from './SteelCompendiumModel';

export class Complication extends SteelCompendiumModel<ComplicationDTO> {
    public static readonly COMPLICATION_TYPE = 'complication';

    name!: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<Complication>) {
        super();
        Object.assign(this, source);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Complication, ComplicationDTO> = (source: Partial<ComplicationDTO>) => new ComplicationDTO(source).toModel();

    public static fromDTO(dto: ComplicationDTO): Complication {
        return new Complication({ ...dto });
    }

    public toDTO(): Partial<ComplicationDTO> {
        return ComplicationDTO.partialFromModel(this);
    }

    public modelType(): string {
        return Complication.COMPLICATION_TYPE;
    }
}
