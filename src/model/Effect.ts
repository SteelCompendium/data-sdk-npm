import { IDataReader } from '../io';
import { EffectDTO, PowerRollEffectDTO, MundaneEffectDTO } from '../dto';
import { PowerRollEffect } from './PowerRollEffect';
import { MundaneEffect } from './MundaneEffect';

export abstract class Effect {
	public static allFrom(data: any): Effect[] {
		if (!data) {
			return [];
		}
		if (!Array.isArray(data)) {
			throw new Error("Expected effects to be an array");
		}
		const effects = [];
		for (const entry of data) {
			effects.push(Effect.from(entry));
		}
		return effects;
	}

	public static allFromDTO(dtos: EffectDTO[]): Effect[] {
		if (!dtos) {
			return [];
		}
		return dtos.map(dto => Effect.fromDTO(dto));
	}

	public static from(data: any): Effect {
		if (data.roll) {
			return PowerRollEffect.from(data);
		} else if (typeof data === "string") {
			return new MundaneEffect(data);
		} else if (data.effect) {
			return new MundaneEffect(data.effect, data.name, data.cost);
		} else {
			const key: string = Object.keys(data)[0];
			const effect: string = data[key];
			return new MundaneEffect(effect, key);
		}
	}

	public static fromDTO(dto: EffectDTO): Effect {
		if (typeof dto === 'string') {
			return MundaneEffect.fromDTO(dto);
		}
		if ('roll' in dto) {
			return PowerRollEffect.fromDTO(dto as PowerRollEffectDTO);
		}
		return MundaneEffect.fromDTO(dto as MundaneEffectDTO);
	}

	public static read(reader: IDataReader<any, any>, source: string): Effect {
		return reader.parse(source);
	}

	abstract effectType(): string;
	abstract toDTO(): EffectDTO;
}
