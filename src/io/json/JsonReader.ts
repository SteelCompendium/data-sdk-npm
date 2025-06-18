import { IDataReader } from "../IDataReader";
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";
import { SteelCompendiumDTO } from "../../dto/SteelCompendiumDTO";

export class JsonReader<T extends SteelCompendiumDTO<M>, M extends SteelCompendiumModel> extends IDataReader<T, M> {
    public read(source: string): T {
        const data = JSON.parse(source);
        return data as T;
    }
} 