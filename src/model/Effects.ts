import { Effect } from './Effect';
import { MundaneEffect } from './MundaneEffect';
import { PowerRollEffect } from './PowerRollEffect';
import {TestEffect} from "./TestEffect";

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
            console.log("NOT AN ARRAY\n" + JSON.stringify(data))
            throw new Error("Expected effects to be an array");
        }
        return new Effects(data.map(effectFromDTO));
    }

    public toDTO(): any[] {
        return this.effects.map(e => e.toDTO());
    }

    public toXmlDTO(): any[] {
        return this.effects.map(e => e.toXmlDTO());
    }
}

export function effectFromDTO(effect_data: any): Effect {
    if (effect_data['@_type'] === "mundane") {
        return new MundaneEffect({ effect: effect_data['#text'], name: effect_data['@_name'], cost: effect_data['@_cost'] });
    } else if (effect_data['@_type'] === "roll") {
        return PowerRollEffect.fromDTO(effect_data);
    } else if (effect_data['@_type'] === "test") {
        return TestEffect.fromDTO(effect_data);
    } else if (effect_data.type === "mundane") {
        return new MundaneEffect({ effect: effect_data.text, name: effect_data.name, cost: effect_data.cost });
    } else if (effect_data.roll) {
        return PowerRollEffect.fromDTO(effect_data);
    } else if (effect_data.test && effect_data.t1) {
        return TestEffect.fromDTO(effect_data);
    } else if (typeof effect_data === "string") {
        return new MundaneEffect({ effect: effect_data });
    } else if (effect_data.effect) {
        return new MundaneEffect({ effect: effect_data.effect, name: effect_data.name, cost: effect_data.cost });
    } else {
        const key: string = Object.keys(effect_data)[0];
        const effect: string = effect_data[key];
        return new MundaneEffect({ effect: effect, name: key });
    }
}

