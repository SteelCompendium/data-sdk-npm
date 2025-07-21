import { IDataWriter } from "../IDataWriter";
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";
export declare class XmlWriter<M extends SteelCompendiumModel<any>> extends IDataWriter<M> {
    private readonly rootName;
    constructor(rootName: string);
    write(data: M): string;
}
