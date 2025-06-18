import { Effect } from './Effect';

export class PowerRollEffect extends Effect {
    roll?: string;
    t1?: string;
    t2?: string;
    t3?: string;
    crit?: string;

    public constructor(source: Partial<PowerRollEffect>) {
        super();
        Object.assign(this, source);
    }

    // public static from(data: any): PowerRollEffect {
    //     return new PowerRollEffect(
    //         data.roll,
    //         data.t1 ?? data["tier 1"] ?? data["11 or lower"],
    //         data.t2 ?? data["tier 2"] ?? data["12-16"],
    //         data.t3 ?? data["tier 3"] ?? data["17+"],
    //         data.critical ?? data.crit ?? data["nat 19-20"]
    //     );
    // }

    // public static fromDTO(dto: PowerRollEffectDTO): PowerRollEffect {
    //     return PowerRollEffect.from(dto);
    // }

    public toDTO(): any {
        return {
            roll: this.roll,
            't1': this.t1,
            't2': this.t2,
            't3': this.t3,
            crit: this.crit,
        }
    }

    // public static read(reader: IDataReader<PowerRollEffect>, source: string): PowerRollEffect {
    //     return reader.parse(source);
    // }

    effectType() {
        return "PowerRollEffect";
    }
} 