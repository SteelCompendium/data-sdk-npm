export declare abstract class Effect {
    static allFrom(data: any): Effect[];
    static from(data: any): Effect;
    static fromYaml(yaml: string): Effect;
    static fromJson(json: string): Effect;
    abstract effectType(): string;
}
export declare class PowerRollEffect extends Effect {
    roll?: string;
    t1?: string;
    t2?: string;
    t3?: string;
    crit?: string;
    constructor(roll: string, t1: string, t2: string, t3: string, crit: string);
    static from(data: any): PowerRollEffect;
    static fromYaml(yaml: string): PowerRollEffect;
    static fromJson(json: string): PowerRollEffect;
    toYaml(): string;
    toJson(): string;
    effectType(): string;
}
export declare class MundaneEffect extends Effect {
    name?: string;
    cost?: string;
    effect: string;
    static parseKeyValue(data: any): MundaneEffect;
    static from(data: any): MundaneEffect;
    static nameless(effect: string): MundaneEffect;
    constructor(effect: string, name?: string, cost?: string);
    static fromYaml(yaml: string): MundaneEffect;
    static fromJson(json: string): MundaneEffect;
    toYaml(): string;
    toJson(): string;
    effectType(): string;
}
