import { Effect } from "./Effect";
import { IDataReader, IDataWriter } from "../io";
import { AbilityDTO } from "../dto";
import { SteelCompendiumModel } from "./SteelCompendiumModel";

export class Ability extends SteelCompendiumModel {
    name?: string;
    cost?: string;
    flavor?: string;
    keywords?: string[];
    type?: string;
    distance?: string;
    target?: string;
    trigger?: string;
    effects: Effect[];

    constructor(name: string, cost: string, flavor: string, keywords: string[], type: string, distance: string, target: string, trigger: string, effects: Effect[]) {
        super();
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

    public static fromDTO(dto: AbilityDTO): Ability {
        return new Ability(
            dto.name ?? '',
            dto.cost ?? '',
            dto.flavor ?? '',
            dto.keywords ?? [],
            dto.type ?? '',
            dto.distance ?? '',
            dto.target ?? '',
            dto.trigger ?? '',
            Effect.allFromDTO(dto.effects) ?? [],
        );
    }

    public toDTO(): AbilityDTO {
        return {
            name: this.name!,
            type: this.type!,
            cost: this.cost,
            keywords: this.keywords,
            distance: this.distance,
            target: this.target,
            trigger: this.trigger,
            flavor: this.flavor,
            effects: this.effects.map(e => e.toDTO()),
        };
    }

    public static read(reader: IDataReader<Ability>, source: string): Ability {
        return reader.read(source);
    }
}
