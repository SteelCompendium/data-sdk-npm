import { Effect } from './Effect';
import { PowerRollEffectDTO } from '../dto/PowerRollEffectDTO';

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

    public static fromDTO(dto: PowerRollEffectDTO): PowerRollEffect {
        const data: any = dto;
        return new PowerRollEffect({
            roll: data.roll,
            t1: data.t1 ?? data["tier 1"] ?? data["11 or lower"],
            t2: data.t2 ?? data["tier 2"] ?? data["12-16"],
            t3: data.t3 ?? data["tier 3"] ?? data["17+"],
            crit: data.critical ?? data.crit ?? data["nat 19-20"]
        });
    }

    public toDTO(): PowerRollEffectDTO {
        const dto: PowerRollEffectDTO = {};
        if (this.roll !== undefined) dto.roll = this.roll;
        if (this.t1 !== undefined) dto.t1 = this.t1;
        if (this.t2 !== undefined) dto.t2 = this.t2;
        if (this.t3 !== undefined) dto.t3 = this.t3;
        if (this.crit !== undefined) dto.crit = this.crit;
        return dto;
    }

    // public static read(reader: IDataReader<PowerRollEffect>, source: string): PowerRollEffect {
    //     return reader.parse(source);
    // }

    effectType() {
        return "PowerRollEffect";
    }
} 