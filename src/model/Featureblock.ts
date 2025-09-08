import { Feature } from "./Feature";
import { FeatureblockDTO } from "../dto";
import { ModelDTOAdapter, SteelCompendiumModel } from "./SteelCompendiumModel";
import {FeatureStat} from "./FeatureStat";

export class Featureblock extends SteelCompendiumModel<FeatureblockDTO> {
    public static FEATUREBLOCK_TYPE = "featureblock";

    type = Featureblock.FEATUREBLOCK_TYPE;
    name!: string;
    featureblock_type?: string;
    level?: number;
    ev?: string;
    flavor?: string;
    stamina?: string;
    size!: string;
    stats?: FeatureStat[];
    features!: Feature[];

    public constructor(source: Partial<Featureblock>) {
        super(Featureblock.FEATUREBLOCK_TYPE);
        Object.assign(this, source);
        this.features = source.features ?? [];
    }

    public static modelDTOAdapter: ModelDTOAdapter<Featureblock, FeatureblockDTO> = (source: Partial<FeatureblockDTO>) => new FeatureblockDTO(source).toModel();

    public static fromDTO(dto: FeatureblockDTO): Featureblock {
        return new Featureblock({
            ...dto,
            stats: dto.stats?.map(s => FeatureStat.fromDTO(s)),
            features: dto.features?.map(f => Feature.fromDTO(f)) ?? [],
        });
    }

    public toDTO(): Partial<FeatureblockDTO> {
        return FeatureblockDTO.partialFromModel(this);
    }
}
