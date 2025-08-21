import { Effect } from './Effect';
export declare class TestEffect extends Effect {
    effect?: string;
    t1?: string;
    t2?: string;
    t3?: string;
    crit?: string;
    constructor(source: Partial<TestEffect>);
    static fromDTO(dto: any): TestEffect;
    toDTO(): any;
    toXmlDTO(): {
        '@_type': string;
        effect: string | undefined;
        t1: string | undefined;
        t2: string | undefined;
        t3: string | undefined;
        crit: string | undefined;
    };
    effectType(): string;
}
