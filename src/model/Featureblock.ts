import { Ability } from "./Ability";
import { FeatureblockDTO } from "../dto";
import { ModelDTOAdapter, SteelCompendiumModel } from "./SteelCompendiumModel";
import {FeatureStat} from "./FeatureStat";

export class Featureblock extends SteelCompendiumModel<FeatureblockDTO> {
    name!: string;
    type?: string;
    level?: number;
    ev?: string;
    flavor?: string;
    stamina?: string;
    size!: string;
    stats?: FeatureStat[];
    features!: Ability[];

    public constructor(source: Partial<Featureblock>) {
        super();
        Object.assign(this, source);
        this.stats = source.stats ?? [];
        this.features = source.features ?? [];
    }

    public static modelDTOAdapter: ModelDTOAdapter<Featureblock, FeatureblockDTO> = (source: Partial<FeatureblockDTO>) => new FeatureblockDTO(source).toModel();

    public static fromDTO(dto: FeatureblockDTO): Featureblock {
        return new Featureblock({
            ...dto,
            stats: dto.stats?.map(s => FeatureStat.fromDTO(s)) ?? [],
            features: dto.features?.map(f => Ability.fromDTO(f)) ?? [],
        });
    }

    public toDTO(): Partial<FeatureblockDTO> {
        return FeatureblockDTO.partialFromModel(this);
    }
}
