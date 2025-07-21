import { Effect } from './Effect';
export declare class PowerRollEffect extends Effect {
    roll?: string;
    t1?: string;
    t2?: string;
    t3?: string;
    crit?: string;
    constructor(source: Partial<PowerRollEffect>);
    static fromDTO(dto: any): PowerRollEffect;
    toDTO(): any;
    toXmlDTO(): {
        '@_type': string;
        roll: string | undefined;
        t1: string | undefined;
        t2: string | undefined;
        t3: string | undefined;
        crit: string | undefined;
    };
    effectType(): string;
}
