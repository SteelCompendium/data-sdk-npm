import { Ability } from '../model/Ability';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';
export declare class AbilityDTO extends SteelCompendiumDTO<Ability> {
    name: string;
    type: string;
    cost?: string;
    keywords?: string[];
    distance?: string;
    target?: string;
    trigger?: string;
    effects: any[];
    flavor?: string;
    constructor(source: Partial<AbilityDTO>);
    static partialFromModel(model: Ability): Partial<AbilityDTO>;
    static fromModel(model: Ability): AbilityDTO;
    toModel(): Ability;
}
