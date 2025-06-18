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

	public static from(data: any): Effect {
		if (data.roll) {
			return PowerRollEffect.from(data);
		} else if (data.name && data.effect) {
			return MundaneEffect.from(data);
		} else if (data.cost && data.effect) {
			return MundaneEffect.from(data);
		} else if (typeof data === "string") {
			return MundaneEffect.nameless(data);
		} else {
			return MundaneEffect.parseKeyValue(data);
		}
	}

	abstract effectType(): string;
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
		return new MundaneEffect(key, undefined, effect);
	}

	static from(data: any) {
		return new MundaneEffect(data.name, data.cost, data.effect);
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

	effectType() {
		return "MundaneEffect";
	}
}
