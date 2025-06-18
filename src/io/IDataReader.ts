import { SteelCompendiumDTO } from "../dto/SteelCompendiumDTO";
import { SteelCompendiumModel } from "../model/SteelCompendiumModel";

export abstract class IDataReader<T extends SteelCompendiumDTO<M>, M extends SteelCompendiumModel> {
    public abstract read(source: string): T;

    public parse(source: string): M {
        return this.read(source).toModel();
    }
} 