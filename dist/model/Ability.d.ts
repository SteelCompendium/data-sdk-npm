import { AbilityDTO } from "../dto";
import { Effects } from "./Effects";
import { ModelDTOAdapter, SteelCompendiumModel } from "./SteelCompendiumModel";
export declare class Ability extends SteelCompendiumModel<AbilityDTO> {
    name?: string;
    cost?: string;
    flavor?: string;
    keywords?: string[];
    type?: string;
    distance?: string;
    target?: string;
    trigger?: string;
    effects: Effects;
    constructor(source: Partial<Ability>);
    static modelDTOAdapter: ModelDTOAdapter<Ability, AbilityDTO>;
    static fromDTO(dto: AbilityDTO): Ability;
    toDTO(): Partial<AbilityDTO>;
}
