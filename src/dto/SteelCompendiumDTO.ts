import { SteelCompendiumModel } from "../model/SteelCompendiumModel";

export abstract class SteelCompendiumDTO<M extends SteelCompendiumModel<any>> {
    type!: string;

    protected constructor(source: Partial<SteelCompendiumDTO<M>>, type: string) {
        Object.assign(this, source);
        this.type = type;
    }
    public abstract toModel(): M;
} 