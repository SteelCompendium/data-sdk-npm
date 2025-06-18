import { SteelCompendiumPseudoModel } from ".";
export declare abstract class Effect implements SteelCompendiumPseudoModel {
    abstract effectType(): string;
    abstract toDTO(): any;
}
