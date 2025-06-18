import { Effect } from "./Effect";
import { IDataReader, IDataWriter } from "../io";
import { SteelCompendiumModel } from "./SteelCompendiumModel";


export class Trait extends SteelCompendiumModel {
    name: string;
    type?: string;
    effects: Effect[];

    constructor(name: string, type: string, effects: Effect[]) {
        super();
        this.name = name;
        this.type = type;
        this.effects = effects;
    }

    static from(data: any): Trait {
        return new Trait(
            data.name?.trim() ?? '',
            data.type?.trim(),
            data.effects ? Effect.allFrom(data.effects) : []
        );
    }

    public static read(reader: IDataReader<Trait>, source: string): Trait {
        return reader.read(source);
    }
}
