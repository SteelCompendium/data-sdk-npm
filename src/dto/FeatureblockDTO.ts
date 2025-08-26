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
        if (model.type !== undefined) data.type = model.type;
        if (model.level !== undefined) data.level = model.level;
        if (model.ev !== undefined) data.ev = model.ev;
        if (model.flavor !== undefined) data.flavor = model.flavor;
        if (model.stamina !== undefined) data.stamina = model.stamina;
        if (model.size !== undefined) data.size = model.size;
        if (model.stats !== undefined) data.stats = model.stats;
        if (model.features !== undefined) data.features = model.features.map(f => f.toDTO());
        return data;
    }

    public static fromModel(model: Featureblock): FeatureblockDTO {
        return new FeatureblockDTO(model.toDTO());
    }

    public toModel(): Featureblock {
        return Featureblock.fromDTO(this);
    }
} 