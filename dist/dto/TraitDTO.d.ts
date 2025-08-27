import { SteelCompendiumDTO } from './SteelCompendiumDTO';
import { Trait } from '../model/Trait';
export declare class TraitDTO extends SteelCompendiumDTO<Trait> {
    name: string;
    icon?: string;
    effects: any[];
    constructor(source: Partial<TraitDTO>);
    static partialFromModel(model: Trait): Partial<TraitDTO>;
    static fromModel(model: Trait): TraitDTO;
    toModel(): Trait;
}
