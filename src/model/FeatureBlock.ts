import { Ability } from "./Ability";
import { FeatureBlockDTO } from "../dto";
import { ModelDTOAdapter, SteelCompendiumModel } from "./SteelCompendiumModel";

export class FeatureBlock extends SteelCompendiumModel<FeatureBlockDTO> {
    name!: string;
    type?: string;
    level?: number;
    ev?: string;
    flavor?: string;
    stamina?: string;
    size!: string;
    stats?: Record<string, any>[];
    features!: Ability[];

    public constructor(source: Partial<FeatureBlock>) {
        super();
        Object.assign(this, source);
        this.stats = source.stats ?? [];
        this.features = source.features ?? [];
    }

    public static modelDTOAdapter: ModelDTOAdapter<FeatureBlock, FeatureBlockDTO> = (source: Partial<FeatureBlockDTO>) => new FeatureBlockDTO(source).toModel();

    public static fromDTO(dto: FeatureBlockDTO): FeatureBlock {
        return new FeatureBlock({
            ...dto,
            features: dto.features?.map(f => Ability.fromDTO(f)) ?? [],
        });
    }

    public toDTO(): Partial<FeatureBlockDTO> {
        return FeatureBlockDTO.partialFromModel(this);
    }
}
