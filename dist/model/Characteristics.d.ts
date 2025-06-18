export declare class Characteristics {
    might: number;
    agility: number;
    reason: number;
    intuition: number;
    presence: number;
    constructor(might: number, agility: number, reason: number, intuition: number, presence: number);
    static from(data: any): Characteristics;
    static fromYaml(yaml: string): Characteristics;
    static fromJson(json: string): Characteristics;
    toYaml(): string;
    toJson(): string;
}
