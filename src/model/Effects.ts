import { Effect } from './Effect';
import { MundaneEffect } from './MundaneEffect';
import { PowerRollEffect } from './PowerRollEffect';

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

export function effectFromDTO(data: any): Effect {
    if (data.roll) {
        return PowerRollEffect.fromDTO(data);
    } else if (typeof data === "string") {
        return new MundaneEffect({ effect: data });
    } else if (data.effect) {
        return new MundaneEffect({ effect: data.effect, name: data.name, cost: data.cost });
    } else {
        const key: string = Object.keys(data)[0];
        const effect: string = data[key];
        return new MundaneEffect({ effect: effect, name: key });
    }
}

