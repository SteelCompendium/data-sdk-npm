import { parse, stringify } from 'yaml';

export class Characteristics {
	might: number;
	agility: number;
	reason: number;
	intuition: number;
	presence: number;

	constructor(might: number, agility: number, reason: number, intuition: number, presence: number) {
		this.might = might;
		this.agility = agility;
		this.reason = reason;
		this.intuition = intuition;
		this.presence = presence;
	}

	public static from(data: any): Characteristics {
		return new Characteristics(
			data.might ? data.might : 0,
			data.agility ? data.agility : 0,
			data.reason ? data.reason : 0,
			data.intuition ? data.intuition : 0,
			data.presence ? data.presence : 0,
		);
	}

	public static fromYaml(yaml: string): Characteristics {
		return Characteristics.from(parse(yaml));
	}

	public static fromJson(json: string): Characteristics {
		return Characteristics.from(JSON.parse(json));
	}

	public toYaml(): string {
		return stringify(this);
	}

	public toJson(): string {
		return JSON.stringify(this);
	}

}
