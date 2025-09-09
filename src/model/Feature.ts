import {FeatureDTO} from "../dto";
import {ModelDTOAdapter, SteelCompendiumModel} from "./SteelCompendiumModel";
import {Effect} from "./Effect";

export enum FeatureType {
    Ability = "ability",
    Trait = "trait"
}

// Features are either an Ability and Trait...
export class Feature extends SteelCompendiumModel<FeatureDTO> {
    public static readonly FEATURE_TYPE = "feature";

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
    effects: Effect[];
    metadata?: Record<string, any>;

    public constructor(source: Partial<Feature>) {
        super();
        Object.assign(this, source);
        this.effects = source.effects ?? [];
    }

    public static modelDTOAdapter: ModelDTOAdapter<Feature, FeatureDTO> = (source: Partial<FeatureDTO>) => new FeatureDTO(source).toModel();

    public static fromDTO(dto: FeatureDTO): Feature {
        let ft: FeatureType;
        if (dto.feature_type === FeatureType.Ability) {
            ft = FeatureType.Ability;
        } else if (dto.feature_type === FeatureType.Trait) {
            ft = FeatureType.Trait;
        } else {
            ft = dto.isTrait() ? FeatureType.Trait : FeatureType.Ability;
        }
        return new Feature({
            ...dto,
            feature_type: ft,
            effects: dto.effects.map(e => e.toDTO())
        });
    }

    public toDTO(): Partial<FeatureDTO> {
        return FeatureDTO.partialFromModel(this);
    }

    public modelType(): string {
        return Feature.FEATURE_TYPE;
    }

    // A trait is defined as a feature without keywords, usage, distance, and target
    public isTrait() {
        return (!this.keywords || this.keywords?.length == 0) && !this.usage && !this.distance && !this.target;
    }
}
