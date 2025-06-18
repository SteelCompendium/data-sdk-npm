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

}
