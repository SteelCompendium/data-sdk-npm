import { TraitDTO } from "../dto";
import { ModelDTOAdapter, SteelCompendiumModel } from "./SteelCompendiumModel";
import { Effects } from "./Effects";
export declare class Trait extends SteelCompendiumModel<TraitDTO> {
    name?: string;
    effects: Effects;
    constructor(source: Partial<Trait>);
    static modelDTOAdapter: ModelDTOAdapter<Trait, TraitDTO>;
    static fromDTO(dto: TraitDTO): Trait;
    toDTO(): Partial<TraitDTO>;
}
