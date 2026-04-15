import { Class } from '../model/Class';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class ClassDTO extends SteelCompendiumDTO<Class> {
    type = Class.CLASS_TYPE;

    name!: string;
    heroic_resource?: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<ClassDTO>) {
        super(source, Class.CLASS_TYPE);
    }

    static partialFromModel(model: Class): Partial<ClassDTO> {
        const data: Partial<ClassDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.heroic_resource !== undefined) data.heroic_resource = model.heroic_resource;
        if (model.content !== undefined) data.content = model.content;
        if (model.metadata !== undefined) data.metadata = model.metadata;
        return data;
    }

    public static fromModel(model: Class): ClassDTO {
        return new ClassDTO(model.toDTO());
    }

    public toModel(): Class {
        return Class.fromDTO(this);
    }
}
