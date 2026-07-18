import { Class } from '../model/Class';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class ClassDTO extends SteelCompendiumDTO<Class> {
    type = Class.CLASS_TYPE;

    name!: string;
    scc?: string;
    flavor?: string;
    heroic_resource?: string;
    primary_characteristics?: string[];
    weak_potency?: string;
    average_potency?: string;
    strong_potency?: string;
    starting_stamina?: number;
    stamina_per_level?: number;
    recoveries?: number;
    skills?: string[];
    skill_group?: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<ClassDTO>) {
        super(source, Class.CLASS_TYPE);
    }

    static partialFromModel(model: Class): Partial<ClassDTO> {
        const data: Partial<ClassDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.scc !== undefined) data.scc = model.scc;
        if (model.flavor !== undefined) data.flavor = model.flavor;
        if (model.heroic_resource !== undefined) data.heroic_resource = model.heroic_resource;
        if (model.primary_characteristics !== undefined) data.primary_characteristics = model.primary_characteristics;
        if (model.weak_potency !== undefined) data.weak_potency = model.weak_potency;
        if (model.average_potency !== undefined) data.average_potency = model.average_potency;
        if (model.strong_potency !== undefined) data.strong_potency = model.strong_potency;
        if (model.starting_stamina !== undefined) data.starting_stamina = model.starting_stamina;
        if (model.stamina_per_level !== undefined) data.stamina_per_level = model.stamina_per_level;
        if (model.recoveries !== undefined) data.recoveries = model.recoveries;
        if (model.skills !== undefined) data.skills = model.skills;
        if (model.skill_group !== undefined) data.skill_group = model.skill_group;
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
