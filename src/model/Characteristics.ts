import { StatblockDTO } from '../dto';

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

	public static fromDTO(dto: StatblockDTO): Characteristics {
		return new Characteristics(
			dto.might ?? 0,
			dto.agility ?? 0,
			dto.reason ?? 0,
			dto.intuition ?? 0,
			dto.presence ?? 0,
		);
	}
}
