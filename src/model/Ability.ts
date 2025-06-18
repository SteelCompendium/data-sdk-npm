import { Effect } from "./Effect";
import { IDataReader, IDataWriter } from "../io";
import { SteelCompendiumModel } from "./SteelCompendiumModel";

export class Ability extends SteelCompendiumModel {
    indent?: number;
    name?: string;
    cost?: string;
    flavor?: string;
    keywords?: string[];
    type?: string;
    distance?: string;
    target?: string;
    trigger?: string;
    effects: Effect[];

    constructor(indent: number, name: string, cost: string, flavor: string, keywords: string[], type: string, distance: string, target: string, trigger: string, effects: Effect[]) {
        super();
        this.indent = indent;
        this.name = name;
        this.cost = cost;
        this.flavor = flavor;
        this.keywords = keywords;
        this.type = type;
        this.distance = distance;
        this.target = target;
        this.trigger = trigger;
        this.effects = effects;
    }

    public static from(data: any) {
        return new Ability(
            typeof data.indent === 'string' ? parseInt(data.indent) : data.indent,
            data.name,
            data.cost,
            data.flavor,
            data.keywords,
            data.type,
            data.distance,
            data.target,
            data.trigger,
            data.effects ? Effect.allFrom(data.effects) : []
        );
    }

    public static read(reader: IDataReader<Ability>, source: string): Ability {
        return reader.read(source);
    }
}
