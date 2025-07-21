import { SteelCompendiumPseudoModel } from ".";

export abstract class Effect implements SteelCompendiumPseudoModel {
	abstract effectType(): string;
	abstract toDTO(): any;
    abstract toXmlDTO() : any;
}

