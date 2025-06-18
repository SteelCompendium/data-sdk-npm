import { IDataReader } from "../IDataReader";
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";

export class JsonReader<T extends SteelCompendiumModel> implements IDataReader<T> {
    private fromFunction: (data: any) => T;

    constructor(fromFunction: (data: any) => T) {
        this.fromFunction = fromFunction;
    }

    read(source: string): T {
        const data = JSON.parse(source);
        return this.fromFunction(data);
    }
} 