import { IDataReader } from "../IDataReader";
import { parse } from 'yaml';
import { ModelDTOAdapter, SteelCompendiumModel } from "../../model/SteelCompendiumModel";
import { SteelCompendiumDTO } from "../../dto";

export class YamlReader<M extends SteelCompendiumModel<T>, T extends SteelCompendiumDTO<M>> extends IDataReader<M> {
    public constructor(private adapter: ModelDTOAdapter<M, T>) {
        super();
    }

    public read(source: string): M {
        return this.adapter(parse(source));
    }
} 