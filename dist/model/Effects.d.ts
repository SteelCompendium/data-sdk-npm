import { Effect } from './Effect';
export declare class Effects {
    effects: Effect[];
    constructor(effects: Effect[]);
    static fromDTO(data: any): Effects;
    toDTO(): any[];
    toXmlDTO(): any[];
}
export declare function effectFromDTO(effect_data: any): Effect;
