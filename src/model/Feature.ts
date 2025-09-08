import { FeatureDTO } from "../dto";
import { Effects } from "./Effects";
import { ModelDTOAdapter, SteelCompendiumModel } from "./SteelCompendiumModel";

export enum FeatureType {
    Ability = "Ability",
    Trait = "Trait"
}

// Features are either an Ability and Trait...
export class Feature extends SteelCompendiumModel<FeatureDTO> {
    public static FEATURE_TYPE = "feature";

    type = Feature.FEATURE_TYPE;
    feature_type!: FeatureType;
    name?: string;
    icon?: string;
    cost?: string;
    flavor?: string;
    keywords?: string[];
    usage?: string;
    distance?: string;
    target?: string;
    trigger?: string;
    effects: Effects;
    metadata?: Record<string, any>;

    public constructor(source: Partial<Feature>) {
        super(Feature.FEATURE_TYPE);
        Object.assign(this, source);
        this.effects = source.effects ?? new Effects([]);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Feature, FeatureDTO> = (source: Partial<FeatureDTO>) => new FeatureDTO(source).toModel();

    public static fromDTO(dto: FeatureDTO): Feature {
        return new Feature({
            ...dto,
            feature_type: this.feature_type.toString(),
            effects: Effects.fromDTO(dto.effects),
        });
    }

    public toDTO(): Partial<FeatureDTO> {
        return FeatureDTO.partialFromModel(this);
    }

    // A trait is defined as a feature without keywords, usage, distance, and target
    public isTrait() {
        return (!this.keywords || this.keywords?.length == 0) && !this.usage && !this.distance && !this.target;
    }
}
