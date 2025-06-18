import { IDataWriter } from "../IDataWriter";
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";
import { SteelCompendiumDTO } from "../../dto";

export class JsonWriter<T extends SteelCompendiumDTO<M>, M extends SteelCompendiumModel<T>> extends IDataWriter<T, M> {
    write(data: T): string {
        return JSON.stringify(data);
    }
} 