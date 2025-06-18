import { IDataWriter } from "../IDataWriter";
import { stringify } from 'yaml';
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";

export class YamlWriter<M extends SteelCompendiumModel<any>> extends IDataWriter<M> {
    write(data: M): string {
        return stringify(data.toDTO());
    }
} 