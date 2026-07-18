import { Condition } from '../model/Condition';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class ConditionDTO extends SteelCompendiumDTO<Condition> {
    type = Condition.CONDITION_TYPE;

    name!: string;
    scc?: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<ConditionDTO>) {
        super(source, Condition.CONDITION_TYPE);
    }

    static partialFromModel(model: Condition): Partial<ConditionDTO> {
        const data: Partial<ConditionDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.scc !== undefined) data.scc = model.scc;
        if (model.content !== undefined) data.content = model.content;
        if (model.metadata !== undefined) data.metadata = model.metadata;
        return data;
    }

    public static fromModel(model: Condition): ConditionDTO {
        return new ConditionDTO(model.toDTO());
    }

    public toModel(): Condition {
        return Condition.fromDTO(this);
    }
}
