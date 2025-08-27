import { Ability } from "./Ability";
import { FeatureblockDTO } from "../dto";
import { ModelDTOAdapter, SteelCompendiumModel } from "./SteelCompendiumModel";
import { FeatureStat } from "./FeatureStat";
export declare class Featureblock extends SteelCompendiumModel<FeatureblockDTO> {
    name: string;
    type?: string;
    level?: number;
    ev?: string;
    flavor?: string;
    stamina?: string;
    size: string;
    stats?: FeatureStat[];
    features: Ability[];
    constructor(source: Partial<Featureblock>);
    static modelDTOAdapter: ModelDTOAdapter<Featureblock, FeatureblockDTO>;
    static fromDTO(dto: FeatureblockDTO): Featureblock;
    toDTO(): Partial<FeatureblockDTO>;
}
