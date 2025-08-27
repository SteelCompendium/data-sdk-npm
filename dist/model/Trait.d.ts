import { TraitDTO } from "../dto";
import { ModelDTOAdapter, SteelCompendiumModel } from "./SteelCompendiumModel";
import { Effects } from "./Effects";
export declare class Trait extends SteelCompendiumModel<TraitDTO> {
    name?: string;
    icon?: string;
    effects: Effects;
    constructor(source: Partial<Trait>);
    featureType(): string;
    static modelDTOAdapter: ModelDTOAdapter<Trait, TraitDTO>;
    static fromDTO(dto: TraitDTO): Trait;
    toDTO(): Partial<TraitDTO>;
}
