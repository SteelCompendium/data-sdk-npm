import { EffectDTO, MundaneEffectDTO } from '../dto';
import { Effect } from './Effect';

export class MundaneEffect extends Effect {
    public constructor(public effect: string, public name?: string, public cost?: string) {
        super();
    }

    public static fromDTO(dto: MundaneEffectDTO | string): MundaneEffect {
        if (typeof dto === 'string') {
            return new MundaneEffect(dto);
        }
        return new MundaneEffect(dto.effect, dto.name, dto.cost);
    }

    public toDTO(): MundaneEffectDTO {
        const dto: MundaneEffectDTO = { effect: this.effect };
        if (this.name) {
            dto.name = this.name;
        }
        if (this.cost) {
            dto.cost = this.cost;
        }
        return dto;
    }

    public effectType(): string {
        return 'MundaneEffect';
    }
} 