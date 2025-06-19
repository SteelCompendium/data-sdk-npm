import { Ability } from "../../model/Ability";
import { IDataReader } from "../IDataReader";
export declare class PrereleasePdfAbilityReader implements IDataReader<Ability> {
    read(text: string): Ability;
    private isNewEffect;
    private groupEffectLines;
    private joinAndFormatEffectLines;
    private mapOutcomeToTierKey;
}
