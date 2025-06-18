import { IDataReader } from "../IDataReader";
import { SteelCompendiumModel } from "../../model/SteelCompendiumModel";
import { SteelCompendiumDTO } from "../../dto/SteelCompendiumDTO";

export class JsonReader<T extends SteelCompendiumDTO<M>, M extends SteelCompendiumModel<T>> extends IDataReader<T, M> {
    public constructor(private ctor: new (source: any) => T) {
        super();
    }

    public read(source: string): T {
        const data = JSON.parse(source);
        return new this.ctor(data);
    }
} 