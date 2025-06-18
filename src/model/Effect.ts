export abstract class Effect {
	abstract effectType(): string;
	abstract toDTO(): any;
}

