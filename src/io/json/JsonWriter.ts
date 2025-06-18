import { IDataWriter } from "../IDataWriter";
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";

export class JsonWriter<T extends SteelCompendiumModel> implements IDataWriter<T> {
    write(data: T): string {
        return JSON.stringify(data);
    }
} 