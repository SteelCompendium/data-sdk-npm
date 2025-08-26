import {Featureblock} from '../model/Featureblock';
import {SteelCompendiumDTO} from './SteelCompendiumDTO';

export class FeatureblockDTO extends SteelCompendiumDTO<Featureblock> {
    name!: string;
    type?: string;
    level?: number;
    ev?: string;
    flavor?: string;
    stamina?: string;
    size?: string;
    stats?: Record<string, any>;
    features!: any[];

    public constructor(source: Partial<FeatureblockDTO>) {
        super(source);
        this.stats = source.stats ?? [];
        this.features = source.features ?? [];
    }

    static partialFromModel(model: Featureblock): Partial<FeatureblockDTO> {
        const data: Partial<FeatureblockDTO> = {}
        if (model.name !== undefined) data.name = model.name;
        if (model.level !== undefined) data.level = model.level;
        if (model.ev !== undefined) data.ev = model.ev;
        if (model.stamina !== undefined) data.stamina = model.stamina;
        if (model.size !== undefined) data.size = model.size;
        if (model.stats !== undefined && model.stats.length > 0) data.stats = model.stats;
        if (model.stats !== undefined) data.stats = model.stats;
        return data;
    }

    public static fromModel(model: Featureblock): FeatureblockDTO {
        return new FeatureblockDTO(model.toDTO());
    }

    public toModel(): Featureblock {
        return Featureblock.fromDTO(this);
    }
} 