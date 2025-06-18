import { Effect } from "./Effect";
export declare class Ability {
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
    constructor(indent: number, name: string, cost: string, flavor: string, keywords: string[], type: string, distance: string, target: string, trigger: string, effects: Effect[]);
    static from(data: any): Ability;
    static fromYaml(yaml: string): Ability;
    static fromJson(json: string): Ability;
    toYaml(): string;
    toJson(): string;
}
