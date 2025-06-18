import { IDataReader } from "../IDataReader";
import { ModelDTOAdapter as ModelDTOAdapater, SteelCompendiumModel } from "../../model/SteelCompendiumModel";
import { SteelCompendiumDTO } from "../../dto";
export declare class JsonReader<M extends SteelCompendiumModel<T>, T extends SteelCompendiumDTO<M>> extends IDataReader<M> {
    private adapter;
    constructor(adapter: ModelDTOAdapater<M, T>);
    read(source: string): M;
}
