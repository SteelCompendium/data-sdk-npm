import { IDataWriter } from "../IDataWriter";
import { stringify } from 'yaml';
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";
import { SteelCompendiumDTO } from "../../dto";

export class YamlWriter<T extends SteelCompendiumDTO<M>, M extends SteelCompendiumModel<T>> extends IDataWriter<T, M> {
    write(data: T): string {
        return stringify(data);
    }
} 