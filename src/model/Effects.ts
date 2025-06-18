import { Effect } from './Effect';
import { effectFromDTO } from './EffectFactory';

export class Effects {
    effects: Effect[];

    public constructor(effects: Effect[]) {
        this.effects = effects;
    }

    public static fromDTO(data: any): Effects {
        if (!data) {
            return new Effects([]);
        }
        if (!Array.isArray(data)) {
            throw new Error("Expected effects to be an array");
        }
        return new Effects(data.map(effectFromDTO));
    }

    public toDTO(): any[] {
        return this.effects.map(e => e.toDTO());
    }

}

