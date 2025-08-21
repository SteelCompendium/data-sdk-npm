import { Effect } from './Effect';

export class TestEffect extends Effect {
    effect?: string;
    t1?: string;
    t2?: string;
    t3?: string;
    crit?: string;

    public constructor(source: Partial<TestEffect>) {
        super();
        Object.assign(this, source);
    }

    public static fromDTO(dto: any): TestEffect {
        const data: any = dto;
        return new TestEffect({
            effect: data.effect,
            t1: data.t1 ?? data["tier 1"] ?? data["11 or lower"] ?? data["≤11"],
            t2: data.t2 ?? data["tier 2"] ?? data["12-16"] ?? data["12–16"],
            t3: data.t3 ?? data["tier 3"] ?? data["17+"],
            crit: data.critical ?? data.crit ?? data["nat 19-20"]
        });
    }

    public toDTO(): any {
        const dto: any = {};
        if (this.effect !== undefined) dto.effect = this.effect;
        if (this.t1 !== undefined) dto.t1 = this.t1;
        if (this.t2 !== undefined) dto.t2 = this.t2;
        if (this.t3 !== undefined) dto.t3 = this.t3;
        if (this.crit !== undefined) dto.crit = this.crit;
        return dto;
    }

    public toXmlDTO() {
        return {
            '@_type': 'test',
            effect: this.effect,
            t1: this.t1,
            t2: this.t2,
            t3: this.t3,
            crit: this.crit,
        };
    }

    effectType() {
        return "TestEffect";
    }
}