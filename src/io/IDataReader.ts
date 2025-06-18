import { SteelCompendiumModel } from "../model/SteelCompendiumModel";

export abstract class IDataReader<M extends SteelCompendiumModel<any>> {
    public abstract read(source: string): M;
} 