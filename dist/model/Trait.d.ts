import { Effect } from "./Effect";
export declare class Trait {
    name: string;
    type?: string;
    effects: Effect[];
    constructor(name: string, type: string, effects: Effect[]);
    static from(data: any): Trait;
    static fromYaml(yaml: string): Trait;
    static fromJson(json: string): Trait;
    toYaml(): string;
    toJson(): string;
}
