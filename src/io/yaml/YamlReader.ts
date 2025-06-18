import { IDataReader, DTOClass } from "../IDataReader";
import { parse } from 'yaml';
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";
import { SteelCompendiumDTO } from "../../dto";

export class YamlReader<T extends SteelCompendiumDTO<M>, M extends SteelCompendiumModel<T>> extends IDataReader<T, M> {
    public read(source: string, ctor: DTOClass<T, M>): T {
        const data = parse(source);
        return new ctor(data);
    }
} 