import { SteelCompendiumDTO } from "./SteelCompendiumDTO";
import { Ability } from "../model";
export declare class AbilityXmlDTO extends SteelCompendiumDTO<Ability> {
    name: string;
    type: string;
    cost?: string;
    keywords?: {
        keyword: string[];
    };
    distance?: string;
    target?: string;
    trigger?: string;
    flavor?: string;
    effects?: any;
    metadata?: any;
    constructor(source: Partial<AbilityXmlDTO>);
    static partialFromModel(model: Ability): Partial<AbilityXmlDTO>;
    toModel(): Ability;
}
