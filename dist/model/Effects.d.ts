import { Effect } from './Effect';
export declare class Effects {
    effects: Effect[];
    constructor(effects: Effect[]);
    static fromDTO(data: any): Effects;
    toDTO(): any[];
}
export declare function effectFromDTO(data: any): Effect;
