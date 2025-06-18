import { IDataReader, IDataWriter } from '../io';
import { EffectDTO, NamedEffectWithCostDTO, CostedEffectDTO, NamedEffectDTO, PowerRollEffectDTO } from '../dto';
import { SteelCompendiumModel } from './SteelCompendiumModel';

export abstract class Effect extends SteelCompendiumModel<EffectDTO> {
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
			return MundaneEffect.nameless(data);
		} else if (data.effect) {
			return MundaneEffect.from(data);
		} else {
			return MundaneEffect.parseKeyValue(data);
		}
	}

	public static fromDTO(dto: EffectDTO): Effect {
		if (typeof dto === 'string') {
			return MundaneEffect.fromDTO(dto);
		}
		if ('roll' in dto) {
			return PowerRollEffect.fromDTO(dto as PowerRollEffectDTO);
		}
		return MundaneEffect.fromDTO(dto);
	}

	public static read(reader: IDataReader<Effect>, source: string): Effect {
		return reader.read(source);
	}

	abstract effectType(): string;
	abstract toDTO(): EffectDTO;
}

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

	public static read(reader: IDataReader<PowerRollEffect>, source: string): PowerRollEffect {
		return reader.read(source);
	}

	effectType() {
		return "PowerRollEffect";
	}
}

export class MundaneEffect extends Effect {
	name?: string;
	cost?: string;
	effect: string;

	static parseKeyValue(data: any) {
		const key: string = Object.keys(data)[0];
		const effect: string = data[key];
		return new MundaneEffect(effect, key, undefined);
	}

	static from(data: any) {
		return new MundaneEffect(data.effect, data.name, data.cost);
	}

	static fromDTO(dto: NamedEffectWithCostDTO | CostedEffectDTO | NamedEffectDTO | string): MundaneEffect {
		if (typeof dto === 'string') {
			return MundaneEffect.nameless(dto);
		}
		const name = 'name' in dto ? dto.name : undefined;
		const cost = 'cost' in dto ? dto.cost : undefined;
		return new MundaneEffect(dto.effect, name, cost);
	}

	static nameless(effect: string) {
		return new MundaneEffect(effect, undefined, undefined);
	}

	constructor(effect: string, name?: string, cost?: string) {
		super();
		this.name = name;
		this.cost = cost;
		this.effect = effect;
	}

	public toDTO(): EffectDTO {
		if (this.name && this.cost) {
			return { name: this.name, cost: this.cost, effect: this.effect };
		}
		if (this.name) {
			return { name: this.name, effect: this.effect };
		}
		if (this.cost) {
			return { cost: this.cost, effect: this.effect };
		}
		return this.effect;
	}

	public static read(reader: IDataReader<MundaneEffect>, source: string): MundaneEffect {
		return reader.read(source);
	}

	effectType() {
		return "MundaneEffect";
	}
}
