import { Ability } from "./Ability";
import { FeatureblockDTO } from "../dto";
import { ModelDTOAdapter, SteelCompendiumModel } from "./SteelCompendiumModel";
export declare class Featureblock extends SteelCompendiumModel<FeatureblockDTO> {
    name: string;
    type?: string;
    level?: number;
    ev?: string;
    flavor?: string;
    stamina?: string;
    size: string;
    stats?: Record<string, any>;
    features: Ability[];
    constructor(source: Partial<Featureblock>);
    static modelDTOAdapter: ModelDTOAdapter<Featureblock, FeatureblockDTO>;
    static fromDTO(dto: FeatureblockDTO): Featureblock;
    toDTO(): Partial<FeatureblockDTO>;
}
