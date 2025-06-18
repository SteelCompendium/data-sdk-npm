import { IDataReader, DTOClass } from "../IDataReader";
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";
import { SteelCompendiumDTO } from "../../dto/SteelCompendiumDTO";

export class JsonReader<T extends SteelCompendiumDTO<M>, M extends SteelCompendiumModel<T>> extends IDataReader<T, M> {
    public read(source: string, ctor: DTOClass<T, M>): T {
        const data = JSON.parse(source);
        return new ctor(data);
    }
} 