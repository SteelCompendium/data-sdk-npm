import { IDataReader } from '../io';
import { PowerRollEffect } from './PowerRollEffect';
import { MundaneEffect } from './MundaneEffect';

export abstract class Effect {
	public static fromDTO(data: any): Effect {
		if (data.roll) {
			return PowerRollEffect.from(data);
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

	public static read(reader: IDataReader<any, any>, source: string): Effect {
		return reader.parse(source);
	}

	abstract effectType(): string;
	abstract toDTO(): any;
}
