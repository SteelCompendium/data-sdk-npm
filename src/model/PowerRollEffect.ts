import { Effect } from './Effect';
import { PowerRollEffectDTO } from '../dto';
import { IDataReader } from '../io';

export class PowerRollEffect extends Effect {
    roll?: string;
    t1?: string;
    t2?: string;
    t3?: string;
    crit?: string;

    constructor(roll: string, t1: string, t2: string, t3: string, crit: string) {
        super();
        this.roll = roll;
        this.t1 = t1;
        this.t2 = t2;
        this.t3 = t3;
        this.crit = crit;
    }

    public static from(data: any): PowerRollEffect {
        return new PowerRollEffect(
            data.roll,
            data.t1 ?? data["tier 1"] ?? data["11 or lower"],
            data.t2 ?? data["tier 2"] ?? data["12-16"],
            data.t3 ?? data["tier 3"] ?? data["17+"],
            data.critical ?? data.crit ?? data["nat 19-20"]
        );
    }

    public static fromDTO(dto: PowerRollEffectDTO): PowerRollEffect {
        return PowerRollEffect.from(dto);
    }

    public toDTO(): PowerRollEffectDTO {
        const dto: PowerRollEffectDTO = {
            roll: this.roll!,
        };
        if (this.t1) dto['11 or lower'] = this.t1;
        if (this.t2) dto['12-16'] = this.t2;
        if (this.t3) dto['17+'] = this.t3;
        if (this.crit) dto.crit = this.crit;
        return dto;
    }

    public static read(reader: IDataReader<PowerRollEffect, PowerRollEffect>, source: string): PowerRollEffect {
        return reader.parse(source);
    }

    effectType() {
        return "PowerRollEffect";
    }
} 