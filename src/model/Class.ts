import { ClassDTO } from '../dto/ClassDTO';
import { ModelDTOAdapter, SteelCompendiumModel } from './SteelCompendiumModel';

export class Class extends SteelCompendiumModel<ClassDTO> {
    public static readonly CLASS_TYPE = 'class';

    name!: string;
    heroic_resource?: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<Class>) {
        super();
        Object.assign(this, source);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Class, ClassDTO> = (source: Partial<ClassDTO>) => new ClassDTO(source).toModel();

    public static fromDTO(dto: ClassDTO): Class {
        return new Class({ ...dto });
    }

    public toDTO(): Partial<ClassDTO> {
        return ClassDTO.partialFromModel(this);
    }

    public modelType(): string {
        return Class.CLASS_TYPE;
    }
}
