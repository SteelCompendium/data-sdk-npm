import { IDataWriter } from "../IDataWriter";
import { stringify } from 'yaml';
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";

export class YamlWriter<T extends SteelCompendiumModel> implements IDataWriter<T> {
    write(data: T): string {
        return stringify(data);
    }
} 