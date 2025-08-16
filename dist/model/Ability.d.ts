import { AbilityDTO } from "../dto";
import { Effects } from "./Effects";
import { ModelDTOAdapter, SteelCompendiumModel } from "./SteelCompendiumModel";
import { AbilityXmlDTO } from "../dto/AbilityXmlDTO";
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
    metadata?: Record<string, any>;
    constructor(source: Partial<Ability>);
    static modelDTOAdapter: ModelDTOAdapter<Ability, AbilityDTO>;
    static fromDTO(dto: AbilityDTO): Ability;
    toDTO(): Partial<AbilityDTO>;
    toXmlDTO(): Partial<AbilityXmlDTO>;
    isTrait(): boolean;
}
