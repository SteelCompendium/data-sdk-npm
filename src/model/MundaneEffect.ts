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

    public toDTO(): any {
        const dto: any = {
            effect: this.effect,
        };
        if (this.name !== undefined) dto.name = this.name;
        if (this.cost !== undefined) dto.cost = this.cost;
        return dto;
    }

    public toXmlDTO() {
        const dto: any = {
            '@_type': 'mundane',
            '#text': this.effect,
        };
        if (this.name !== undefined) dto['@_name'] = this.name;
        if (this.cost !== undefined) dto['@_cost'] = this.cost;

        return dto;
    }
} 