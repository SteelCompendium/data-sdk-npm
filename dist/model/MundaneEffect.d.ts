import { Effect } from './Effect';
export declare class MundaneEffect extends Effect {
    name?: string;
    cost?: string;
    effect: string;
    constructor(source: Partial<MundaneEffect>);
    effectType(): string;
    toDTO(): any;
}
