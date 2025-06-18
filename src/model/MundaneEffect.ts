import { Effect } from './Effect';

export class MundaneEffect extends Effect {
    name?: string;
    cost?: string;
    effect: string;

    public constructor(source: Partial<MundaneEffect>) {
        super();
        Object.assign(this, source);
        this.effect = source.effect ?? '';
    }

    public effectType(): string {
        return 'MundaneEffect';
    }

    // TODO - does this show blank fields if the value is undefined
    public toDTO(): any {
        return {
            effect: this.effect,
            name: this.name,
            cost: this.cost,
        };
    }
} 