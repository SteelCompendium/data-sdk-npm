import { SteelCompendiumModel } from "../model/SteelCompendiumModel";

export abstract class SteelCompendiumDTO<M extends SteelCompendiumModel<any>> {
    protected constructor(source: Partial<SteelCompendiumDTO<M>>) {
        Object.assign(this, source);
    }
    public abstract toModel(): M;
} 