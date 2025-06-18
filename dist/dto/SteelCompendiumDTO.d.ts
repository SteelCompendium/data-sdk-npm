import { SteelCompendiumModel } from "../model/SteelCompendiumModel";
export declare abstract class SteelCompendiumDTO<M extends SteelCompendiumModel<any>> {
    protected constructor(source: Partial<SteelCompendiumDTO<M>>);
    abstract toModel(): M;
}
