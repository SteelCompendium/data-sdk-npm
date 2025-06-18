import { IDataReader } from "../IDataReader";
import { ModelDTOAdapter as ModelDTOAdapater, SteelCompendiumModel } from "../../model/SteelCompendiumModel";
import { SteelCompendiumDTO } from "../../dto";

export class JsonReader<M extends SteelCompendiumModel<T>, T extends SteelCompendiumDTO<M>> extends IDataReader<M> {
    public constructor(private adapter: ModelDTOAdapater<M, T>) {
        super();
    }

    public read(source: string): M {
        return this.adapter(JSON.parse(source));
    }
} 