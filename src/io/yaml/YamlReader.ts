import { IDataReader } from "../IDataReader";
import { parse } from 'yaml';
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";

export class YamlReader<T extends SteelCompendiumModel> implements IDataReader<T> {
    private fromFunction: (data: any) => T;

    constructor(fromFunction: (data: any) => T) {
        this.fromFunction = fromFunction;
    }

    read(source: string): T {
        const data = parse(source);
        return this.fromFunction(data);
    }
} 