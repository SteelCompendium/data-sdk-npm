import { SteelCompendiumModel } from "../model/SteelCompendiumModel";

export abstract class SteelCompendiumDTO<M extends SteelCompendiumModel<any>> {
    public abstract toModel(): M;
} 