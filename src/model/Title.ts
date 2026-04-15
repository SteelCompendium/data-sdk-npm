import { TitleDTO } from '../dto/TitleDTO';
import { ModelDTOAdapter, SteelCompendiumModel } from './SteelCompendiumModel';

export class Title extends SteelCompendiumModel<TitleDTO> {
    public static readonly TITLE_TYPE = 'title';

    name!: string;
    echelon?: string;
    benefits?: string[];
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<Title>) {
        super();
        Object.assign(this, source);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Title, TitleDTO> = (source: Partial<TitleDTO>) => new TitleDTO(source).toModel();

    public static fromDTO(dto: TitleDTO): Title {
        return new Title({ ...dto });
    }

    public toDTO(): Partial<TitleDTO> {
        return TitleDTO.partialFromModel(this);
    }

    public modelType(): string {
        return Title.TITLE_TYPE;
    }
}
