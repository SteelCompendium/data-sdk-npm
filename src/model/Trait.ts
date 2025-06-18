import { Effect } from "./Effect";
import { parse, stringify } from 'yaml';


export class Trait {
    name: string;
    type?: string;
    effects: Effect[];

    constructor(name: string, type: string, effects: Effect[]) {
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

    public static fromYaml(yaml: string): Trait {
        return Trait.from(parse(yaml));
    }

    public static fromJson(json: string): Trait {
        return Trait.from(JSON.parse(json));
    }

    public toYaml(): string {
        return stringify(this);
    }

    public toJson(): string {
        return JSON.stringify(this);
    }
}
