import { IDataWriter } from "../io";
import { SteelCompendiumModel } from "../model/SteelCompendiumModel";

export abstract class SteelCompendiumDTO<M extends SteelCompendiumModel> {
    public abstract toModel(): M;
} 