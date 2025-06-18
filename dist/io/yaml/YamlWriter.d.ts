import { IDataWriter } from "../IDataWriter";
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";
export declare class YamlWriter<M extends SteelCompendiumModel<any>> extends IDataWriter<M> {
    write(data: M): string;
}
