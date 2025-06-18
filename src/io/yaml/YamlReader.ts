import { IDataReader } from "../IDataReader";
import { parse } from 'yaml';
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";
import { SteelCompendiumDTO } from "../../dto";

export class YamlReader<T extends SteelCompendiumDTO<M>, M extends SteelCompendiumModel<T>> extends IDataReader<T, M> {
    public constructor(private ctor: new (source: any) => T) {
        super();
    }

    public read(source: string): T {
        const data = parse(source);
        return new this.ctor(data);
    }
} 