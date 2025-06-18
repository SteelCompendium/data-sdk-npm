import { IDataReader } from "../IDataReader";
import { ModelDTOAdapter as ModelDTOAdapater, SteelCompendiumModel } from "../../model/SteelCompendiumModel";
import { SteelCompendiumDTO } from "../../dto";

export class JsonReader<M extends SteelCompendiumModel<T>, T extends SteelCompendiumDTO<M>> extends IDataReader<M> {
    private adapter: ModelDTOAdapater<M, T>;

    public constructor(adapter: ModelDTOAdapater<M, T>) {
        super();
        this.adapter = adapter;
    }

    public read(source: string): M {
        const data = JSON.parse(source);
        return this.adapter(data);
    }
} 