import { Effect } from "./Effect";


export class Trait {
    name: string;
    type?: string;
    effects: Effect[];

    constructor(name: string, type?: string, effects?: any) {
        this.name = name?.trim() ?? '';
        this.type = type?.trim();
        this.effects = effects ?? [];
    }

    static from(data: { name?: string; type?: string; effects?: any; }) {
        const d: any = {};
        d.name = data.name?.trim() ?? '';
        d.type = data.type?.trim();
        d.effects = data.effects ? Effect.allFrom(data.effects) : [];
        return new Trait(d);
    }
}
