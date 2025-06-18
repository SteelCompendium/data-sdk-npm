import { SteelCompendiumDTO } from "../dto/SteelCompendiumDTO";
import { SteelCompendiumModel } from "../model/SteelCompendiumModel";

export type DTOClass<T extends SteelCompendiumDTO<M>, M extends SteelCompendiumModel<T>> = new (source: any) => T;

export abstract class IDataReader<T extends SteelCompendiumDTO<M>, M extends SteelCompendiumModel<T>> {
    public abstract read(source: string, ctor: DTOClass<T, M>): T;

    public parse(source: string, ctor: DTOClass<T, M>): M {
        return this.read(source, ctor).toModel();
    }
} 