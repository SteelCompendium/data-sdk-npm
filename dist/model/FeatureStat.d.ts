import { SteelCompendiumPseudoModel } from '.';
export declare class FeatureStat implements SteelCompendiumPseudoModel {
    name: string;
    value: string;
    constructor(name: string, value: string);
    static fromDTO(data: any): FeatureStat;
    toDTO(): void;
}
