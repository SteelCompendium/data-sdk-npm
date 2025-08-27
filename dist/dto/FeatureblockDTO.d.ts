import { Featureblock } from '../model/Featureblock';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';
export declare class FeatureblockDTO extends SteelCompendiumDTO<Featureblock> {
    name: string;
    type?: string;
    level?: number;
    ev?: string;
    flavor?: string;
    stamina?: string;
    size?: string;
    stats?: any[];
    features: any[];
    constructor(source: Partial<FeatureblockDTO>);
    static partialFromModel(model: Featureblock): Partial<FeatureblockDTO>;
    static fromModel(model: Featureblock): FeatureblockDTO;
    toModel(): Featureblock;
}
