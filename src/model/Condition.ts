import { ConditionDTO } from '../dto/ConditionDTO';
import { ModelDTOAdapter, SteelCompendiumModel } from './SteelCompendiumModel';

export class Condition extends SteelCompendiumModel<ConditionDTO> {
    public static readonly CONDITION_TYPE = 'condition';

    name!: string;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<Condition>) {
        super();
        Object.assign(this, source);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Condition, ConditionDTO> = (source: Partial<ConditionDTO>) => new ConditionDTO(source).toModel();

    public static fromDTO(dto: ConditionDTO): Condition {
        return new Condition({ ...dto });
    }

    public toDTO(): Partial<ConditionDTO> {
        return ConditionDTO.partialFromModel(this);
    }

    public modelType(): string {
        return Condition.CONDITION_TYPE;
    }
}
