import { IDataReader } from "../IDataReader";
import { ModelDTOAdapter, SteelCompendiumModel } from "../../model/SteelCompendiumModel";
import { SteelCompendiumDTO } from "../../dto";
export declare class XmlReader<M extends SteelCompendiumModel<T>, T extends SteelCompendiumDTO<M>> extends IDataReader<M> {
    private adapter;
    constructor(adapter: ModelDTOAdapter<M, T>);
    read(source: string): M;
}
