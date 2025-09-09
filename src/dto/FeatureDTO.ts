import { Feature } from '../model/Feature';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class FeatureDTO extends SteelCompendiumDTO<Feature> {
    type = Feature.FEATURE_TYPE;

    feature_type!: string;
    name!: string;
    icon?: string;
    cost?: string;
    keywords?: string[];
    usage?: string;
    distance?: string;
    target?: string;
    trigger?: string;
    effects!: any[];
    flavor?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<FeatureDTO>) {
        super(source, Feature.FEATURE_TYPE);
        this.effects = source.effects ?? [];
    }

    public static partialFromModel(model: Feature): Partial<FeatureDTO> {
        const dto: Partial<FeatureDTO> = { type: model.modelType() };
        dto.feature_type = model.isTrait() ? "trait" : "ability";
        if (model.name !== undefined) dto.name = model.name;
        if (model.icon !== undefined) dto.icon = model.icon;
        if (model.cost !== undefined) dto.cost = model.cost;
        if (model.flavor !== undefined) dto.flavor = model.flavor;
        if (model.keywords !== undefined) dto.keywords = model.keywords;
        if (model.usage !== undefined) dto.usage = model.usage;
        if (model.distance !== undefined) dto.distance = model.distance;
        if (model.target !== undefined) dto.target = model.target;
        if (model.trigger !== undefined) dto.trigger = model.trigger;
        if (model.metadata !== undefined) dto.metadata = model.metadata;
        dto.effects = model.effects.map(e => e.toDTO());
        return dto;
    }

    public static fromModel(model: Feature): FeatureDTO {
        return new FeatureDTO(model.toDTO());
    }

    public toModel(): Feature {
        return Feature.fromDTO(this);
    }

    // A trait is defined as a feature without keywords, usage, distance, and target
    isTrait() {
        return (!this.keywords || this.keywords?.length == 0) && !this.usage && !this.distance && !this.target;
    }
} 