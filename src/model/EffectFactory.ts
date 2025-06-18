import { Effect } from './Effect';
import { PowerRollEffect } from './PowerRollEffect';
import { MundaneEffect } from './MundaneEffect';

export function effectFromDTO(data: any): Effect {
    if (data.roll) {
        return new PowerRollEffect(data);
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
